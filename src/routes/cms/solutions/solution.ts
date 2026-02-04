import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { adminOnly } from "../../../middleware/permission";
import {
  getSolutions,
  getSolutionById,
  createSolution,
  updateSolution,
  deleteSolution,
} from "../../../controllers/cms/solutions/solutionController";

const router = express.Router();

router.use(authMiddleware);

router.get("/solutions", adminOnly, getSolutions);

router.get("/solutions/:id", adminOnly, getSolutionById);

router.post("/solutions", adminOnly, createSolution);

router.put("/solutions/:id", adminOnly, updateSolution);

router.delete("/solutions/:id", adminOnly, deleteSolution);

export default router;

/**
 * @swagger
 * tags:
 *   name: Solutions
 *   description: Solution management endpoints
 */

/**
 * @swagger
 * /api/cms/solutions:
 *   get:
 *     summary: Get all solutions with pagination and filters
 *     tags: [Solutions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Solution'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/solutions/{id}:
 *   get:
 *     summary: Get a solution by ID
 *     tags: [Solutions]
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
 *         description: A list of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Solution'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/solutions:
 *   post:
 *     summary: Create a new solution
 *     tags: [Solutions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSolution'
 *     responses:
 *       201:
 *         description: Solution created successfully
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
 *                     solution:
 *                       $ref: '#/components/schemas/Solution'
 *                 message:
 *                   type: string
 *                   example: Solution created successfully
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Solution name is required"]
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Solution with same slug already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/solutions/{id}:
 *   put:
 *     summary: Update a solution by ID
 *     tags: [Solutions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Solution ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSolution'
 *     responses:
 *       200:
 *         description: Solution updated successfully
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
 *                     solution:
 *                       $ref: '#/components/schemas/Solution'
 *                 message:
 *                   type: string
 *                   example: Solution updated successfully
 *       400:
 *         description: Validation failed or invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Solution not found
 *       409:
 *         description: Solution with same slug already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/solutions/{id}:
 *   delete:
 *     summary: Delete a solution by ID (soft delete)
 *     tags: [Solutions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Solution ID
 *     responses:
 *       200:
 *         description: Solution deleted successfully
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
 *                   example: Solution deleted successfully
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Solution not found
 *       409:
 *         description: Cannot delete - solution is in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot delete solution. It is being used in 5 content item(s)
 *                 usage:
 *                   type: object
 *                   properties:
 *                     caseStudies:
 *                       type: integer
 *                     events:
 *                       type: integer
 *       500:
 *         description: Server error
 */
