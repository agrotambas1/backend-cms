"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSArticleSortParams = exports.buildCMSArticlePaginationParams = exports.buildCMSArticlePaginationMeta = exports.buildCMSArticleWhereCondition = void 0;
const buildCMSArticleWhereCondition = (params) => {
    const whereCondition = {
        deletedAt: null,
    };
    if (params.status) {
        whereCondition.status = params.status;
    }
    if (params.isFeatured !== undefined && params.isFeatured !== "") {
        whereCondition.isFeatured = params.isFeatured === "true";
    }
    if (params.categoryId) {
        whereCondition.category = {
            id: params.categoryId,
            deletedAt: null,
        };
    }
    if (params.tagId) {
        whereCondition.tags = {
            some: {
                tag: {
                    id: params.tagId,
                    deletedAt: null,
                },
            },
        };
    }
    if (params.serviceId) {
        whereCondition.serviceId = params.serviceId;
    }
    if (params.industryId) {
        whereCondition.industryId = params.industryId;
    }
    if (params.search) {
        whereCondition.OR = [
            { title: { contains: params.search, mode: "insensitive" } },
            { excerpt: { contains: params.search, mode: "insensitive" } },
            { metaTitle: { contains: params.search, mode: "insensitive" } },
            { metaDescription: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return whereCondition;
};
exports.buildCMSArticleWhereCondition = buildCMSArticleWhereCondition;
const buildCMSArticlePaginationMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});
exports.buildCMSArticlePaginationMeta = buildCMSArticlePaginationMeta;
const buildCMSArticlePaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSArticlePaginationParams = buildCMSArticlePaginationParams;
const buildCMSArticleSortParams = (sortBy = "createdAt", order = "desc") => {
    const validSortFields = [
        "createdAt",
        "updatedAt",
        "publishedAt",
        "title",
        "viewCount",
    ];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSArticleSortParams = buildCMSArticleSortParams;
//# sourceMappingURL=article.js.map