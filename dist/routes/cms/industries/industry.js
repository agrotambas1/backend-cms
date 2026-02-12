"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const permission_1 = require("../../../middleware/permission");
const industryController_1 = require("../../../controllers/cms/industries/industryController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.get("/industries", industryController_1.getIndustries);
// router.get("/industries/:id", getIndustryById);
router.post("/industries", permission_1.adminOnly, industryController_1.createIndustry);
router.put("/industries/:id", permission_1.adminOnly, industryController_1.updateIndustry);
router.delete("/industries/:id", permission_1.adminOnly, industryController_1.deleteIndustry);
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Industries
 *   description: Industry management endpoints
 */
/**
 * @swagger
 * /api/cms/industries:
 *   get:
 *     summary: Get all industries with pagination and filters
 *     tags: [Industries]
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
 *                 $ref: '#/components/schemas/Industries'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// /**
//  * @swagger
//  * /api/cms/industries/{id}:
//  *   get:
//  *     summary: Get a solution by ID
//  *     tags: [Industries]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Article ID
//  *     responses:
//  *       200:
//  *         description: A list of tags
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Industry'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
/**
 * @swagger
 * /api/cms/industries:
 *   post:
 *     summary: Create a new solution
 *     tags: [Industries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIndustry'
 *     responses:
 *       201:
 *         description: Industry created successfully
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
 *                       $ref: '#/components/schemas/Industry'
 *                 message:
 *                   type: string
 *                   example: Industry created successfully
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
 *                   example: ["Industry name is required"]
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Industry with same slug already exists
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/industries/{id}:
 *   put:
 *     summary: Update a solution by ID
 *     tags: [Industries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Industry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIndustry'
 *     responses:
 *       200:
 *         description: Industry updated successfully
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
 *                       $ref: '#/components/schemas/Industry'
 *                 message:
 *                   type: string
 *                   example: Industry updated successfully
 *       400:
 *         description: Validation failed or invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Industry not found
 *       409:
 *         description: Industry with same slug already exists
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/industries/{id}:
 *   delete:
 *     summary: Delete a solution by ID (soft delete)
 *     tags: [Industries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Industry ID
 *     responses:
 *       200:
 *         description: Industry deleted successfully
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
 *                   example: Industry deleted successfully
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Industry not found
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
//# sourceMappingURL=industry.js.map