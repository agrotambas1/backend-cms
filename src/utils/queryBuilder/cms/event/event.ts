import { Prisma } from "@prisma/client";

interface CMSEventFilterParams {
  search?: string;
  status?: string;
  locationType?: string;
  eventType?: string;
  serviceId?: string;
  industryId?: string;
}

export const buildCMSEventWhereCondition = (
  params: CMSEventFilterParams,
): Prisma.EventWhereInput => {
  const where: Prisma.EventWhereInput = {
    deletedAt: null,
  };

  if (params.status) {
    where.status = params.status;
  }

  if (params.locationType) {
    where.locationType = params.locationType;
  }

  if (params.eventType) {
    where.eventType = params.eventType;
  }

  if (params.serviceId) {
    where.serviceId = params.serviceId;
  }

  if (params.industryId) {
    where.industryId = params.industryId;
  }

  if (params.search) {
    where.OR = [
      { eventName: { contains: params.search, mode: "insensitive" } },
      { excerpt: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
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
  sortBy = "eventDate",
  order = "desc",
): Prisma.EventOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "updatedAt", "eventDate", "eventName"];

  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "eventDate";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
