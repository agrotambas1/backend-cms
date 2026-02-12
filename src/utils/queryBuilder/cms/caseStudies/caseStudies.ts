import { Prisma } from "@prisma/client";

interface CMSCaseStudyFilterParams {
  search?: string;
  status?: string;
  isFeatured?: string;
  serviceId?: string;
  industryId?: string;
  client?: string;
}

export const buildCMSCaseStudyWhereCondition = (
  params: CMSCaseStudyFilterParams,
): Prisma.CaseStudyWhereInput => {
  const where: Prisma.CaseStudyWhereInput = {
    deletedAt: null,
  };

  if (params.status) {
    where.status = params.status;
  }

  if (params.isFeatured !== undefined && params.isFeatured !== "") {
    where.isFeatured = params.isFeatured === "true";
  }

  if (params.client) {
    where.client = {
      contains: params.client,
      mode: "insensitive",
    };
  }

  if (params.serviceId) {
    where.serviceId = params.serviceId;
  }

  if (params.industryId) {
    where.industryId = params.industryId;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { problem: { contains: params.search, mode: "insensitive" } },
      { solution: { contains: params.search, mode: "insensitive" } },
      { client: { contains: params.search, mode: "insensitive" } },
      { metaTitle: { contains: params.search, mode: "insensitive" } },
      { metaDescription: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const buildCMSCaseStudyPaginationParams = (page = "1", limit = "10") => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSCaseStudySortParams = (
  sortBy = "createdAt",
  order = "desc",
): Prisma.CaseStudyOrderByWithRelationInput => {
  const validSortFields = [
    "createdAt",
    "updatedAt",
    "publishedAt",
    "title",
    "client",
  ];

  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
