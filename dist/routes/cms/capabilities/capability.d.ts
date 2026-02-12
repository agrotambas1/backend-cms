declare const router: import("express-serve-static-core").Router;
export default router;
/**
 * @swagger
 * tags:
 *   name: Capabilities
 *   description: Capability management endpoints
 */
/**
 * @swagger
 * /api/cms/capabilities:
 *   get:
 *     summary: Get all capabilities with pagination and filters
 *     tags: [Capabilities]
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
 *                 $ref: '#/components/schemas/Capabilities'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/capabilities/{id}:
 *   get:
 *     summary: Get a solution by ID
 *     tags: [Capabilities]
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
 *                 $ref: '#/components/schemas/Capability'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/capabilities:
 *   post:
 *     summary: Create a new solution
 *     tags: [Capabilities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCapability'
 *     responses:
 *       201:
 *         description: Capability created successfully
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
 *                       $ref: '#/components/schemas/Capability'
 *                 message:
 *                   type: string
 *                   example: Capability created successfully
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
 *                   example: ["Capability name is required"]
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Capability with same slug already exists
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/capabilities/{id}:
 *   put:
 *     summary: Update a solution by ID
 *     tags: [Capabilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Capability ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCapability'
 *     responses:
 *       200:
 *         description: Capability updated successfully
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
 *                       $ref: '#/components/schemas/Capability'
 *                 message:
 *                   type: string
 *                   example: Capability updated successfully
 *       400:
 *         description: Validation failed or invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Capability not found
 *       409:
 *         description: Capability with same slug already exists
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/cms/capabilities/{id}:
 *   delete:
 *     summary: Delete a solution by ID (soft delete)
 *     tags: [Capabilities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Capability ID
 *     responses:
 *       200:
 *         description: Capability deleted successfully
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
 *                   example: Capability deleted successfully
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Capability not found
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
//# sourceMappingURL=capability.d.ts.map