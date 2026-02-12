"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformEvent = exports.eventInclude = void 0;
exports.eventInclude = {
    thumbnailMedia: {
        select: {
            id: true,
            fileName: true,
            filePath: true,
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
    creator: { select: { id: true, name: true, username: true } },
    updater: { select: { id: true, name: true, username: true } },
};
const transformEvent = (event) => ({
    ...event,
});
exports.transformEvent = transformEvent;
//# sourceMappingURL=eventIncludes.js.map