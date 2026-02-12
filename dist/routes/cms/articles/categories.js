"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../../../controllers/cms/articles/categoryController");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const permission_1 = require("../../../middleware/permission");
const router = express_1.default.Router();
router.use(authMiddleware_1.authMiddleware);
router.get("/article-categories", categoryController_1.getCategories);
router.post("/article-categories", permission_1.adminOnly, categoryController_1.createCategory);
router.put("/article-categories/:id", permission_1.adminOnly, categoryController_1.updateCategory);
router.delete("/article-categories/:id", permission_1.adminOnly, categoryController_1.deleteCategory);
exports.default = router;
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
//# sourceMappingURL=categories.js.map