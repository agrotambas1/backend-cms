import { Prisma } from "@prisma/client";
interface PublicEventFilterParams {
    search?: string;
    serviceSlug?: string;
    industrySlug?: string;
    timeFilter?: "upcoming" | "past" | "homepage";
}
export declare const buildPublicEventWhereCondition: (params: PublicEventFilterParams) => Prisma.EventWhereInput;
export declare const buildPublicEventPaginationMeta: (total: number, page: number, limit: number) => {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export declare const buildPublicEventPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildPublicEventSortParams: (sortBy?: string, order?: string) => Prisma.EventOrderByWithRelationInput;
export {};
//# sourceMappingURL=event.d.ts.map