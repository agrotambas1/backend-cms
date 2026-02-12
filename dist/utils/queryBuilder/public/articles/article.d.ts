import { Prisma } from "@prisma/client";
interface PublicArticleFilterParams {
    categorySlug?: string;
    tagSlug?: string;
    search?: string;
    isFeatured?: string;
    serviceSlug?: string;
    industrySlug?: string;
}
export declare const buildPublicArticleWhereCondition: (params: PublicArticleFilterParams) => Prisma.ArticleWhereInput;
export declare const buildPublicArticlePaginationMeta: (total: number, page: number, limit: number) => {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export declare const buildPublicArticlePaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildPublicArticleSortParams: (sortBy?: string, order?: string) => Prisma.ArticleOrderByWithRelationInput[];
export {};
//# sourceMappingURL=article.d.ts.map