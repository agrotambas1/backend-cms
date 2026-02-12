import { Prisma } from "@prisma/client";
interface PublicCaseStudyFilterParams {
    serviceSlug?: string;
    industrySlug?: string;
    search?: string;
    isFeatured?: string;
}
export declare const buildPublicCaseStudyWhereCondition: (params: PublicCaseStudyFilterParams) => Prisma.CaseStudyWhereInput;
export declare const buildPublicCaseStudyPaginationMeta: (total: number, page: number, limit: number) => {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export declare const buildPublicCaseStudyPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildPublicCaseStudySortParams: (sortBy?: string, order?: string) => Prisma.CaseStudyOrderByWithRelationInput[];
export {};
//# sourceMappingURL=caseStudies.d.ts.map