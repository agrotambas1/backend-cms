"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCaseStudyPublic = exports.caseStudyPublicDetailSelect = exports.caseStudyPublicSelect = void 0;
exports.caseStudyPublicSelect = {
    id: true,
    title: true,
    slug: true,
    overview: true,
    problem: true,
    solution: true,
    outcomesDesc: true,
    outcomes: true,
    client: true,
    status: true,
    publishedAt: true,
    isFeatured: true,
    createdAt: true,
    seoKeywords: true,
    metaTitle: true,
    metaDescription: true,
    thumbnailMedia: {
        select: {
            id: true,
            url: true,
            altText: true,
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
};
exports.caseStudyPublicDetailSelect = {
    id: true,
    title: true,
    slug: true,
    overview: true,
    problem: true,
    solution: true,
    outcomesDesc: true,
    outcomes: true,
    client: true,
    status: true,
    publishedAt: true,
    isFeatured: true,
    createdAt: true,
    seoKeywords: true,
    metaTitle: true,
    metaDescription: true,
    thumbnailMedia: {
        select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
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
};
const transformCaseStudyPublic = (caseStudy) => ({
    ...caseStudy,
    outcomes: caseStudy.outcomes || [],
    seoKeywords: caseStudy.seoKeywords || [],
});
exports.transformCaseStudyPublic = transformCaseStudyPublic;
//# sourceMappingURL=caseStudiesInclude.js.map