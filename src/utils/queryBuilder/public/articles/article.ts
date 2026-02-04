import { Prisma } from "@prisma/client";

interface PublicArticleFilterParams {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  isFeatured?: string;
}

export const buildPublicArticleWhereCondition = (
  params: PublicArticleFilterParams,
): Prisma.ArticleWhereInput => {
  const whereCondition: Prisma.ArticleWhereInput = {
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
      deletedAt: null,
      isActive: true,
    };
  }

  if (params.tagSlug) {
    whereCondition.tags = {
      some: {
        tag: {
          slug: params.tagSlug,
          deletedAt: null,
          isActive: true,
        },
      },
    };
  }

  if (params.search) {
    whereCondition.OR = [
      { title: { contains: params.search, mode: "insensitive" as const } },
      { excerpt: { contains: params.search, mode: "insensitive" as const } },
    ];
  }

  return whereCondition;
};

export const buildPublicArticlePaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export const buildPublicArticlePaginationParams = (
  page: string = "1",
  limit: string = "10",
) => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildPublicArticleSortParams = (
  sortBy: string = "publishedAt",
  order: string = "desc",
): Prisma.ArticleOrderByWithRelationInput => {
  const validSortFields = ["publishedAt", "title", "viewCount"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "publishedAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
