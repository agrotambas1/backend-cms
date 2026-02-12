"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPublicCaseStudySortParams = exports.buildPublicCaseStudyPaginationParams = exports.buildPublicCaseStudyPaginationMeta = exports.buildPublicCaseStudyWhereCondition = void 0;
const buildPublicCaseStudyWhereCondition = (params) => {
    const whereCondition = {
        deletedAt: null,
        status: "published",
        publishedAt: {
            lte: new Date(),
        },
    };
    if (params.isFeatured !== undefined && params.isFeatured !== "") {
        whereCondition.isFeatured = params.isFeatured === "true";
    }
    if (params.serviceSlug) {
        whereCondition.service = {
            slug: params.serviceSlug,
        };
    }
    if (params.industrySlug) {
        whereCondition.industry = {
            slug: params.industrySlug,
        };
    }
    if (params.search) {
        whereCondition.OR = [
            {
                title: {
                    contains: params.search,
                    mode: "insensitive",
                },
            },
            {
                client: {
                    contains: params.search,
                    mode: "insensitive",
                },
            },
        ];
    }
    return whereCondition;
};
exports.buildPublicCaseStudyWhereCondition = buildPublicCaseStudyWhereCondition;
const buildPublicCaseStudyPaginationMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});
exports.buildPublicCaseStudyPaginationMeta = buildPublicCaseStudyPaginationMeta;
const buildPublicCaseStudyPaginationParams = (page = "1", limit = "10") => {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
    };
};
exports.buildPublicCaseStudyPaginationParams = buildPublicCaseStudyPaginationParams;
const buildPublicCaseStudySortParams = (sortBy = "publishedAt", order = "desc") => {
    const validSortFields = ["publishedAt", "createdAt", "title", "year"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "publishedAt";
    return [
        { isFeatured: "desc" },
        { [finalSortBy]: order === "desc" ? "desc" : "asc" },
    ];
};
exports.buildPublicCaseStudySortParams = buildPublicCaseStudySortParams;
//# sourceMappingURL=caseStudies.js.map