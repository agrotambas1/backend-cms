"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSBannerSortParams = exports.buildCMSBannerPaginationParams = exports.buildCMSBannerWhereCondition = void 0;
const buildCMSBannerWhereCondition = (params) => {
    const where = {
        deletedAt: null,
    };
    if (params.status) {
        where.status = params.status;
    }
    if (params.search) {
        where.OR = [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
};
exports.buildCMSBannerWhereCondition = buildCMSBannerWhereCondition;
const buildCMSBannerPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSBannerPaginationParams = buildCMSBannerPaginationParams;
const buildCMSBannerSortParams = (sortBy = "createdAt", order = "desc") => {
    const validSortFields = ["createdAt", "order", "title"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSBannerSortParams = buildCMSBannerSortParams;
//# sourceMappingURL=banner.js.map