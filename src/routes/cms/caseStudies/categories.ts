import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { adminOnly } from "../../../middleware/permission";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../controllers/cms/caseStudies/categoryController";

const router = express.Router();

router.use(authMiddleware);

router.get("/case-studies-categories", adminOnly, getCategories);

router.post("/case-studies-categories", adminOnly, createCategory);

router.put("/case-studies-categories/:id", adminOnly, updateCategory);

router.delete("/case-studies-categories/:id", adminOnly, deleteCategory);

export default router;

/**
 * @swagger
 * /api/cms/case-studies-categories:
 *     get:
 *       tags: [Case Studies - Categories]
 *       summary: Get all categories
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
 *                   $ref: '#/components/schemas/CaseStudiesCategory'
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies-categories:
 *   post:
 *      summary: Create a new category
 *      tags: [Case Studies - Categories]
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateCaseStudyCategory'
 *      responses:
 *         201:
 *           description: Category created successfully
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies-categories/{id}:
 *   put:
 *      summary: Update category by ID
 *      tags: [Case Studies - Categories]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateCaseStudyCategory'
 *      responses:
 *         200:
 *           description: Category updated successfully
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies-categories/{id}:
 *   delete:
 *      summary: Delete category by ID
 *      tags: [Case Studies - Categories]
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
 *        500:
 *          description: Server error
 */
