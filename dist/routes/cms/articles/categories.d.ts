declare const router: import("express-serve-static-core").Router;
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
//# sourceMappingURL=categories.d.ts.map