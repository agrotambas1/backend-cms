"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicEventBySlug = exports.getPublicEvents = void 0;
const db_1 = require("../../../config/db");
const eventIncludePublic_1 = require("../../../includes/public/eventIncludePublic");
const event_1 = require("../../../utils/queryBuilder/public/event/event");
const getPublicEvents = async (req, res) => {
    try {
        const { page = "1", limit = "10", sortBy, order, search, serviceSlug, industrySlug, timeFilter, } = req.query;
        const where = (0, event_1.buildPublicEventWhereCondition)({
            search: search,
            serviceSlug: serviceSlug,
            industrySlug: industrySlug,
            timeFilter: timeFilter,
        });
        const pagination = (0, event_1.buildPublicEventPaginationParams)(page, limit);
        const orderBy = (0, event_1.buildPublicEventSortParams)(sortBy, order);
        const [events, total] = await Promise.all([
            db_1.prisma.event.findMany({
                where,
                select: eventIncludePublic_1.eventPublicSelect,
                orderBy,
                ...pagination,
            }),
            db_1.prisma.event.count({ where }),
        ]);
        res.set({
            "Cache-Control": "public, max-age=300, s-maxage=600",
            "X-Total-Count": total.toString(),
        });
        return res.status(200).json({
            success: true,
            data: events.map(eventIncludePublic_1.transformEventPublic),
            meta: (0, event_1.buildPublicEventPaginationMeta)(total, Number(page), Number(limit)),
        });
    }
    catch (error) {
        console.error("Error fetching events:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch events"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getPublicEvents = getPublicEvents;
const getPublicEventBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required",
            });
        }
        const event = await db_1.prisma.event.findFirst({
            where: {
                slug,
                deletedAt: null,
                status: "published",
            },
            select: eventIncludePublic_1.eventPublicSelect,
        });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }
        res.set({
            "Cache-Control": "public, max-age=600, s-maxage=3600",
        });
        return res.status(200).json({
            success: true,
            data: (0, eventIncludePublic_1.transformEventPublic)(event),
        });
    }
    catch (error) {
        console.error("Error fetching event:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch event"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getPublicEventBySlug = getPublicEventBySlug;
//# sourceMappingURL=eventController.js.map