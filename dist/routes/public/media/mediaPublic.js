"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaControllerPublic_1 = require("../../../controllers/public/media/mediaControllerPublic");
const router = express_1.default.Router();
router.get("/media", mediaControllerPublic_1.getMedia);
router.get("/media/:id", mediaControllerPublic_1.getMediaById);
exports.default = router;
/**
 * @swagger
 * /api/public/media:
 *   get:
 *     summary: Get all public media items
 *     tags: [Media - Public]
 *     responses:
 *       200:
 *         description: A list of media items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/public/media/{id}:
 *   get:
 *     summary: Get public media by ID
 *     tags: [Media - Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details
 *       404:
 *         description: Media not found
 */
//# sourceMappingURL=mediaPublic.js.map