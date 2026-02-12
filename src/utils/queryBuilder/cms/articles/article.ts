import { Prisma } from "@prisma/client";

interface CMSArticleFilterParams {
  categoryId?: string;
  tagId?: string;
  search?: string;
  status?: string;
  isFeatured?: string;
  serviceId?: string;
  industryId?: string;
}

export const buildCMSArticleWhereCondition = (
  params: CMSArticleFilterParams,
) => {
  const whereCondition: Prisma.ArticleWhereInput = {
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
      { title: { contains: params.search, mode: "insensitive" as const } },
      { excerpt: { contains: params.search, mode: "insensitive" as const } },
      { metaTitle: { contains: params.search, mode: "insensitive" } },
      { metaDescription: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return whereCondition;
};

export const buildCMSArticlePaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export const buildCMSArticlePaginationParams = (
  page: string = "1",
  limit: string = "10",
) => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSArticleSortParams = (
  sortBy: string = "createdAt",
  order: string = "desc",
): Prisma.ArticleOrderByWithRelationInput => {
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
