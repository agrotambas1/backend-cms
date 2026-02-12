"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMediaById = exports.getMedia = void 0;
const db_1 = require("../../../config/db");
const getMedia = async (req, res) => {
    try {
        const mediaItems = await db_1.prisma.media.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(mediaItems);
    }
    catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({ message: "Failed to fetch media" });
    }
};
exports.getMedia = getMedia;
const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Media ID is required" });
        }
        const media = await db_1.prisma.media.findUnique({
            where: { id },
        });
        if (!media || media.deletedAt) {
            return res.status(404).json({ message: "Media not found" });
        }
        res.json({
            status: "success",
            data: { media },
        });
    }
    catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({ message: "Failed to fetch media" });
    }
};
exports.getMediaById = getMediaById;
//# sourceMappingURL=mediaControllerPublic.js.map