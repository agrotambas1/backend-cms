import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildPublicArticlePaginationMeta,
  buildPublicArticlePaginationParams,
  buildPublicArticleSortParams,
  buildPublicArticleWhereCondition,
} from "../../../utils/queryBuilder/public/articles/article";
import {
  articlePublicDetailSelect,
  articlePublicSelect,
  transformArticlePublic,
} from "../../../includes/public/articlesIncludePublic";

export const getPublicArticles = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy,
      order,
      categorySlug,
      tagSlug,
      search,
      isFeatured,
    } = req.query;

    const where = buildPublicArticleWhereCondition({
      categorySlug: categorySlug as string,
      tagSlug: tagSlug as string,
      search: search as string,
      isFeatured: isFeatured as string,
    });

    const pagination = buildPublicArticlePaginationParams(
      page as string,
      limit as string,
    );

    const orderBy = buildPublicArticleSortParams(
      sortBy as string,
      order as string,
    );

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: articlePublicSelect,
        orderBy,
        ...pagination,
      }),
      prisma.article.count({ where }),
    ]);

    const transformedArticles = articles.map(transformArticlePublic);

    return res.status(200).json({
      success: true,
      data: transformedArticles,
      meta: buildPublicArticlePaginationMeta(
        total,
        Number(page),
        Number(limit),
      ),
    });
  } catch (error) {
    console.error("Error fetching article:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch article"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getPublicArticleBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const article = await prisma.article.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: "published",
        publishedAt: {
          lte: new Date(),
        },
      },
      select: articlePublicDetailSelect,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    // Increment view count
    await prisma.article
      .update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => console.error("Failed to increment views:", err));

    return res.status(200).json({
      success: true,
      data: transformArticlePublic(article),
    });
  } catch (error) {
    console.error("Error fetching article:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch article"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
