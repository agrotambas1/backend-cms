"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicTagBySlug = exports.getPublicTags = void 0;
const db_1 = require("../../../config/db");
const getPublicTags = async (req, res) => {
    try {
        const tags = await db_1.prisma.articleTag.findMany({
            where: { deletedAt: null, isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
            },
            orderBy: { name: "asc" },
        });
        return res.status(200).json(tags);
    }
    catch (error) {
        console.error("Error fetching Tags:", error);
    }
};
exports.getPublicTags = getPublicTags;
const getPublicTagBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required",
            });
        }
        const tag = await db_1.prisma.articleTag.findFirst({
            where: {
                slug: slug,
                deletedAt: null,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: tag,
        });
    }
    catch (error) {
        console.error("Error fetching tag:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tag",
        });
    }
};
exports.getPublicTagBySlug = getPublicTagBySlug;
//# sourceMappingURL=tagController.js.map