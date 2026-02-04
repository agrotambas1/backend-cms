import express from "express";
import { getFile } from "../../controllers/file/fileController";

const router = express.Router();

router.get("/:module/:year/:month/:filename", getFile);

export default router;

/**
 * @swagger
 * /uploads/{module}/{year}/{month}/{filename}:
 *   get:
 *     summary: Get uploaded file
 *     description: Retrieve an uploaded file (image, video, pdf, etc.)
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: module
 *         required: true
 *         schema:
 *           type: string
 *           enum: [articles, events, portfolios, media]
 *         description: Module name
 *         example: media
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *         description: Year (YYYY)
 *         example: "2026"
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Month (MM)
 *         example: "01"
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Filename with extension
 *         example: c53e0bbe-2435-4a63-952b-2595dfbd1abe.png
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *           video/webm:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid module or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid module
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to serve file
 */
