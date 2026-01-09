import express from "express";
import {
  getMedia,
  getMediaById,
} from "../../controllers/public/mediaControllerPublic";

const router = express.Router();

/**
 * @swagger
 * /api/public/media:
 *   get:
 *     summary: Get all public media items
 *     tags: [Media]
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
router.get("/media", getMedia);

/**
 * @swagger
 * /api/public/media/{id}:
 *   get:
 *     summary: Get public media by ID
 *     tags: [Media]
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
router.get("/media/:id", getMediaById);

export default router;
