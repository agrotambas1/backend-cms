import { Prisma } from "@prisma/client";

interface CMSBannerFilterParams {
  search?: string;
  status?: string;
}

export const buildCMSBannerWhereCondition = (
  params: CMSBannerFilterParams
): Prisma.BannerWhereInput => {
  const where: Prisma.BannerWhereInput = {
    deletedAt: null,
  };

  if (params.status) {
    where.status = params.status;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const buildCMSBannerPaginationParams = (page = "1", limit = "10") => {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
  };
};

export const buildCMSBannerSortParams = (
  sortBy = "createdAt",
  order = "desc"
): Prisma.BannerOrderByWithRelationInput => {
  const validSortFields = ["createdAt", "order", "title"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  return {
    [finalSortBy]: order === "asc" ? "asc" : "desc",
  };
};
