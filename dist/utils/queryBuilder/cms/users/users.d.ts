import { Prisma } from "@prisma/client";
interface CMSUserFilterParams {
    search?: string;
    isActive?: string;
    role?: string;
}
export declare const buildCMSUserWhereCondition: (params: CMSUserFilterParams) => Prisma.UserWhereInput;
export declare const buildCMSUserPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSUserSortParams: (sortBy?: string, order?: string) => Prisma.UserOrderByWithRelationInput;
export {};
//# sourceMappingURL=users.d.ts.map