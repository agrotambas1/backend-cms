import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { adminOnly, editorsOnly } from "../../../middleware/permission";
import {
  bulkDeleteCaseStudy,
  createCaseStudy,
  deleteCaseStudy,
  getCaseStudies,
  getCaseStudyById,
  updateCaseStudy,
} from "../../../controllers/cms/caseStudies/caseStudyController";

const router = express.Router();
router.use(authMiddleware);

router.get("/case-studies", getCaseStudies);

router.get("/case-studies/:id", getCaseStudyById);

router.post("/case-studies", editorsOnly, createCaseStudy);

router.put("/case-studies/:id", editorsOnly, updateCaseStudy);

router.delete("/case-studies/:id", adminOnly, deleteCaseStudy);

router.delete("/case-studies", adminOnly, bulkDeleteCaseStudy);

export default router;

/**
 * @swagger
 * /api/cms/case-studies:
 *   get:
 *     summary: Get all case studies
 *     tags: [Case Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of case studies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CaseStudies'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies/{id}:
 *   get:
 *     summary: Get case study by ID
 *     tags: [Case Study]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Case study ID
 *     responses:
 *       200:
 *         description: CaseStudies details
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
 *                     caseStudy:
 *                       $ref: '#/components/schemas/CaseStudies'
 *       400:
 *         description: CaseStudies ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: CaseStudies not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies/:
 *   post:
 *     summary: Create a new case studies
 *     tags: [Case Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCaseStudy'
 *     responses:
 *       201:
 *         description: Case study created successfully
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
 *                   example: Case Study created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     caseStudy:
 *                       $ref: '#/components/schemas/CaseStudy'
 *       400:
 *         description: Missing required fields or validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Case Study with the same slug exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies/{id}:
 *   put:
 *     summary: Update case study by ID
 *     tags: [Case Study]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Case study ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCaseStudy'
 *     responses:
 *       200:
 *         description: Case study updated successfully
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
 *                   example: Case study updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     caseStudy:
 *                       $ref: '#/components/schemas/CaseStudy'
 *       400:
 *         description: Bad request or validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Case study not found
 *       409:
 *         description: Case study with the same slug already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies/{id}:
 *   delete:
 *     summary: Delete case study by ID (soft delete)
 *     tags: [Case Study]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Case study ID
 *     responses:
 *       200:
 *         description: Case study deleted successfully
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
 *                   example: Case study deleted successfully
 *       400:
 *         description: Case study ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Case study not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies:
 *   delete:
 *     summary: Bulk delete case studies (soft delete)
 *     tags: [Case Study]
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
 *         description: Case studies deleted successfully
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
 *                   example: 3 case study(ies) deleted successfully
 *                 deletedCount:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Case study IDs are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No case studies found or already deleted
 *       500:
 *         description: Server error
 */
