import { Prisma } from "@prisma/client";
interface CMSArticleFilterParams {
    categoryId?: string;
    tagId?: string;
    search?: string;
    status?: string;
    isFeatured?: string;
    serviceId?: string;
    industryId?: string;
}
export declare const buildCMSArticleWhereCondition: (params: CMSArticleFilterParams) => Prisma.ArticleWhereInput;
export declare const buildCMSArticlePaginationMeta: (total: number, page: number, limit: number) => {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export declare const buildCMSArticlePaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSArticleSortParams: (sortBy?: string, order?: string) => Prisma.ArticleOrderByWithRelationInput;
export {};
//# sourceMappingURL=article.d.ts.map