import { Prisma } from "@prisma/client";

interface CMSCaseStudyFilterParams {
  search?: string;
  status?: string;
  isFeatured?: string;
  solutionSlug?: string;
  industrySlug?: string;
  capabilitySlug?: string;
  year?: string;
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

  if (params.solutionSlug) {
    where.solutions = {
      some: {
        solution: {
          slug: params.solutionSlug,
          deletedAt: null,
          isActive: true,
        },
      },
    };
  }

  if (params.industrySlug) {
    where.industries = {
      some: {
        industry: {
          slug: params.industrySlug,
          deletedAt: null,
          isActive: true,
        },
      },
    };
  }

  if (params.capabilitySlug) {
    where.capabilities = {
      some: {
        capability: {
          slug: params.capabilitySlug,
          deletedAt: null,
          isActive: true,
        },
      },
    };
  }

  if (params.year) {
    where.year = Number(params.year);
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { summary: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { content: { contains: params.search, mode: "insensitive" } },
      { problem: { contains: params.search, mode: "insensitive" } },
      { solution: { contains: params.search, mode: "insensitive" } },
      { client: { contains: params.search, mode: "insensitive" } },
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
    "order",
    "title",
    "year",
  ];

  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
