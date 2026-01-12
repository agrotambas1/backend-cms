import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import { ParsedGalleryItem, parseGallery } from "../../../utils/parseHelper";
import { validateEventData } from "../../../validators/eventValidator";
import { eventInclude, transformEvent } from "../../../includes/eventIncludes";

export const getEvents = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const events = await prisma.event.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        thumbnailMedia: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
          },
        },
        images: {
          include: {
            media: {
              select: {
                id: true,
                fileName: true,
                filePath: true,
                altText: true,
                url: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
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
      include: {
        thumbnailMedia: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
          },
        },
        images: {
          include: {
            media: {
              select: {
                id: true,
                fileName: true,
                filePath: true,
                altText: true,
                url: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ message: "Failed to fetch event by ID" });
  }
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
      eventStart,
      eventEnd,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota,
      status,
      isFeatured,
      images,
    } = req.body;

    let parsedImages: ParsedGalleryItem[] = [];
    if (images) {
      try {
        parsedImages = parseGallery(images);
        for (const img of parsedImages) {
          const media = await prisma.media.findUnique({
            where: { id: img.mediaId },
          });
          if (!media || media.deletedAt) {
            return res
              .status(400)
              .json({ message: `Media with ID ${img.mediaId} not found` });
          }
        }
      } catch (err: any) {
        return res
          .status(400)
          .json({ message: err.message || "Invalid images" });
      }
    }

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

    const existingEvent = await prisma.event.findFirst({
      where: { slug, deletedAt: null },
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
      title,
      slug,
      excerpt,
      content,
      thumbnailId: selectedThumbnailId,
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

    if (parsedImages.length > 0) {
      eventData.images = {
        create: parsedImages.map((i) => ({
          mediaId: i.mediaId,
          order: i.order || 0,
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
      eventStart,
      eventEnd,
      location,
      locationType,
      meetingUrl,
      registrationUrl,
      quota,
      status,
      isFeatured,
      images,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existingEvent)
      return res.status(404).json({ message: "Event not found" });

    if (slug && slug !== existingEvent.slug) {
      const slugExists = await prisma.event.findFirst({
        where: { slug, NOT: { id }, deletedAt: null },
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

    let parsedImages: ParsedGalleryItem[] = [];
    if (images) {
      try {
        parsedImages = parseGallery(images);
        for (const img of parsedImages) {
          const media = await prisma.media.findUnique({
            where: { id: img.mediaId },
          });
          if (!media || media.deletedAt) {
            return res
              .status(400)
              .json({ message: `Media with ID ${img.mediaId} not found` });
          }
        }
      } catch (err: any) {
        return res
          .status(400)
          .json({ message: err.message || "Invalid images" });
      }
    }

    const eventData: any = {
      title,
      slug,
      excerpt,
      content,
      thumbnailId: selectedThumbnailId,
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

    if (parsedImages.length > 0) {
      eventData.images = {
        deleteMany: {},
        create: parsedImages.map((i) => ({
          mediaId: i.mediaId,
          order: i.order || 0,
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
