import { Prisma } from "@prisma/client";

interface CMSServiceFilterParams {
  search?: string;
  isActive?: string;
}

export const buildCMSServiceWhereCondition = (
  params: CMSServiceFilterParams,
): Prisma.ServiceWhereInput => {
  const where: Prisma.ServiceWhereInput = {
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

export const buildCMSServicePaginationParams = (page = "1", limit = "10") => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSServiceSortParams = (
  sortBy = "order",
  order = "asc",
): Prisma.ServiceOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "name", "order"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "order";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
