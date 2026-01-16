import { Prisma } from "@prisma/client";

interface CMSArticleTagFilterParams {
  search?: string;
  isActive?: string;
}

export const buildCMSArticleTagWhereCondition = (
  params: CMSArticleTagFilterParams
): Prisma.ArticleTagWhereInput => {
  const where: Prisma.ArticleTagWhereInput = {
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

export const buildCMSArticleTagPaginationParams = (
  page = "1",
  limit = "10"
) => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSArticleTagSortParams = (
  sortBy = "createdAt",
  order = "desc"
): Prisma.ArticleTagOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "name"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
