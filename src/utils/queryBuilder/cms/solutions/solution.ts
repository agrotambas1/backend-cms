import { Prisma } from "@prisma/client";

interface CMSSolutionFilterParams {
  search?: string;
  isActive?: string;
}

export const buildCMSSolutionWhereCondition = (
  params: CMSSolutionFilterParams,
): Prisma.SolutionWhereInput => {
  const where: Prisma.SolutionWhereInput = {
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

export const buildCMSSolutionPaginationParams = (page = "1", limit = "10") => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSSolutionSortParams = (
  sortBy = "order",
  order = "asc",
): Prisma.SolutionOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "name", "order"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "order";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
