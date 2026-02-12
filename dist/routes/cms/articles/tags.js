"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const permission_1 = require("../../../middleware/permission");
const tagController_1 = require("../../../controllers/cms/articles/tagController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.get("/article-tags", tagController_1.getTags);
router.post("/article-tags", permission_1.adminOnly, tagController_1.createTag);
router.put("/article-tags/:id", permission_1.adminOnly, tagController_1.updateTag);
router.delete("/article-tags/:id", permission_1.adminOnly, tagController_1.deleteTag);
exports.default = router;
/**
 * @swagger
 * /api/cms/article-tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Insight - Tags]
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
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/article-tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Insight - Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTag'
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/article-tags/{id}:
 *   put:
 *     summary: Update a tag by ID
 *     tags: [Insight - Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTag'
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/article-tags/{id}:
 *   delete:
 *     summary: Delete a tag by ID
 *     tags: [Insight - Tags]
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
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
//# sourceMappingURL=tags.js.map