import { Prisma } from "@prisma/client";
interface CMSEventFilterParams {
    search?: string;
    status?: string;
    locationType?: string;
    eventType?: string;
    serviceId?: string;
    industryId?: string;
}
export declare const buildCMSEventWhereCondition: (params: CMSEventFilterParams) => Prisma.EventWhereInput;
export declare const buildCMSEventPaginationParams: (page?: string, limit?: string) => {
    skip: number;
    take: number;
};
export declare const buildCMSEventSortParams: (sortBy?: string, order?: string) => Prisma.EventOrderByWithRelationInput;
export {};
//# sourceMappingURL=event.d.ts.map