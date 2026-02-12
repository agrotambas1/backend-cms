import { Prisma } from "@prisma/client";
interface CMSCaseStudyFilterParams {
    search?: string;
    status?: string;
    isFeatured?: string;
    serviceId?: string;
    industryId?: string;
    client?: string;
}
export declare const buildCMSCaseStudyWhereCondition: (params: CMSCaseStudyFilterParams) => Prisma.CaseStudyWhereInput;
export declare const buildCMSCaseStudyPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSCaseStudySortParams: (sortBy?: string, order?: string) => Prisma.CaseStudyOrderByWithRelationInput;
export {};
//# sourceMappingURL=caseStudies.d.ts.map