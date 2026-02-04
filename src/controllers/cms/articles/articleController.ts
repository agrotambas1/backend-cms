import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import { parseSeoKeywords, parseTags } from "../../../utils/parseHelper";
import { validateArticleData } from "../../../validators/articleValidator";
import {
  articleInclude,
  transformArticle,
} from "../../../includes/cms/articlesInclude";
import {
  buildCMSArticlePaginationParams,
  buildCMSArticleSortParams,
  buildCMSArticleWhereCondition,
} from "../../../utils/queryBuilder/cms/articles/article";
import sanitizeHtml from "sanitize-html";

export const getArticles = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      page = "1",
      limit = "10",
      sortBy,
      order,
      categorySlug,
      tagSlug,
      search,
      status,
      isFeatured,
    } = req.query;

    const where = buildCMSArticleWhereCondition({
      categorySlug: categorySlug as string,
      tagSlug: tagSlug as string,
      search: search as string,
      status: status as string,
      isFeatured: isFeatured as string,
    });

    const pagination = buildCMSArticlePaginationParams(
      page as string,
      limit as string,
    );

    const orderBy = buildCMSArticleSortParams(
      sortBy as string,
      order as string,
    );

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy,
        ...pagination,
      }),
      prisma.article.count({ where }),
    ]);

    return res.status(200).json({
      data: articles.map(transformArticle),
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch articles"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Article ID is required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: articleInclude,
    });

    if (!article || article.deletedAt) {
      return res.status(404).json({ message: "Article not found" });
    }

    return res.status(200).json({
      status: "success",
      data: transformArticle(article),
    });
  } catch (error) {
    console.error("Error fetching article:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch article"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

const resolveCreateArticleSlug = (slug?: string, title?: string) => {
  if (slug && slug.trim()) {
    return slug.trim().toLowerCase();
  }

  if (title) {
    return generateSlug(title).toLowerCase();
  }

  return null;
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      status,
      publishedAt,
      scheduledAt,
      isFeatured,
      categoryId,
      tags,
      seoKeywords,
      thumbnailId,
      publicationId,
    } = req.body;

    const cleanContent =
      typeof content === "string"
        ? sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
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

    let parsedTags, parsedSeoKeywords;
    try {
      parsedTags = parseTags(tags);
      parsedSeoKeywords = parseSeoKeywords(seoKeywords);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    const validationErrors = validateArticleData({
      title,
      slug,
      excerpt,
      content,
      categoryId,
      tags: parsedTags,
      status,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    const categoryExists = await prisma.articleCategory.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const finalSlug = resolveCreateArticleSlug(slug, title);

    if (!finalSlug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const existingArticle = await prisma.article.findFirst({
      where: { slug: finalSlug, deletedAt: null },
    });

    if (existingArticle) {
      return res
        .status(409)
        .json({ message: "Article with the same slug exists" });
    }

    let selectedThumbnailId: string | null = null;
    if (thumbnailId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: thumbnailId },
      });
      if (!mediaExists) {
        return res
          .status(400)
          .json({ message: "Selected media does not exist" });
      }
      selectedThumbnailId = thumbnailId;
    }

    let selectedPublicationId: string | null = null;
    if (publicationId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: publicationId },
      });
      if (!mediaExists) {
        return res
          .status(400)
          .json({ message: "Selected media does not exist" });
      }
      selectedPublicationId = publicationId;
    }

    const articleData: any = {
      title,
      slug: finalSlug,
      excerpt,
      content: cleanContent,
      thumbnailId: selectedThumbnailId,
      publicationId: selectedPublicationId,
      metaTitle,
      metaDescription,
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
        create: parsedTags.map((tagId: string) => ({
          tagId: tagId.trim(),
        })),
      };
    }

    if (parsedSeoKeywords.length > 0) {
      articleData.seoKeywords = {
        create: parsedSeoKeywords.map((item) => ({
          keyword: item.keyword,
          order: item.order || 0,
        })),
      };
    }

    const article = await prisma.article.create({
      data: articleData,
      include: articleInclude,
    });

    return res.status(201).json({
      status: "success",
      message: "Article created successfully",
      data: {
        article: transformArticle(article),
      },
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return res.status(500).json({
      message: "Failed to create article",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Article ID is required" });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      thumbnailId,
      publicationId,
      metaTitle,
      metaDescription,
      status,
      publishedAt,
      scheduledAt,
      isFeatured,
      categoryId,
      tags,
      seoKeywords,
    } = req.body;

    const existingArticle = await prisma.article.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    const cleanContent =
      typeof content === "string"
        ? sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
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

    let parsedTags, parsedSeoKeywords;
    try {
      parsedTags = parseTags(tags);
      parsedSeoKeywords = parseSeoKeywords(seoKeywords);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    const validationErrors = validateArticleData({
      title,
      slug,
      excerpt,
      content,
      categoryId,
      tags: parsedTags,
      status,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    if (categoryId) {
      const categoryExists = await prisma.articleCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const finalSlug = slug?.trim()
      ? slug.trim().toLowerCase()
      : existingArticle.slug;

    if (slug) {
      const slugExists = await prisma.article.findFirst({
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

    let selectedThumbnailId: string | null = existingArticle.thumbnailId;
    if (thumbnailId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: thumbnailId },
      });
      if (!mediaExists)
        return res
          .status(400)
          .json({ message: "Selected media does not exist" });
      selectedThumbnailId = thumbnailId;
    }

    let selectedPublicationId: string | null = existingArticle.publicationId;
    if (publicationId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: publicationId },
      });
      if (!mediaExists)
        return res
          .status(400)
          .json({ message: "Selected media does not exist" });
      selectedPublicationId = publicationId;
    }

    const articleData: any = {
      title,
      slug: finalSlug,
      excerpt,
      content: cleanContent,
      thumbnailId: selectedThumbnailId,
      publicationId: selectedPublicationId,
      metaTitle,
      metaDescription,
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
        create: parsedTags.map((tagId: string) => ({
          tagId: tagId.trim(),
        })),
      };
    }

    if (parsedSeoKeywords.length > 0) {
      articleData.seoKeywords = {
        deleteMany: {},
        create: parsedSeoKeywords.map((item) => ({
          keyword: item.keyword,
          order: item.order || 0,
        })),
      };
    }

    const article = await prisma.article.update({
      where: { id },
      data: articleData,
      include: articleInclude,
    });

    return res.status(200).json({
      status: "success",
      message: "Article updated successfully",
      data: {
        article: transformArticle(article),
      },
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return res.status(500).json({
      message: "Failed to update article",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
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

    const article = await prisma.article.findFirst({
      where: { id, deletedAt: null },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found or already deleted",
      });
    }

    await prisma.article.update({
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
  } catch (error) {
    console.error("Error deleting article:", error);
    return res.status(500).json({
      message: "Failed to delete article",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const bulkDeleteArticle = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { ids } = req.body as { ids?: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Article IDs are required",
      });
    }

    const articles = await prisma.article.findMany({
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

    await prisma.article.updateMany({
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
  } catch (error) {
    console.error("Error bulk deleting article:", error);
    return res.status(500).json({
      message: "Failed to bulk delete articles",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
