"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicArticleBySlug = exports.getPublicArticles = void 0;
const db_1 = require("../../../config/db");
const article_1 = require("../../../utils/queryBuilder/public/articles/article");
const articlesIncludePublic_1 = require("../../../includes/public/articlesIncludePublic");
const getPublicArticles = async (req, res) => {
    try {
        const { page = "1", limit = "10", sortBy, order, categorySlug, tagSlug, search, isFeatured, } = req.query;
        const where = (0, article_1.buildPublicArticleWhereCondition)({
            categorySlug: categorySlug,
            tagSlug: tagSlug,
            search: search,
            isFeatured: isFeatured,
        });
        const pagination = (0, article_1.buildPublicArticlePaginationParams)(page, limit);
        const orderBy = (0, article_1.buildPublicArticleSortParams)(sortBy, order);
        const [articles, total] = await Promise.all([
            db_1.prisma.article.findMany({
                where,
                select: articlesIncludePublic_1.articlePublicSelect,
                orderBy,
                ...pagination,
            }),
            db_1.prisma.article.count({ where }),
        ]);
        res.set({
            "Cache-Control": "public, max-age=600, s-maxage=3600",
            "X-Total-Count": total.toString(),
        });
        const transformedArticles = articles.map(articlesIncludePublic_1.transformArticlePublic);
        return res.status(200).json({
            success: true,
            data: transformedArticles,
            meta: (0, article_1.buildPublicArticlePaginationMeta)(total, Number(page), Number(limit)),
        });
    }
    catch (error) {
        console.error("Error fetching article:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch article"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getPublicArticles = getPublicArticles;
const getPublicArticleBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required",
            });
        }
        const article = await db_1.prisma.article.findFirst({
            where: {
                slug,
                deletedAt: null,
                status: "published",
                publishedAt: {
                    lte: new Date(),
                },
            },
            select: articlesIncludePublic_1.articlePublicDetailSelect,
        });
        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }
        res.set({
            "Cache-Control": "public, max-age=600, s-maxage=3600",
        });
        await db_1.prisma.article
            .update({
            where: { id: article.id },
            data: { viewCount: { increment: 1 } },
        })
            .catch((err) => console.error("Failed to increment views:", err));
        return res.status(200).json({
            success: true,
            data: (0, articlesIncludePublic_1.transformArticlePublic)(article),
        });
    }
    catch (error) {
        console.error("Error fetching article:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch article"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getPublicArticleBySlug = getPublicArticleBySlug;
//# sourceMappingURL=articleController.js.map