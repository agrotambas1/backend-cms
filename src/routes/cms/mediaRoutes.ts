import express from "express";
import {
  deleteMedia,
  getMedia,
  getMediaById,
  updateMedia,
  uploadMedia,
} from "../../controllers/cms/mediaController";
import { uploadMedia as uploadMiddleware } from "../../middleware/upload";
import { authMiddleware } from "../../middleware/authMiddleware";
import { editorsOnly } from "../../middleware/permission";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/cms/media:
 *   get:
 *     summary: Get all media items
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
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
 * /api/cms/media/{id}:
 *   get:
 *     summary: Get media by ID
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
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

/**
 * @swagger
 * /api/cms/media:
 *   post:
 *     summary: Upload media file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Media file to upload (max 10MB)
 *               alt_text:
 *                 type: string
 *                 description: Alternative text for accessibility
 *               caption:
 *                 type: string
 *                 description: Caption for the media
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: File is required or invalid file type
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/media",
  uploadMiddleware.single("file"),
  editorsOnly,
  uploadMedia
);

/**
 * @swagger
 * /api/cms/media/{id}:
 *   delete:
 *     summary: Delete media
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *       404:
 *         description: Media not found
 *       500:
 *         description: Server error
 */
router.delete("/media/:id", editorsOnly, deleteMedia);

export default router;
