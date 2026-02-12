"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteEvent = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getEvents = void 0;
const db_1 = require("../../../config/db");
const eventValidator_1 = require("../../../validators/eventValidator");
const eventIncludes_1 = require("../../../includes/cms/eventIncludes");
const event_1 = require("../../../utils/queryBuilder/cms/event/event");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const generateSlug_1 = require("../../../utils/generateSlug");
const getEvents = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { page = "1", limit = "10", sortBy, order, search, status, locationType, eventType, serviceId, industryId, } = req.query;
        const where = (0, event_1.buildCMSEventWhereCondition)({
            search: search,
            status: status,
            locationType: locationType,
            eventType: eventType,
            serviceId: serviceId,
            industryId: industryId,
        });
        const pagination = (0, event_1.buildCMSEventPaginationParams)(page, limit);
        const orderByParams = (0, event_1.buildCMSEventSortParams)(sortBy, order);
        const [events, total] = await Promise.all([
            db_1.prisma.event.findMany({
                where,
                include: eventIncludes_1.eventInclude,
                orderBy: orderByParams,
                ...pagination,
            }),
            db_1.prisma.event.count({ where }),
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
    }
    catch (error) {
        console.error("Error fetching events:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch events"
            : error.message;
        res.status(500).json({ message });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!id) {
            return res.status(400).json({ message: "Event ID is required" });
        }
        const event = await db_1.prisma.event.findUnique({
            where: { id },
            include: eventIncludes_1.eventInclude,
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
            data: (0, eventIncludes_1.transformEvent)(event),
        });
    }
    catch (error) {
        console.error("Error fetching event:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch event"
            : error.message;
        res.status(500).json({ message });
    }
};
exports.getEventById = getEventById;
const resolveCreateEventSlug = (slug, eventName) => {
    if (slug && slug.trim()) {
        return slug.trim().toLowerCase();
    }
    if (eventName) {
        return (0, generateSlug_1.generateSlug)(eventName).toLowerCase();
    }
    return null;
};
const createEvent = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { eventName, slug, excerpt, description, thumbnailId, eventType, eventDate, location, locationType, meetingUrl, registrationUrl, quota, status, serviceId, industryId, } = req.body;
        const cleanDescription = typeof description === "string"
            ? (0, sanitize_html_1.default)(description, {
                allowedTags: sanitize_html_1.default.defaults.allowedTags.concat([
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
        const validationErrors = (0, eventValidator_1.validateEventData)({
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
            const serviceExists = await db_1.prisma.service.findUnique({
                where: { id: serviceId },
            });
            if (!serviceExists) {
                return res.status(400).json({ message: "Service does not exist" });
            }
        }
        if (industryId) {
            const industryExists = await db_1.prisma.industry.findUnique({
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
        const existingEvent = await db_1.prisma.event.findFirst({
            where: { slug: finalSlug, deletedAt: null },
        });
        if (existingEvent) {
            return res
                .status(409)
                .json({ message: "Event with the same slug exists" });
        }
        let selectedThumbnailId = null;
        if (thumbnailId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: thumbnailId },
            });
            if (!mediaExists) {
                return res
                    .status(400)
                    .json({ message: "Selected thumbnail media does not exist" });
            }
            selectedThumbnailId = thumbnailId;
        }
        const eventData = {
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
        const event = await db_1.prisma.event.create({
            data: eventData,
            include: eventIncludes_1.eventInclude,
        });
        return res.status(201).json({
            status: "success",
            message: "Event created successfully",
            data: (0, eventIncludes_1.transformEvent)(event),
        });
    }
    catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({
            message: "Failed to create event",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ message: "Event ID is required" });
        const { eventName, slug, excerpt, description, thumbnailId, eventType, eventDate, location, locationType, meetingUrl, registrationUrl, quota, status, serviceId, industryId, } = req.body;
        const existingEvent = await db_1.prisma.event.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!existingEvent)
            return res.status(404).json({ message: "Event not found" });
        const cleanDescription = typeof description === "string"
            ? (0, sanitize_html_1.default)(description, {
                allowedTags: sanitize_html_1.default.defaults.allowedTags.concat([
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
        const validationErrors = (0, eventValidator_1.validateEventData)(req.body, true);
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
            const slugExists = await db_1.prisma.event.findFirst({
                where: { slug: finalSlug, NOT: { id }, deletedAt: null },
            });
            if (slugExists)
                return res.status(409).json({ message: "Slug already exists" });
        }
        let selectedThumbnailId = existingEvent.thumbnailId;
        if (thumbnailId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: thumbnailId },
            });
            if (!mediaExists) {
                return res
                    .status(400)
                    .json({ message: "Selected thumbnail media does not exist" });
            }
            selectedThumbnailId = thumbnailId;
        }
        const eventData = {
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
        const updatedEvent = await db_1.prisma.event.update({
            where: { id },
            data: eventData,
            include: eventIncludes_1.eventInclude,
        });
        return res.status(200).json({
            status: "success",
            message: "Event updated successfully",
            data: (0, eventIncludes_1.transformEvent)(updatedEvent),
        });
    }
    catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({
            message: "Failed to update event",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Event ID is required" });
        }
        const existingEvent = await db_1.prisma.event.findUnique({
            where: { id },
        });
        if (!existingEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        await db_1.prisma.event.update({
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
    }
    catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({
            message: "Failed to delete event",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteEvent = deleteEvent;
const bulkDeleteEvent = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Event IDs are required",
            });
        }
        const events = await db_1.prisma.event.findMany({
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
        await db_1.prisma.event.updateMany({
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
    }
    catch (error) {
        console.error("Error bulk deleting event:", error);
        return res.status(500).json({
            message: "Failed to bulk delete events",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.bulkDeleteEvent = bulkDeleteEvent;
//# sourceMappingURL=eventController.js.map