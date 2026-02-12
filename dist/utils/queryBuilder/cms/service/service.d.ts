import { Prisma } from "@prisma/client";
interface CMSServiceFilterParams {
    search?: string;
    isActive?: string;
}
export declare const buildCMSServiceWhereCondition: (params: CMSServiceFilterParams) => Prisma.ServiceWhereInput;
export declare const buildCMSServicePaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSServiceSortParams: (sortBy?: string, order?: string) => Prisma.ServiceOrderByWithRelationInput;
export {};
//# sourceMappingURL=service.d.ts.map