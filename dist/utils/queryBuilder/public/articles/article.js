"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPublicArticleSortParams = exports.buildPublicArticlePaginationParams = exports.buildPublicArticlePaginationMeta = exports.buildPublicArticleWhereCondition = void 0;
const buildPublicArticleWhereCondition = (params) => {
    const whereCondition = {
        deletedAt: null,
        status: "published",
        publishedAt: {
            lte: new Date(),
        },
    };
    if (params.isFeatured !== undefined && params.isFeatured !== "") {
        whereCondition.isFeatured = params.isFeatured === "true";
    }
    if (params.categorySlug) {
        whereCondition.category = {
            slug: params.categorySlug,
        };
    }
    if (params.tagSlug) {
        whereCondition.tags = {
            some: {
                tag: {
                    slug: params.tagSlug,
                },
            },
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
            { title: { contains: params.search, mode: "insensitive" } },
            { excerpt: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return whereCondition;
};
exports.buildPublicArticleWhereCondition = buildPublicArticleWhereCondition;
const buildPublicArticlePaginationMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});
exports.buildPublicArticlePaginationMeta = buildPublicArticlePaginationMeta;
const buildPublicArticlePaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildPublicArticlePaginationParams = buildPublicArticlePaginationParams;
const buildPublicArticleSortParams = (sortBy = "publishedAt", order = "desc") => {
    const validSortFields = ["publishedAt", "title", "viewCount"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "publishedAt";
    return [
        { isFeatured: "desc" },
        { [finalSortBy]: order === "asc" ? "asc" : "desc" },
    ];
};
exports.buildPublicArticleSortParams = buildPublicArticleSortParams;
//# sourceMappingURL=article.js.map