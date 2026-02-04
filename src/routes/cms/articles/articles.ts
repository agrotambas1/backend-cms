import express from "express";
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  bulkDeleteArticle,
} from "../../../controllers/cms/articles/articleController";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { adminOnly, editorsOnly } from "../../../middleware/permission";

const router = express.Router();
router.use(authMiddleware);

router.get("/articles", getArticles);

router.get("/articles/:id", getArticleById);

router.post("/articles", editorsOnly, createArticle);

router.put("/articles/:id", editorsOnly, updateArticle);

router.delete("/articles/:id", adminOnly, deleteArticle);

router.delete("/articles", adminOnly, bulkDeleteArticle);

export default router;

/**
 * @swagger
 * /api/cms/articles:
 *   get:
 *     summary: Get all article
 *     tags: [Article]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of article
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/articles/{id}:
 *   get:
 *     summary: Get article by ID
 *     tags: [Article]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     article:
 *                       $ref: '#/components/schemas/Article'
 *       400:
 *         description: Article ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Article]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateArticle'
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Article created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     article:
 *                       $ref: '#/components/schemas/Article'
 *       400:
 *         description: Missing required fields or validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Article with the same slug exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/articles/{id}:
 *   put:
 *     summary: Update an existing article
 *     description: |
 *       Update article with optional thumbnail upload.
 *     tags: [Article]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the article to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateArticle'
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Article updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     article:
 *                       $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       409:
 *         description: Slug already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/articles/{id}:
 *   delete:
 *     summary: Delete article (soft delete)
 *     tags: [Article]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Article deleted successfully
 *       400:
 *         description: Article ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/articles:
 *   delete:
 *     summary: Bulk delete article (soft delete)
 *     tags: [Article]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["uuid-1", "uuid-2", "uuid-3"]
 *     responses:
 *       200:
 *         description: Articles deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: 3 article(s) deleted successfully
 *                 deletedCount:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Article IDs are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No article found or already deleted
 *       500:
 *         description: Server error
 */
