import { Prisma } from "@prisma/client";
interface CMSMediaFilterParams {
    search?: string;
    type?: string;
}
export declare const buildCMSMediaWhereCondition: (params: CMSMediaFilterParams) => Prisma.MediaWhereInput;
export declare const buildCMSMediaPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSMediaSortParams: (sortBy?: string, order?: string) => Prisma.MediaOrderByWithRelationInput;
export {};
//# sourceMappingURL=media.d.ts.map