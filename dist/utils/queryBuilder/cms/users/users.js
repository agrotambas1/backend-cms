"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCMSUserSortParams = exports.buildCMSUserPaginationParams = exports.buildCMSUserWhereCondition = void 0;
const buildCMSUserWhereCondition = (params) => {
    const where = {
        deletedAt: null,
    };
    if (params.isActive !== undefined) {
        where.isActive = params.isActive === "true";
    }
    if (params.role) {
        where.role = params.role;
    }
    if (params.search) {
        where.OR = [
            { name: { contains: params.search, mode: "insensitive" } },
            { username: { contains: params.search, mode: "insensitive" } },
            { email: { contains: params.search, mode: "insensitive" } },
        ];
    }
    return where;
};
exports.buildCMSUserWhereCondition = buildCMSUserWhereCondition;
const buildCMSUserPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildCMSUserPaginationParams = buildCMSUserPaginationParams;
const buildCMSUserSortParams = (sortBy = "createdAt", order = "desc") => {
    const validSortFields = ["createdAt", "name", "username", "email", "role"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    return {
        [finalSortBy]: order === "asc" ? "asc" : "desc",
    };
};
exports.buildCMSUserSortParams = buildCMSUserSortParams;
//# sourceMappingURL=users.js.map