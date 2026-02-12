import { Prisma } from "@prisma/client";
interface CMSIndustryFilterParams {
    search?: string;
    isActive?: string;
}
export declare const buildCMSIndustryWhereCondition: (params: CMSIndustryFilterParams) => Prisma.IndustryWhereInput;
export declare const buildCMSIndustryPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSIndustrySortParams: (sortBy?: string, order?: string) => Prisma.IndustryOrderByWithRelationInput;
export {};
//# sourceMappingURL=industry.d.ts.map