"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCaseStudy = exports.caseStudyInclude = void 0;
exports.caseStudyInclude = {
    thumbnailMedia: {
        select: {
            id: true,
            fileName: true,
            altText: true,
            url: true,
        },
    },
    publication: {
        select: {
            id: true,
            fileName: true,
            altText: true,
            url: true,
        },
    },
    service: {
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
        },
    },
    industry: {
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
        },
    },
    creator: {
        select: {
            id: true,
            name: true,
        },
    },
    updater: {
        select: {
            id: true,
            name: true,
        },
    },
};
const transformCaseStudy = (caseStudy) => ({
    ...caseStudy,
    outcomes: caseStudy.outcomes || [],
    seoKeywords: caseStudy.seoKeywords || [],
});
exports.transformCaseStudy = transformCaseStudy;
//# sourceMappingURL=caseStudiesInclude.js.map