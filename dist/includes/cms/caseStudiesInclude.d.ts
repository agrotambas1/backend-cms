export declare const caseStudyInclude: {
    thumbnailMedia: {
        select: {
            id: boolean;
            fileName: boolean;
            altText: boolean;
            url: boolean;
        };
    };
    publication: {
        select: {
            id: boolean;
            fileName: boolean;
            altText: boolean;
            url: boolean;
        };
    };
    service: {
        select: {
            id: boolean;
            name: boolean;
            slug: boolean;
            description: boolean;
        };
    };
    industry: {
        select: {
            id: boolean;
            name: boolean;
            slug: boolean;
            description: boolean;
        };
    };
    creator: {
        select: {
            id: boolean;
            name: boolean;
        };
    };
    updater: {
        select: {
            id: boolean;
            name: boolean;
        };
    };
};
export declare const transformCaseStudy: (caseStudy: any) => any;
//# sourceMappingURL=caseStudiesInclude.d.ts.map