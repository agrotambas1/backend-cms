export declare const eventInclude: {
    thumbnailMedia: {
        select: {
            id: true;
            fileName: true;
            filePath: true;
            altText: true;
            url: true;
        };
    };
    service: {
        select: {
            id: true;
            name: true;
            slug: true;
            description: true;
        };
    };
    industry: {
        select: {
            id: true;
            name: true;
            slug: true;
            description: true;
        };
    };
    creator: {
        select: {
            id: true;
            name: true;
            username: true;
        };
    };
    updater: {
        select: {
            id: true;
            name: true;
            username: true;
        };
    };
};
export declare const transformEvent: (event: any) => any;
//# sourceMappingURL=eventIncludes.d.ts.map