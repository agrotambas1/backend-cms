import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import { parseSeoKeywords, parseTags } from "../../../utils/parseHelper";
import { validateArticleData } from "../../../validators/articleValidator";
import {
  articleInclude,
  transformArticle,
} from "../../../includes/cms/articleInclude";
import {
  buildCMSArticlePaginationParams,
  buildCMSArticleSortParams,
  buildCMSArticleWhereCondition,
} from "../../../utils/queryBuilder/cms/article/article";

// export const getArticles = async (req: Request, res: Response) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const articles = await prisma.article.findMany({
//       where: {
//         deletedAt: null,
//       },
//       include: articleInclude,
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const transformedArticles = articles.map(transformArticle);

//     return res.status(200).json(transformedArticles);
//   } catch (error) {
//     console.error("Error fetching articles:", error);
//     res.status(500).json({ message: "Failed to fetch articles" });
//   }
// };

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
      limit as string
    );

    const orderBy = buildCMSArticleSortParams(
      sortBy as string,
      order as string
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
    res.status(500).json({ message: "Failed to fetch articles" });
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
    res.status(500).json({ message: "Failed to fetch article" });
  }
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
    } = req.body;

    // Parse tags dan keywords
    let parsedTags, parsedSeoKeywords;
    try {
      parsedTags = parseTags(tags);
      parsedSeoKeywords = parseSeoKeywords(seoKeywords);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    // Validasi
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

    // Check category exists
    const categoryExists = await prisma.articleCategory.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    // Check slug unique
    const existingArticle = await prisma.article.findFirst({
      where: { slug, deletedAt: null },
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

    // Prepare data
    const articleData: any = {
      title,
      slug,
      excerpt,
      content,
      thumbnailId: selectedThumbnailId,
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

    // Check article exists
    const existingArticle = await prisma.article.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Parse tags dan keywords
    let parsedTags, parsedSeoKeywords;
    try {
      parsedTags = parseTags(tags);
      parsedSeoKeywords = parseSeoKeywords(seoKeywords);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    // Validasi
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

    // Check category exists
    if (categoryId) {
      const categoryExists = await prisma.articleCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Check slug unique
    if (slug) {
      const slugExists = await prisma.article.findFirst({
        where: {
          slug,
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

    // Prepare update data
    const articleData: any = {
      title,
      slug,
      excerpt,
      content,
      thumbnailId: selectedThumbnailId,
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
