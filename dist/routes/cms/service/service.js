"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const permission_1 = require("../../../middleware/permission");
const serviceController_1 = require("../../../controllers/cms/service/serviceController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.get("/services", serviceController_1.getServices);
// router.get("/services/:id", getServiceById);
router.post("/services", permission_1.adminOnly, serviceController_1.createService);
router.put("/services/:id", permission_1.adminOnly, serviceController_1.updateService);
router.delete("/services/:id", permission_1.adminOnly, serviceController_1.deleteService);
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management endpoints
 */
/**
 * @swagger
 * /api/cms/services:
 *   get:
 *     summary: Get all services with pagination and filters
 *     tags: [Services]
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
 *                 $ref: '#/components/schemas/Service'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// /**
//  * @swagger
//  * /api/cms/services/{id}:
//  *   get:
//  *     summary: Get a solution by ID
//  *     tags: [Services]
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
//  *                 $ref: '#/components/schemas/Service'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
/**
 * @swagger
 * /api/cms/services:
 *   post:
 *     summary: Create a new solution
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateService'
 *     responses:
 *       201:
 *         description: Service created successfully
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
 *                       $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *                   example: Service created successfully
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
 *                   example: ["Service name is required"]
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Service with same slug already exists
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/services/{id}:
 *   put:
 *     summary: Update a solution by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateService'
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                       $ref: '#/components/schemas/Service'
 *                 message:
 *                   type: string
 *                   example: Service updated successfully
 *       400:
 *         description: Validation failed or invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
 *       409:
 *         description: Service with same slug already exists
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/services/{id}:
 *   delete:
 *     summary: Delete a solution by ID (soft delete)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
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
 *                   example: Service deleted successfully
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Service not found
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
//# sourceMappingURL=service.js.map