import express from "express";
import {
  createBanner,
  deleteBanner,
  getBannerById,
  getBanners,
  updateBanner,
} from "../../../controllers/cms/banner/bannerController";
import { uploadMedia as uploadMiddleware } from "../../../middleware/upload";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { editorsOnly } from "../../../middleware/permission";

const router = express.Router();
router.use(authMiddleware);

router.get("/banner", getBanners);

router.get("/banner/:id", getBannerById);

router.post("/banner", editorsOnly, createBanner);

router.put("/banner/:id", editorsOnly, updateBanner);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBanner'
 *     responses:
 *       201:
 *         description: Banner created successfully
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBanner'
 *     responses:
 *       200:
 *         description: Banner updated successfully
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
