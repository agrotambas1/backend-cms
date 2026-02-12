"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSArticleCategorySortParams = exports.buildCMSArticleCategoryPaginationParams = exports.buildCMSArticleCategoryWhereCondition = void 0;
const buildCMSArticleCategoryWhereCondition = (params) => {
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
        ];
    }
    return where;
};
exports.buildCMSArticleCategoryWhereCondition = buildCMSArticleCategoryWhereCondition;
const buildCMSArticleCategoryPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSArticleCategoryPaginationParams = buildCMSArticleCategoryPaginationParams;
const buildCMSArticleCategorySortParams = (sortBy = "createdAt", order = "desc") => {
    const validSortFields = ["createdAt", "name"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSArticleCategorySortParams = buildCMSArticleCategorySortParams;
//# sourceMappingURL=categories.js.map