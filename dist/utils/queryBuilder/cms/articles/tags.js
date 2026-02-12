"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSArticleTagSortParams = exports.buildCMSArticleTagPaginationParams = exports.buildCMSArticleTagWhereCondition = void 0;
const buildCMSArticleTagWhereCondition = (params) => {
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
exports.buildCMSArticleTagWhereCondition = buildCMSArticleTagWhereCondition;
const buildCMSArticleTagPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSArticleTagPaginationParams = buildCMSArticleTagPaginationParams;
const buildCMSArticleTagSortParams = (sortBy = "createdAt", order = "desc") => {
    const validSortFields = ["createdAt", "name"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSArticleTagSortParams = buildCMSArticleTagSortParams;
//# sourceMappingURL=tags.js.map