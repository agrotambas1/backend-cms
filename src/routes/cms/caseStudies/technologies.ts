import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { adminOnly } from "../../../middleware/permission";
import {
  createTechnology,
  deleteTechnology,
  getTechnologies,
  updateTechnology,
} from "../../../controllers/cms/caseStudies/technologyController";

const router = express.Router();

router.use(authMiddleware);

router.get("/case-studies-technologies", adminOnly, getTechnologies);

router.post("/case-studies-technologies", adminOnly, createTechnology);

router.put("/case-studies-technologies/:id", adminOnly, updateTechnology);

router.delete("/case-studies-technologies/:id", adminOnly, deleteTechnology);

export default router;

/**
 * @swagger
 * /api/cms/case-studies-technologies:
 *     get:
 *       summary: Get all categories
 *       tags: [Case Studies - Technologies]
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
 *                   $ref: '#/components/schemas/CaseStudiesTechnology'
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies-technologies:
 *   post:
 *      summary: Create a new technology
 *      tags: [Case Studies - Technologies]
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateCaseStudyTechnology'
 *      responses:
 *         201:
 *           description: Technology created successfully
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies-technologies/{id}:
 *   put:
 *      summary: Create a new technology
 *      tags: [Case Studies - Technologies]
 *      security:
 *       - bearerAuth: []
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
 *              $ref: '#/components/schemas/UpdateCaseStudyTechnology'
 *      responses:
 *         201:
 *           description: Technology updated successfully
 *         500:
 *           description: Server error
 */

/**
 * @swagger
 * /api/cms/case-studies-technologies/{id}:
 *   delete:
 *      summary: Delete technology by ID
 *      tags: [Case Studies - Technologies]
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
 *          description: Technology deleted successfully
 *        500:
 *          description: Server error
 */
