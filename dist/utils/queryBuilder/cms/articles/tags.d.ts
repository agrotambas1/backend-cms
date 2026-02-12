import { Prisma } from "@prisma/client";
interface CMSArticleTagFilterParams {
    search?: string;
    isActive?: string;
}
export declare const buildCMSArticleTagWhereCondition: (params: CMSArticleTagFilterParams) => Prisma.ArticleTagWhereInput;
export declare const buildCMSArticleTagPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSArticleTagSortParams: (sortBy?: string, order?: string) => Prisma.ArticleTagOrderByWithRelationInput;
export {};
//# sourceMappingURL=tags.d.ts.map