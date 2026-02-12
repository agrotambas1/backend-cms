"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBannerById = exports.getBanners = void 0;
const db_1 = require("../../../config/db");
const bannerIncludePublic_1 = require("../../../includes/public/bannerIncludePublic");
const getBanners = async (req, res) => {
    try {
        const banners = await db_1.prisma.banner.findMany({
            where: {
                deletedAt: null,
                status: "published",
            },
            select: bannerIncludePublic_1.bannerPublicSelect,
            orderBy: {
                order: "asc",
            },
        });
        return res.status(200).json({
            success: true,
            data: banners,
        });
    }
    catch (error) {
        console.error("Error fetching banner:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch banner"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getBanners = getBanners;
const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Banner ID is required" });
        }
        const banner = await db_1.prisma.banner.findUnique({
            where: { id, deletedAt: null, status: "published" },
            select: bannerIncludePublic_1.bannerPublicSelect,
        });
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        res.json({
            status: "success",
            data: { banner },
        });
    }
    catch (error) {
        console.error("Error fetching banner:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch banner"
            : error.message;
        return res.status(500).json({
            success: false,
            message,
        });
    }
};
exports.getBannerById = getBannerById;
//# sourceMappingURL=bannerControllerPublic.js.map