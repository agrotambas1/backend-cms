"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSIndustrySortParams = exports.buildCMSIndustryPaginationParams = exports.buildCMSIndustryWhereCondition = void 0;
const buildCMSIndustryWhereCondition = (params) => {
    const where = {
        deletedAt: null,
    };
    if (params.isActive !== undefined && params.isActive !== "") {
        where.isActive = params.isActive === "true";
    }
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { slug: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
};
exports.buildCMSIndustryWhereCondition = buildCMSIndustryWhereCondition;
const buildCMSIndustryPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSIndustryPaginationParams = buildCMSIndustryPaginationParams;
const buildCMSIndustrySortParams = (sortBy = "order", order = "asc") => {
    const validSortFields = ["createdAt", "name", "order"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "order";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSIndustrySortParams = buildCMSIndustrySortParams;
//# sourceMappingURL=industry.js.map