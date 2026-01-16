import { Prisma } from "@prisma/client";

interface CMSEventFilterParams {
  search?: string;
  status?: string;
  isFeatured?: string;
  locationType?: string;
}

export const buildCMSEventWhereCondition = (
  params: CMSEventFilterParams
): Prisma.EventWhereInput => {
  const where: Prisma.EventWhereInput = {
    deletedAt: null,
  };

  if (params.status) {
    where.status = params.status;
  }

  if (params.isFeatured !== undefined && params.isFeatured !== "") {
    where.isFeatured = params.isFeatured === "true";
  }

  if (params.locationType) {
    where.locationType = params.locationType;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { excerpt: { contains: params.search, mode: "insensitive" } },
      { content: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const buildCMSEventPaginationParams = (page = "1", limit = "10") => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSEventSortParams = (
  sortBy = "createdAt",
  order = "desc"
): Prisma.EventOrderByWithRelationInput => {
  const validSortFields = [
    "createdAt",
    "updatedAt",
    "eventStart",
    "eventEnd",
    "title",
  ];

  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
