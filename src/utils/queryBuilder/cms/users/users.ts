import { Prisma } from "@prisma/client";

interface CMSUserFilterParams {
  search?: string;
  isActive?: string;
  role?: string;
}

export const buildCMSUserWhereCondition = (
  params: CMSUserFilterParams
): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {
    deletedAt: null,
  };

  if (params.isActive !== undefined) {
    where.isActive = params.isActive === "true";
  }

  if (params.role) {
    where.role = params.role;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { username: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const buildCMSUserPaginationParams = (page = "1", limit = "10") => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSUserSortParams = (
  sortBy = "createdAt",
  order = "desc"
): Prisma.UserOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "name", "username", "email", "role"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
