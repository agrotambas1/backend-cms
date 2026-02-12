import { Prisma } from "@prisma/client";
interface CMSArticleCategoryFilterParams {
    search?: string;
    isActive?: string;
}
export declare const buildCMSArticleCategoryWhereCondition: (params: CMSArticleCategoryFilterParams) => Prisma.ArticleCategoryWhereInput;
export declare const buildCMSArticleCategoryPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSArticleCategorySortParams: (sortBy?: string, order?: string) => Prisma.ArticleCategoryOrderByWithRelationInput;
export {};
//# sourceMappingURL=categories.d.ts.map