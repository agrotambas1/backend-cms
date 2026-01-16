import { Prisma } from "@prisma/client";

interface PublicEventFilterParams {
  search?: string;
  isFeatured?: string;
  upcoming?: string;
}

export const buildPublicEventWhereCondition = (
  params: PublicEventFilterParams
): Prisma.EventWhereInput => {
  const whereCondition: Prisma.EventWhereInput = {
    deletedAt: null,
    status: "published",
  };

  if (params.isFeatured !== undefined && params.isFeatured !== "") {
    whereCondition.isFeatured = params.isFeatured === "true";
  }

  if (params.upcoming === "true") {
    whereCondition.eventEnd = {
      gte: new Date(),
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
        excerpt: {
          contains: params.search,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: params.search,
          mode: "insensitive",
        },
      },
    ];
  }

  return whereCondition;
};

export const buildPublicEventPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export const buildPublicEventPaginationParams = (
  page: string = "1",
  limit: string = "10"
) => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildPublicEventSortParams = (
  sortBy: string = "eventStart",
  order: string = "asc"
): Prisma.EventOrderByWithRelationInput => {
  const validSortFields = ["eventStart", "createdAt", "title"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "eventStart";

  return {
    [finalSortBy]: order === "desc" ? "desc" : "asc",
  };
};
