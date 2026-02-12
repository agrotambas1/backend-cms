"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformEventPublic = exports.eventPublicDetailSelect = exports.eventPublicSelect = void 0;
exports.eventPublicSelect = {
    id: true,
    eventName: true,
    slug: true,
    eventType: true,
    excerpt: true,
    description: true,
    eventDate: true,
    location: true,
    locationType: true,
    quota: true,
    status: true,
    createdAt: true,
    thumbnailMedia: {
        select: {
            id: true,
            url: true,
            altText: true,
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
exports.eventPublicDetailSelect = {
    id: true,
    eventName: true,
    slug: true,
    eventType: true,
    excerpt: true,
    description: true,
    eventDate: true,
    location: true,
    locationType: true,
    quota: true,
    status: true,
    createdAt: true,
    thumbnailMedia: {
        select: {
            id: true,
            url: true,
            altText: true,
            width: true,
            height: true,
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
const transformEventPublic = (event) => ({
    ...event,
});
exports.transformEventPublic = transformEventPublic;
//# sourceMappingURL=eventIncludePublic.js.map