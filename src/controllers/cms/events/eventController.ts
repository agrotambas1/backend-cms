import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import { ParsedGalleryItem, parseGallery } from "../../../utils/parseHelper";
import { validateEventData } from "../../../validators/eventValidator";
import {
  eventInclude,
  transformEvent,
} from "../../../includes/cms/eventIncludes";
import {
  buildCMSEventPaginationParams,
  buildCMSEventSortParams,
  buildCMSEventWhereCondition,
} from "../../../utils/queryBuilder/cms/event/event";
import sanitizeHtml from "sanitize-html";

export const getEvents = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      page = "1",
      limit = "10",
      sortBy,
      order,
      search,
      status,
      isFeatured,
      locationType,
      eventType,
      solutionSlug,
    } = req.query;

    const where = buildCMSEventWhereCondition({
      search: search as string,
      status: status as string,
      isFeatured: isFeatured as string,
      locationType: locationType as string,
      eventType: eventType as string,
      solutionSlug: solutionSlug as string,
    });

    const pagination = buildCMSEventPaginationParams(
      page as string,
      limit as string,
    );

    const orderByParams = buildCMSEventSortParams(
      sortBy as string,
      order as string,
    );

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: eventInclude,
        orderBy: orderByParams,
        ...pagination,
      }),
      prisma.event.count({ where }),
    ]);

    return res.status(200).json({
      data: events,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch events"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: eventInclude,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    console.error("Error fetching event:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch event"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

const resolveCreateEventSlug = (slug?: string, title?: string) => {
  if (slug && slug.trim()) {
    return slug.trim().toLowerCase();
  }

  if (title) {
    return generateSlug(title).toLowerCase();
  }

  return null;
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      thumbnailId,
      eventType,
      eventStart,
      eventEnd,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota,
      status,
      isFeatured,
      solutions,
    } = req.body;

    const validationErrors = validateEventData({
      title,
      slug,
      eventStart,
      eventEnd,
      locationType,
      location,
      meetingUrl,
      status,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors[0] });
    }

    const cleanContent =
      typeof content === "string"
        ? sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "img",
              "span",
            ]),
            allowedAttributes: false,
            allowedSchemes: ["http", "https", "data"],
            disallowedTagsMode: "discard",
            nonBooleanAttributes: ["style"],
          })
        : "";

    const finalSlug = resolveCreateEventSlug(slug, title);

    if (!finalSlug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const existingEvent = await prisma.event.findFirst({
      where: { slug: finalSlug, deletedAt: null },
    });

    if (existingEvent) {
      return res
        .status(409)
        .json({ message: "Event with the same slug exists" });
    }

    let selectedThumbnailId: string | null = null;
    if (thumbnailId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: thumbnailId },
      });
      if (!mediaExists) {
        return res
          .status(400)
          .json({ message: "Selected thumbnail media does not exist" });
      }
      selectedThumbnailId = thumbnailId;
    }

    if (solutions && solutions.length > 0) {
      const solutionRecords = await prisma.solution.findMany({
        where: {
          id: { in: solutions },
          deletedAt: null,
          isActive: true,
        },
      });

      if (solutionRecords.length !== solutions.length) {
        return res.status(400).json({
          message: "One or more solutions do not exist or are inactive",
        });
      }
    }

    const eventData: any = {
      title,
      slug: finalSlug,
      excerpt,
      content: cleanContent,
      thumbnailId: selectedThumbnailId,
      eventType,
      eventStart: eventStart ? new Date(eventStart) : null,
      eventEnd: eventEnd ? new Date(eventEnd) : null,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota: quota ? parseInt(quota, 10) : null,
      status,
      isFeatured: isFeatured === "true" || isFeatured === true,
      createdBy: req.user.id,
    };

    if (solutions && solutions.length > 0) {
      eventData.solutions = {
        create: solutions.map((solutionId: string) => ({
          solutionId,
        })),
      };
    }

    const event = await prisma.event.create({
      data: eventData,
      include: eventInclude,
    });

    return res.status(201).json({
      status: "success",
      message: "Event created successfully",
      data: transformEvent(event),
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      message: "Failed to create event",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Event ID is required" });

    const {
      title,
      slug,
      excerpt,
      content,
      thumbnailId,
      eventType,
      eventStart,
      eventEnd,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota,
      status,
      isFeatured,
      solutions,
    } = req.body;

    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        solutions: true,
      },
    });

    if (!existingEvent)
      return res.status(404).json({ message: "Event not found" });

    const validationErrors = validateEventData(req.body, true);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const cleanContent =
      typeof content === "string"
        ? sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "img",
              "span",
            ]),
            allowedAttributes: false,
            allowedSchemes: ["http", "https", "data"],
            disallowedTagsMode: "discard",
            nonBooleanAttributes: ["style"],
          })
        : existingEvent.content;

    const finalSlug = slug?.trim()
      ? slug.trim().toLowerCase()
      : existingEvent.slug;

    if (slug && slug !== existingEvent.slug) {
      const slugExists = await prisma.event.findFirst({
        where: { slug: finalSlug, NOT: { id }, deletedAt: null },
      });
      if (slugExists)
        return res.status(409).json({ message: "Slug already exists" });
    }

    let selectedThumbnailId: string | null = existingEvent.thumbnailId;
    if (thumbnailId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: thumbnailId },
      });
      if (!mediaExists) {
        return res
          .status(400)
          .json({ message: "Selected thumbnail media does not exist" });
      }
      selectedThumbnailId = thumbnailId;
    }

    if (solutions !== undefined && solutions.length > 0) {
      const solutionRecords = await prisma.solution.findMany({
        where: {
          id: { in: solutions },
          deletedAt: null,
          isActive: true,
        },
      });

      if (solutionRecords.length !== solutions.length) {
        return res.status(400).json({
          message: "One or more solutions do not exist or are inactive",
        });
      }
    }

    const eventData: any = {
      title,
      slug: finalSlug,
      excerpt,
      content: cleanContent,
      thumbnailId: selectedThumbnailId,
      eventType: eventType !== undefined ? eventType : existingEvent.eventType,
      eventStart: eventStart ? new Date(eventStart) : existingEvent.eventStart,
      eventEnd: eventEnd ? new Date(eventEnd) : existingEvent.eventEnd,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota: quota !== undefined ? parseInt(quota, 10) : existingEvent.quota,
      status,
      isFeatured:
        isFeatured !== undefined
          ? isFeatured === "true" || isFeatured === true
          : existingEvent.isFeatured,
      updatedBy: req.user.id,
    };

    if (solutions !== undefined) {
      eventData.solutions = {
        deleteMany: {}, // Remove all existing solutions
        create: solutions.map((solutionId: string) => ({
          solutionId,
        })),
      };
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: eventData,
      include: eventInclude,
    });

    return res.status(200).json({
      status: "success",
      message: "Event updated successfully",
      data: transformEvent(updatedEvent),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      message: "Failed to update event",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    await prisma.event.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: req.user.id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      message: "Failed to delete event",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const bulkDeleteEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { ids } = req.body as { ids?: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Event IDs are required",
      });
    }

    const events = await prisma.event.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (events.length === 0) {
      return res.status(404).json({
        message: "No events found or already deleted",
      });
    }

    await prisma.event.updateMany({
      where: {
        id: { in: events.map((e) => e.id) },
      },
      data: {
        deletedAt: new Date(),
        updatedBy: req.user.id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: `${events.length} event(s) deleted successfully`,
      deletedCount: events.length,
    });
  } catch (error) {
    console.error("Error bulk deleting event:", error);
    return res.status(500).json({
      message: "Failed to bulk delete events",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
