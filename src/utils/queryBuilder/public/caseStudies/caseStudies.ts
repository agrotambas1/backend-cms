import { Prisma } from "@prisma/client";

interface PublicCaseStudyFilterParams {
  serviceSlug?: string;
  industrySlug?: string;
  search?: string;
  isFeatured?: string;
}

export const buildPublicCaseStudyWhereCondition = (
  params: PublicCaseStudyFilterParams,
): Prisma.CaseStudyWhereInput => {
  const whereCondition: Prisma.CaseStudyWhereInput = {
    deletedAt: null,
    status: "published",
    publishedAt: {
      lte: new Date(),
    },
  };

  if (params.isFeatured !== undefined && params.isFeatured !== "") {
    whereCondition.isFeatured = params.isFeatured === "true";
  }

  if (params.serviceSlug) {
    whereCondition.service = {
      slug: params.serviceSlug,
    };
  }

  if (params.industrySlug) {
    whereCondition.industry = {
      slug: params.industrySlug,
    };
  }

  if (params.search) {
    whereCondition.OR = [
      {
        title: {
          contains: params.search,
          mode: "insensitive",
        },
      },
      {
        client: {
          contains: params.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return whereCondition;
};

export const buildPublicCaseStudyPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export const buildPublicCaseStudyPaginationParams = (
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

export const buildPublicCaseStudySortParams = (
  sortBy: string = "publishedAt",
  order: string = "desc",
): Prisma.CaseStudyOrderByWithRelationInput[] => {
  const validSortFields = ["publishedAt", "createdAt", "title", "year"];

  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "publishedAt";

  return [
    { isFeatured: "desc" },
    { [finalSortBy]: order === "desc" ? "desc" : "asc" },
  ];
};
