import { Prisma } from "@prisma/client";

interface CMSCaseStudiesTechnologyFilterParams {
  search?: string;
}

export const buildCMSCaseStudiesTechnologyWhereCondition = (
  params: CMSCaseStudiesTechnologyFilterParams
): Prisma.CaseStudyTechnologyWhereInput => {
  const where: Prisma.CaseStudyTechnologyWhereInput = {
    deletedAt: null,
  };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const buildCMSCaseStudiesTechnologyPaginationParams = (
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

export const buildCMSCaseStudiesTechnologySortParams = (
  sortBy = "createdAt",
  order = "desc"
): Prisma.CaseStudyTechnologyOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "updatedAt", "name"];

  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
