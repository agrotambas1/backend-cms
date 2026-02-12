"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const permission_1 = require("../../../middleware/permission");
const technologyController_1 = require("../../../controllers/cms/caseStudies/technologyController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.get("/case-studies-technologies", permission_1.adminOnly, technologyController_1.getTechnologies);
router.post("/case-studies-technologies", permission_1.adminOnly, technologyController_1.createTechnology);
router.put("/case-studies-technologies/:id", permission_1.adminOnly, technologyController_1.updateTechnology);
router.delete("/case-studies-technologies/:id", permission_1.adminOnly, technologyController_1.deleteTechnology);
exports.default = router;
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
//# sourceMappingURL=technologies.js.map