"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicCaseStudyBySlug = exports.getPublicCaseStudies = void 0;
const db_1 = require("../../../config/db");
const caseStudies_1 = require("../../../utils/queryBuilder/public/caseStudies/caseStudies");
const caseStudiesInclude_1 = require("../../../includes/public/caseStudiesInclude");
const getPublicCaseStudies = async (req, res) => {
    try {
        const { page = "1", limit = "10", sortBy, order, serviceSlug, industrySlug, search, isFeatured, } = req.query;
        const where = (0, caseStudies_1.buildPublicCaseStudyWhereCondition)({
            serviceSlug: serviceSlug,
            industrySlug: industrySlug,
            search: search,
            isFeatured: isFeatured,
        });
        const pagination = (0, caseStudies_1.buildPublicCaseStudyPaginationParams)(page, limit);
        const orderBy = (0, caseStudies_1.buildPublicCaseStudySortParams)(sortBy, order);
        const [caseStudies, total] = await Promise.all([
            db_1.prisma.caseStudy.findMany({
                where,
                select: caseStudiesInclude_1.caseStudyPublicSelect,
                orderBy,
                ...pagination,
            }),
            db_1.prisma.caseStudy.count({ where }),
        ]);
        res.set({
            "Cache-Control": "public, max-age=600, s-maxage=3600",
            "X-Total-Count": total.toString(),
        });
        return res.status(200).json({
            success: true,
            data: caseStudies.map(caseStudiesInclude_1.transformCaseStudyPublic),
            meta: (0, caseStudies_1.buildPublicCaseStudyPaginationMeta)(total, Number(page), Number(limit)),
        });
    }
    catch (error) {
        console.error("Error fetching case studies:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch case studies"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getPublicCaseStudies = getPublicCaseStudies;
const getPublicCaseStudyBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required",
            });
        }
        const caseStudy = await db_1.prisma.caseStudy.findFirst({
            where: {
                slug,
                deletedAt: null,
                status: "published",
                publishedAt: {
                    lte: new Date(),
                },
            },
            select: caseStudiesInclude_1.caseStudyPublicDetailSelect,
        });
        if (!caseStudy) {
            return res.status(404).json({
                success: false,
                message: "Case study not found",
            });
        }
        res.set({
            "Cache-Control": "public, max-age=600, s-maxage=3600",
        });
        return res.status(200).json({
            success: true,
            data: (0, caseStudiesInclude_1.transformCaseStudyPublic)(caseStudy),
        });
    }
    catch (error) {
        console.error("Error fetching case study:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch case study"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getPublicCaseStudyBySlug = getPublicCaseStudyBySlug;
//# sourceMappingURL=caseStudyController.js.map