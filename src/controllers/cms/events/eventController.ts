import { Request, Response } from "express";
import { prisma } from "../../../config/db";
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
import { generateSlug } from "../../../utils/generateSlug";

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
      locationType,
      eventType,
      serviceId,
      industryId,
    } = req.query;

    const where = buildCMSEventWhereCondition({
      search: search as string,
      status: status as string,
      locationType: locationType as string,
      eventType: eventType as string,
      serviceId: serviceId as string,
      industryId: industryId as string,
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

    res.set({
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

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

    res.set({
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    return res.status(200).json({
      status: "success",
      data: transformEvent(event),
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

const resolveCreateEventSlug = (slug?: string, eventName?: string) => {
  if (slug && slug.trim()) {
    return slug.trim().toLowerCase();
  }

  if (eventName) {
    return generateSlug(eventName).toLowerCase();
  }

  return null;
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      eventName,
      slug,
      excerpt,
      description,
      thumbnailId,
      eventType,
      eventDate,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota,
      status,
      serviceId,
      industryId,
    } = req.body;

    const cleanDescription =
      typeof description === "string"
        ? sanitizeHtml(description, {
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

    const validationErrors = validateEventData({
      eventName,
      slug,
      eventDate,
      locationType,
      location,
      meetingUrl,
      status,
      eventType,
      serviceId,
      industryId,
      registrationUrl,
      thumbnailId,
      quota,
      excerpt,
      description,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors[0] });
    }

    if (serviceId) {
      const serviceExists = await prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (!serviceExists) {
        return res.status(400).json({ message: "Service does not exist" });
      }
    }

    if (industryId) {
      const industryExists = await prisma.industry.findUnique({
        where: { id: industryId },
      });

      if (!industryExists) {
        return res.status(400).json({ message: "Industry does not exist" });
      }
    }

    const finalSlug = resolveCreateEventSlug(slug, eventName);

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

    const eventData: any = {
      eventName,
      slug: finalSlug,
      excerpt,
      description: cleanDescription,
      thumbnailId: selectedThumbnailId,
      eventType,
      eventDate: eventDate ? new Date(eventDate) : null,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota: quota ? parseInt(quota, 10) : null,
      status,
      createdBy: req.user.id,
      serviceId,
      industryId,
    };

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
      eventName,
      slug,
      excerpt,
      description,
      thumbnailId,
      eventType,
      eventDate,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota,
      status,
      serviceId,
      industryId,
    } = req.body;

    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingEvent)
      return res.status(404).json({ message: "Event not found" });

    const cleanDescription =
      typeof description === "string"
        ? sanitizeHtml(description, {
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
        : existingEvent.description;

    const validationErrors = validateEventData(req.body, true);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

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

    const eventData: any = {
      eventName,
      slug: finalSlug,
      excerpt,
      description: cleanDescription,
      thumbnailId: selectedThumbnailId,
      eventType: eventType !== undefined ? eventType : existingEvent.eventType,
      eventDate: eventDate ? new Date(eventDate) : existingEvent.eventDate,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota: quota !== undefined ? parseInt(quota, 10) : existingEvent.quota,
      status,
      updatedBy: req.user.id,
      serviceId,
      industryId,
    };

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
