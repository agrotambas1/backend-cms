"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteBanner = exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBannerById = exports.getBanners = void 0;
const db_1 = require("../../../config/db");
const bannerInclude_1 = require("../../../includes/cms/bannerInclude");
const bannerValidator_1 = require("../../../validators/bannerValidator");
const banner_1 = require("../../../utils/queryBuilder/cms/banner/banner");
const getBanners = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { page = "1", limit = "10", search, status, sortBy, order, } = req.query;
        const where = (0, banner_1.buildCMSBannerWhereCondition)({
            search: search,
            status: status,
        });
        const pagination = (0, banner_1.buildCMSBannerPaginationParams)(page, limit);
        const orderBy = (0, banner_1.buildCMSBannerSortParams)(sortBy, order);
        const [banners, total] = await Promise.all([
            db_1.prisma.banner.findMany({
                where,
                include: bannerInclude_1.bannerInclude,
                orderBy,
                ...pagination,
            }),
            db_1.prisma.banner.count({ where }),
        ]);
        return res.status(200).json({
            data: banners,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Error fetching banner:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to fetch banner"
            : error.message;
        res.status(500).json({ message });
    }
};
exports.getBanners = getBanners;
const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Banner ID is required" });
        }
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const banner = await db_1.prisma.banner.findUnique({
            where: { id },
            include: bannerInclude_1.bannerInclude,
        });
        if (!banner || banner.deletedAt) {
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
        res.status(500).json({ message });
    }
};
exports.getBannerById = getBannerById;
const createBanner = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, description, imageId, linkImage, order, status, startDate, endDate, } = req.body;
        const validationErrors = (0, bannerValidator_1.validateBannerData)({
            title,
            description,
            imageId,
            status,
        });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: validationErrors[0],
            });
        }
        let selectedImageId = null;
        if (imageId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: imageId },
            });
            if (!mediaExists) {
                return res.status(400).json({
                    message: `Media with ID ${imageId} not found`,
                });
            }
            selectedImageId = imageId;
        }
        const bannerData = {
            title,
            description,
            imageId: selectedImageId,
            linkImage: linkImage || null,
            order: order ? parseInt(order, 10) : 0,
            status: status || "draft",
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            createdBy: req.user.id,
            updatedBy: req.user.id,
        };
        const banner = await db_1.prisma.banner.create({
            data: bannerData,
            include: bannerInclude_1.bannerInclude,
        });
        return res.status(201).json({
            status: "success",
            message: "Banner created successfully",
            data: { banner },
        });
    }
    catch (error) {
        console.error("Error creating banner:", error);
        return res.status(500).json({
            message: "Failed to create banner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Banner ID is required" });
        }
        const { title, description, imageId, linkImage, order, status, startDate, endDate, } = req.body;
        const existingBanner = await db_1.prisma.banner.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existingBanner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        const validationErrors = (0, bannerValidator_1.validateBannerData)({
            title,
            description,
            imageId,
            status,
        });
        if (validationErrors.length > 0) {
            return res.status(400).json({
                message: validationErrors[0],
            });
        }
        let selectedImageId = existingBanner.imageId;
        if (imageId) {
            const mediaExists = await db_1.prisma.media.findUnique({
                where: { id: imageId },
            });
            if (!mediaExists) {
                return res.status(400).json({
                    message: "Selected media does not exist",
                });
            }
            selectedImageId = imageId;
        }
        const bannerData = {
            title,
            description,
            imageId: selectedImageId,
            linkImage: linkImage || null,
            order: order ? parseInt(order, 10) : 0,
            status: status || "draft",
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            updatedBy: req.user.id,
        };
        const updatedBanner = await db_1.prisma.banner.update({
            where: { id },
            data: bannerData,
            include: bannerInclude_1.bannerInclude,
        });
        return res.status(200).json({
            status: "success",
            message: "Banner updated successfully",
            data: { banner: updatedBanner },
        });
    }
    catch (error) {
        console.error("Error updating banner:", error);
        return res.status(500).json({
            message: "Failed to update banner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Banner ID is required" });
        }
        // Check banner exists
        const banner = await db_1.prisma.banner.findFirst({
            where: { id, deletedAt: null },
        });
        if (!banner) {
            return res.status(404).json({
                message: "Banner not found or already deleted",
            });
        }
        await db_1.prisma.banner.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedBy: req.user.id,
            },
        });
        return res.status(200).json({
            status: "success",
            message: "Banner deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting banner:", error);
        return res.status(500).json({
            message: "Failed to delete banner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteBanner = deleteBanner;
const bulkDeleteBanner = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Banner IDs are required",
            });
        }
        const banners = await db_1.prisma.banner.findMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
            select: { id: true },
        });
        if (banners.length === 0) {
            return res.status(404).json({
                message: "No banners found to delete",
            });
        }
        await db_1.prisma.banner.updateMany({
            where: {
                id: { in: banners.map((b) => b.id) },
            },
            data: {
                deletedAt: new Date(),
                updatedBy: req.user.id,
            },
        });
        return res.status(200).json({
            status: "success",
            message: `${banners.length} banner(s) deleted successfully`,
            deletedCount: banners.length,
        });
    }
    catch (error) {
        console.error("Error bulk deleting banner:", error);
        return res.status(500).json({
            message: "Failed to bulk delete banners",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.bulkDeleteBanner = bulkDeleteBanner;
//# sourceMappingURL=bannerController.js.map