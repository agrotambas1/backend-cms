declare const router: import("express-serve-static-core").Router;
export default router;
/**
 * @swagger
 * /api/public/media:
 *   get:
 *     summary: Get all public media items
 *     tags: [Media - Public]
 *     responses:
 *       200:
 *         description: A list of media items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /api/public/media/{id}:
 *   get:
 *     summary: Get public media by ID
 *     tags: [Media - Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details
 *       404:
 *         description: Media not found
 */
//# sourceMappingURL=mediaPublic.d.ts.map