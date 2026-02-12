"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformArticle = exports.articleInclude = void 0;
exports.articleInclude = {
    thumbnailMedia: {
        select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
        },
    },
    publication: {
        select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
        },
    },
    category: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
    tags: {
        include: {
            tag: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
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
const transformArticle = (article) => ({
    ...article,
    tags: article.tags.map((at) => at.tag) || [],
    seoKeywords: article.seoKeywords || [],
});
exports.transformArticle = transformArticle;
//# sourceMappingURL=articlesInclude.js.map