"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteArticle = exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticleById = exports.getArticles = void 0;
const db_1 = require("../../../config/db");
const parseHelper_1 = require("../../../utils/parseHelper");
const articleValidator_1 = require("../../../validators/articleValidator");
const articlesInclude_1 = require("../../../includes/cms/articlesInclude");
const article_1 = require("../../../utils/queryBuilder/cms/articles/article");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const generateSlug_1 = require("../../../utils/generateSlug");
const getArticles = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { page = "1", limit = "10", sortBy, order, categoryId, tagId, search, status, isFeatured, serviceId, industryId, } = req.query;
        const where = (0, article_1.buildCMSArticleWhereCondition)({
            categoryId: categoryId,
            tagId: tagId,
            search: search,
            status: status,
            isFeatured: isFeatured,
            serviceId: serviceId,
            industryId: industryId,
        });
        const pagination = (0, article_1.buildCMSArticlePaginationParams)(page, limit);
        const orderBy = (0, article_1.buildCMSArticleSortParams)(sortBy, order);
        const [articles, total] = await Promise.all([
            db_1.prisma.article.findMany({
                where,
                include: articlesInclude_1.articleInclude,
                orderBy,
                ...pagination,
            }),
            db_1.prisma.article.count({ where }),
        ]);
        res.set({
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
        });
        return res.status(200).json({
            data: articles.map(articlesInclude_1.transformArticle),
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching articles:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch articles"
            : error.message;
        res.status(500).json({ message });
    }
};
exports.getArticles = getArticles;
const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Article ID is required" });
        }
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const article = await db_1.prisma.article.findUnique({
            where: { id },
            include: articlesInclude_1.articleInclude,
        });
        if (!article || article.deletedAt) {
            return res.status(404).json({ message: "Article not found" });
        }
        res.set({
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
        });
        return res.status(200).json({
            status: "success",
            data: (0, articlesInclude_1.transformArticle)(article),
        });
    }
    catch (error) {
        console.error("Error fetching article:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch article"
            : error.message;
        res.status(500).json({ message });
    }
};
exports.getArticleById = getArticleById;
const resolveCreateArticleSlug = (slug, title) => {
    if (slug && slug.trim()) {
        return slug.trim().toLowerCase();
    }
    if (title) {
        return (0, generateSlug_1.generateSlug)(title).toLowerCase();
    }
    return null;
};
const createArticle = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, slug, excerpt, content, metaTitle, metaDescription, status, publishedAt, scheduledAt, isFeatured, categoryId, tags, seoKeywords, thumbnailId, publicationId, serviceId, industryId, } = req.body;
        const cleanContent = typeof content === "string"
            ? (0, sanitize_html_1.default)(content, {
                allowedTags: sanitize_html_1.default.defaults.allowedTags.concat([
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "img",
                    "span",
                ]),
                allowedAttributes: false,
                allowedSchemes: ["http", "https", "data"],
                disallowedTagsMode: "discard",
                nonBooleanAttributes: ["style"],
            })
            : "";
        let parsedTags;
        try {
            parsedTags = (0, parseHelper_1.parseTags)(tags);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Invalid format",
            });
        }
        let parsedSeoKeywords = [];
        if (seoKeywords) {
            try {
                if (typeof seoKeywords === "string") {
                    parsedSeoKeywords = JSON.parse(seoKeywords);
                }
                else if (Array.isArray(seoKeywords)) {
                    parsedSeoKeywords = seoKeywords;
                }
                else {
                    return res.status(400).json({
                        message: "seoKeywords must be an array of strings",
                    });
                }
                if (!parsedSeoKeywords.every((k) => typeof k === "string")) {
                    return res.status(400).json({
                        message: "All SEO keywords must be strings",
                    });
                }
            }
            catch (error) {
                return res.status(400).json({
                    message: "Invalid seoKeywords format",
                });
            }
        }
        const validationErrors = (0, articleValidator_1.validateArticleData)({
            title,
            slug,
            excerpt,
            content,
            categoryId,
            tags: parsedTags,
            serviceId,
            industryId,
            status,
            metaTitle,
            metaDescription,
            seoKeywords: parsedSeoKeywords,
        });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: validationErrors[0],
            });
        }
        const categoryExists = await db_1.prisma.articleCategory.findUnique({
            where: { id: categoryId },
        });
        if (!categoryExists) {
            return res.status(400).json({ message: "Category does not exist" });
        }
        if (serviceId) {
            const serviceExists = await db_1.prisma.service.findUnique({
                where: { id: serviceId },
            });
            if (!serviceExists) {
                return res.status(400).json({ message: "Service does not exist" });
            }
        }
        if (industryId) {
            const industryExists = await db_1.prisma.industry.findUnique({
                where: { id: industryId },
            });
            if (!industryExists) {
                return res.status(400).json({ message: "Industry does not exist" });
            }
        }
        const finalSlug = resolveCreateArticleSlug(slug, title);
        if (!finalSlug) {
            return res.status(400).json({ message: "Slug is required" });
        }
        const existingArticle = await db_1.prisma.article.findFirst({
            where: { slug: finalSlug, deletedAt: null },
        });
        if (existingArticle) {
            return res
                .status(409)
                .json({ message: "Article with the same slug exists" });
        }
        let selectedThumbnailId = null;
        if (thumbnailId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: thumbnailId },
            });
            if (!mediaExists) {
                return res
                    .status(400)
                    .json({ message: "Selected media does not exist" });
            }
            selectedThumbnailId = thumbnailId;
        }
        let selectedPublicationId = null;
        if (publicationId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: publicationId },
            });
            if (!mediaExists) {
                return res
                    .status(400)
                    .json({ message: "Selected media does not exist" });
            }
            selectedPublicationId = publicationId;
        }
        const articleData = {
            title,
            slug: finalSlug,
            excerpt,
            content: cleanContent,
            thumbnailId: selectedThumbnailId,
            publicationId: selectedPublicationId,
            serviceId,
            industryId,
            metaTitle,
            metaDescription,
            seoKeywords: parsedSeoKeywords.length > 0 ? parsedSeoKeywords : null,
            status,
            publishedAt: publishedAt ? new Date(publishedAt) : null,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            isFeatured: isFeatured === "true" || isFeatured === true,
            categoryId,
            createdBy: req.user.id,
            updatedBy: req.user.id,
        };
        if (parsedTags.length > 0) {
            articleData.tags = {
                create: parsedTags.map((tagId) => ({
                    tagId: tagId.trim(),
                })),
            };
        }
        const article = await db_1.prisma.article.create({
            data: articleData,
            include: articlesInclude_1.articleInclude,
        });
        return res.status(201).json({
            status: "success",
            message: "Article created successfully",
            data: {
                article: (0, articlesInclude_1.transformArticle)(article),
            },
        });
    }
    catch (error) {
        console.error("Error creating article:", error);
        return res.status(500).json({
            message: "Failed to create article",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createArticle = createArticle;
const updateArticle = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Article ID is required" });
        }
        const { title, slug, excerpt, content, thumbnailId, publicationId, metaTitle, metaDescription, seoKeywords, status, publishedAt, scheduledAt, isFeatured, categoryId, tags, serviceId, industryId, } = req.body;
        const existingArticle = await db_1.prisma.article.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existingArticle) {
            return res.status(404).json({ message: "Article not found" });
        }
        const cleanContent = typeof content === "string"
            ? (0, sanitize_html_1.default)(content, {
                allowedTags: sanitize_html_1.default.defaults.allowedTags.concat([
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "img",
                    "span",
                ]),
                allowedAttributes: false,
                allowedSchemes: ["http", "https", "data"],
                disallowedTagsMode: "discard",
                nonBooleanAttributes: ["style"],
            })
            : existingArticle.content;
        let parsedTags;
        try {
            parsedTags = (0, parseHelper_1.parseTags)(tags);
        }
        catch (error) {
            return res.status(400).json({
                message: error instanceof Error ? error.message : "Invalid format",
            });
        }
        let parsedSeoKeywords = [];
        if (seoKeywords) {
            try {
                if (typeof seoKeywords === "string") {
                    parsedSeoKeywords = JSON.parse(seoKeywords);
                }
                else if (Array.isArray(seoKeywords)) {
                    parsedSeoKeywords = seoKeywords;
                }
                else {
                    return res.status(400).json({
                        message: "seoKeywords must be an array of strings",
                    });
                }
                if (!parsedSeoKeywords.every((k) => typeof k === "string")) {
                    return res.status(400).json({
                        message: "All SEO keywords must be strings",
                    });
                }
            }
            catch (error) {
                return res.status(400).json({
                    message: "Invalid seoKeywords format",
                });
            }
        }
        const validationErrors = (0, articleValidator_1.validateArticleData)({
            title,
            slug,
            excerpt,
            content,
            metaTitle,
            metaDescription,
            seoKeywords: parsedSeoKeywords,
            categoryId,
            tags: parsedTags,
            status,
            serviceId,
            industryId,
        });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: validationErrors[0],
            });
        }
        if (categoryId) {
            const categoryExists = await db_1.prisma.articleCategory.findUnique({
                where: { id: categoryId },
            });
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
        }
        if (serviceId) {
            const serviceExists = await db_1.prisma.service.findUnique({
                where: { id: serviceId },
            });
            if (!serviceExists) {
                return res.status(404).json({ message: "Service not found" });
            }
        }
        if (industryId) {
            const industryExists = await db_1.prisma.industry.findUnique({
                where: { id: industryId },
            });
            if (!industryExists) {
                return res.status(404).json({ message: "Industry not found" });
            }
        }
        const finalSlug = slug?.trim()
            ? slug.trim().toLowerCase()
            : existingArticle.slug;
        if (slug) {
            const slugExists = await db_1.prisma.article.findFirst({
                where: {
                    slug: finalSlug,
                    NOT: { id },
                    deletedAt: null,
                },
            });
            if (slugExists) {
                return res.status(409).json({ message: "Slug already exists" });
            }
        }
        let selectedThumbnailId = existingArticle.thumbnailId;
        if (thumbnailId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: thumbnailId },
            });
            if (!mediaExists)
                return res
                    .status(400)
                    .json({ message: "Selected media does not exist" });
            selectedThumbnailId = thumbnailId;
        }
        let selectedPublicationId = existingArticle.publicationId;
        if (publicationId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: publicationId },
            });
            if (!mediaExists)
                return res
                    .status(400)
                    .json({ message: "Selected media does not exist" });
            selectedPublicationId = publicationId;
        }
        const articleData = {
            title,
            slug: finalSlug,
            excerpt,
            content: cleanContent,
            thumbnailId: selectedThumbnailId,
            publicationId: selectedPublicationId,
            serviceId,
            industryId,
            metaTitle,
            metaDescription,
            seoKeywords: parsedSeoKeywords.length > 0 ? parsedSeoKeywords : null,
            status,
            publishedAt: publishedAt ? new Date(publishedAt) : null,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            isFeatured: isFeatured === "true" || isFeatured === true,
            categoryId,
            updatedBy: req.user.id,
        };
        if (parsedTags.length > 0) {
            articleData.tags = {
                deleteMany: {},
                create: parsedTags.map((tagId) => ({
                    tagId: tagId.trim(),
                })),
            };
        }
        const article = await db_1.prisma.article.update({
            where: { id },
            data: articleData,
            include: articlesInclude_1.articleInclude,
        });
        return res.status(200).json({
            status: "success",
            message: "Article updated successfully",
            data: {
                article: (0, articlesInclude_1.transformArticle)(article),
            },
        });
    }
    catch (error) {
        console.error("Error updating article:", error);
        return res.status(500).json({
            message: "Failed to update article",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateArticle = updateArticle;
const deleteArticle = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Article ID is required",
            });
        }
        const article = await db_1.prisma.article.findFirst({
            where: { id, deletedAt: null },
        });
        if (!article) {
            return res.status(404).json({
                message: "Article not found or already deleted",
            });
        }
        await db_1.prisma.article.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedBy: req.user.id,
            },
        });
        return res.status(200).json({
            status: "success",
            message: "Article deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting article:", error);
        return res.status(500).json({
            message: "Failed to delete article",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteArticle = deleteArticle;
const bulkDeleteArticle = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Article IDs are required",
            });
        }
        const articles = await db_1.prisma.article.findMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
            select: { id: true },
        });
        if (articles.length === 0) {
            return res.status(404).json({
                message: "No articles found or already deleted",
            });
        }
        await db_1.prisma.article.updateMany({
            where: {
                id: { in: articles.map((a) => a.id) },
            },
            data: {
                deletedAt: new Date(),
                updatedBy: req.user.id,
            },
        });
        return res.status(200).json({
            status: "success",
            message: `${articles.length} article(s) deleted successfully`,
            deletedCount: articles.length,
        });
    }
    catch (error) {
        console.error("Error bulk deleting article:", error);
        return res.status(500).json({
            message: "Failed to bulk delete articles",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.bulkDeleteArticle = bulkDeleteArticle;
//# sourceMappingURL=articleController.js.map