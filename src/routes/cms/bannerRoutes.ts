import express from "express";
import {
  createBannerWithMedia,
  deleteBanner,
  getBannerById,
  getBanners,
  updateBannerWithMedia,
} from "../../controllers/cms/bannerController";
import { uploadMedia as uploadMiddleware } from "../../middleware/upload";
import { authMiddleware } from "../../middleware/authMiddleware";
import { editorsOnly } from "../../middleware/permission";

const router = express.Router();
router.use(authMiddleware);

router.get("/banner", getBanners);

router.get("/banner/:id", getBannerById);

router.post(
  "/banner",
  uploadMiddleware.single("file"),
  editorsOnly,
  createBannerWithMedia
);

router.put(
  "/banner/:id",
  uploadMiddleware.single("file"),
  editorsOnly,
  updateBannerWithMedia
);

router.delete("/banner/:id", editorsOnly, deleteBanner);

export default router;

/**
 * @swagger
 * /api/cms/banner:
 *   get:
 *     summary: Get all banners
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/banner/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banner]
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
 *         description: Banner details
 *       404:
 *         description: Banner not found
 */

/**
 * @swagger
 * /api/cms/banner:
 *   post:
 *     summary: Create a new banner with file upload
 *     tags: [Banner]
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
 *               - title
 *               - description
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Banner file to upload (max 10MB)
 *               title:
 *                 type: string
 *                 description: Title of the banner
 *               description:
 *                 type: string
 *                 description: Description of the banner
 *               alt_text:
 *                 type: string
 *                 description: Alternative text for accessibility
 *               caption:
 *                 type: string
 *                 description: Caption for the banner
 *               linkImage:
 *                 type: string
 *                 description: Optional link when banner is clicked
 *               order:
 *                 type: integer
 *                 description: Banner display order
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 description: Banner status
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner start date (optional)
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner end date (optional)
 *     responses:
 *       201:
 *         description: Banner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       400:
 *         description: File, title, or description is missing or invalid
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/banner/{id}:
 *   put:
 *     summary: Update an existing banner with file upload
 *     tags: [Banner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the banner to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Banner file to upload (max 10MB)
 *               title:
 *                 type: string
 *                 description: Title of the banner
 *               description:
 *                 type: string
 *                 description: Description of the banner
 *               alt_text:
 *                 type: string
 *                 description: Alternative text for accessibility
 *               caption:
 *                 type: string
 *                 description: Caption for the banner
 *               linkImage:
 *                 type: string
 *                 description: Optional link when banner is clicked
 *               order:
 *                 type: integer
 *                 description: Banner display order
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *                 description: Banner status
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner start date (optional)
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Banner end date (optional)
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/banner/{id}:
 *   delete:
 *     summary: Delete banner
 *     tags: [Banner]
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
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
