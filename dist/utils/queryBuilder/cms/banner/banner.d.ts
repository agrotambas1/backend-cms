import { Prisma } from "@prisma/client";
interface CMSBannerFilterParams {
    search?: string;
    status?: string;
}
export declare const buildCMSBannerWhereCondition: (params: CMSBannerFilterParams) => Prisma.BannerWhereInput;
export declare const buildCMSBannerPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSBannerSortParams: (sortBy?: string, order?: string) => Prisma.BannerOrderByWithRelationInput;
export {};
//# sourceMappingURL=banner.d.ts.map