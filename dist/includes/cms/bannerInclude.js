"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerInclude = void 0;
exports.bannerInclude = {
    image: {
        select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
        },
    },
    creator: {
        select: {
            id: true,
            name: true,
            username: true,
        },
    },
    updater: {
        select: {
            id: true,
            name: true,
            username: true,
        },
    },
};
//# sourceMappingURL=bannerInclude.js.map