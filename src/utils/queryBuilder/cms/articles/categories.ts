import { Prisma } from "@prisma/client";

interface CMSArticleCategoryFilterParams {
  search?: string;
  isActive?: string;
}

export const buildCMSArticleCategoryWhereCondition = (
  params: CMSArticleCategoryFilterParams,
): Prisma.ArticleCategoryWhereInput => {
  const where: Prisma.ArticleCategoryWhereInput = {
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

export const buildCMSArticleCategoryPaginationParams = (
  page = "1",
  limit = "10",
) => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSArticleCategorySortParams = (
  sortBy = "createdAt",
  order = "desc",
): Prisma.ArticleCategoryOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "name"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
