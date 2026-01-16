import { Prisma } from "@prisma/client";

interface CMSCaseStudiesCategoryFilterParams {
  search?: string;
  isActive?: string;
}

export const buildCMSCaseStudiesCategoryWhereCondition = (
  params: CMSCaseStudiesCategoryFilterParams
): Prisma.CaseStudyCategoryWhereInput => {
  const where: Prisma.CaseStudyCategoryWhereInput = {
    deletedAt: null,
  };

  if (params.isActive !== undefined && params.isActive !== "") {
    where.isActive = params.isActive === "true";
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const buildCMSCaseStudiesCategoryPaginationParams = (
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

export const buildCMSCaseStudiesCategorySortParams = (
  sortBy = "createdAt",
  order = "desc"
): Prisma.CaseStudyCategoryOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "updatedAt", "name", "order"];

  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
