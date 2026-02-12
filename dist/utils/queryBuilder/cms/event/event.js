"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSEventSortParams = exports.buildCMSEventPaginationParams = exports.buildCMSEventWhereCondition = void 0;
const buildCMSEventWhereCondition = (params) => {
    const where = {
        deletedAt: null,
    };
    if (params.status) {
        where.status = params.status;
    }
    if (params.locationType) {
        where.locationType = params.locationType;
    }
    if (params.eventType) {
        where.eventType = params.eventType;
    }
    if (params.serviceId) {
        where.serviceId = params.serviceId;
    }
    if (params.industryId) {
        where.industryId = params.industryId;
    }
    if (params.search) {
        where.OR = [
            { eventName: { contains: params.search, mode: "insensitive" } },
            { excerpt: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
            { location: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
};
exports.buildCMSEventWhereCondition = buildCMSEventWhereCondition;
const buildCMSEventPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSEventPaginationParams = buildCMSEventPaginationParams;
const buildCMSEventSortParams = (sortBy = "eventDate", order = "desc") => {
    const validSortFields = ["createdAt", "updatedAt", "eventDate", "eventName"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "eventDate";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSEventSortParams = buildCMSEventSortParams;
//# sourceMappingURL=event.js.map