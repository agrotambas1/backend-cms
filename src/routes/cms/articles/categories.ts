import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../controllers/cms/articles/categoryController";

import { authMiddleware } from "../../../middleware/authMiddleware";
import { adminOnly } from "../../../middleware/permission";

const router = express.Router();

router.use(authMiddleware);

router.get("/article-categories", getCategories);

router.post("/article-categories", adminOnly, createCategory);

router.put("/article-categories/:id", adminOnly, updateCategory);

router.delete("/article-categories/:id", adminOnly, deleteCategory);

export default router;

/**
 * @swagger
 * /api/cms/article-categories:
 *     get:
 *       summary: Get all categories
 *       tags: [Insight - Categories]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: A list of categories
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Category'
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/article-categories:
 *   post:
 *      summary: Create a new category
 *      tags: [Insight - Categories]
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateCategory'
 *      responses:
 *         201:
 *           description: Category created successfully
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/article-categories/{id}:
 *   put:
 *      summary: Update category by ID
 *      tags: [Insight - Categories]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateCategory'
 *      responses:
 *        200:
 *          description: Category updated successfully
 *        404:
 *          description: Category not found
 *        500:
 *          description: Server error
 */

/**
 * @swagger
 * /api/cms/article-categories/{id}:
 *   delete:
 *      summary: Delete category by ID
 *      tags: [Insight - Categories]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Category deleted successfully
 *        404:
 *          description: Category not found
 *        500:
 *          description: Server error
 */
