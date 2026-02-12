"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPublicEventSortParams = exports.buildPublicEventPaginationParams = exports.buildPublicEventPaginationMeta = exports.buildPublicEventWhereCondition = void 0;
const buildPublicEventWhereCondition = (params) => {
    const whereCondition = {
        deletedAt: null,
        status: "published",
    };
    if (params.timeFilter === "homepage") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const next30Days = new Date(today);
        next30Days.setDate(next30Days.getDate() + 30);
        whereCondition.eventDate = {
            gte: yesterday,
            lte: next30Days,
        };
    }
    else if (params.timeFilter === "upcoming") {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        whereCondition.eventDate = {
            gte: now,
        };
    }
    else if (params.timeFilter === "past") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        whereCondition.eventDate = {
            lt: today,
        };
    }
    if (params.serviceSlug) {
        whereCondition.service = {
            slug: params.serviceSlug,
        };
    }
    if (params.industrySlug) {
        whereCondition.industry = {
            slug: params.industrySlug,
        };
    }
    if (params.search) {
        whereCondition.OR = [
            {
                eventName: {
                    contains: params.search,
                    mode: "insensitive",
                },
            },
            {
                excerpt: {
                    contains: params.search,
                    mode: "insensitive",
                },
            },
        ];
    }
    return whereCondition;
};
exports.buildPublicEventWhereCondition = buildPublicEventWhereCondition;
const buildPublicEventPaginationMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});
exports.buildPublicEventPaginationMeta = buildPublicEventPaginationMeta;
const buildPublicEventPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildPublicEventPaginationParams = buildPublicEventPaginationParams;
const buildPublicEventSortParams = (sortBy = "eventDate", order = "asc") => {
    const validSortFields = ["eventDate", "createdAt", "eventName"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "eventDate";
    return {
        [finalSortBy]: order === "desc" ? "desc" : "asc",
    };
};
exports.buildPublicEventSortParams = buildPublicEventSortParams;
//# sourceMappingURL=event.js.map