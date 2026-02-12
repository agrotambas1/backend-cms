"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSMediaSortParams = exports.buildCMSMediaPaginationParams = exports.buildCMSMediaWhereCondition = void 0;
const buildCMSMediaWhereCondition = (params) => {
    const where = {
        deletedAt: null,
    };
    if (params.search) {
        where.OR = [
            { title: { contains: params.search, mode: "insensitive" } },
            { description: { contains: params.search, mode: "insensitive" } },
            { altText: { contains: params.search, mode: "insensitive" } },
            { caption: { contains: params.search, mode: "insensitive" } },
            { mimeType: { contains: params.search, mode: "insensitive" } },
        ];
    }
    if (params.type) {
        if (params.type === "image") {
            where.mimeType = { startsWith: "image/" };
        }
        if (params.type === "video") {
            where.mimeType = { startsWith: "video/" };
        }
        if (params.type === "document") {
            where.mimeType = {
                in: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ],
            };
        }
    }
    return where;
};
exports.buildCMSMediaWhereCondition = buildCMSMediaWhereCondition;
const buildCMSMediaPaginationParams = (page = "1", limit = "20") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSMediaPaginationParams = buildCMSMediaPaginationParams;
const buildCMSMediaSortParams = (sortBy = "createdAt", order = "desc") => {
    const validSortFields = ["createdAt", "fileSize"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSMediaSortParams = buildCMSMediaSortParams;
//# sourceMappingURL=media.js.map