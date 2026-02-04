import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { adminOnly, editorsOnly } from "../../../middleware/permission";
import {
  bulkDeleteEvent,
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../../../controllers/cms/events/eventController";

const router = express.Router();
router.use(authMiddleware);

router.get("/events", getEvents);

router.get("/events/:id", getEventById);

router.post("/events", editorsOnly, createEvent);

router.put("/events/:id", editorsOnly, updateEvent);

router.delete("/events/:id", adminOnly, deleteEvent);

router.delete("/events", adminOnly, bulkDeleteEvent);

export default router;

/**
 * @swagger
 * /api/cms/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
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
 *         description: Event details
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
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /api/cms/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: Event created successfully
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
 *                   example: Event created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/events/{id}:
 *   put:
 *     summary: Update event by ID
 *     tags: [Events]
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
 *             $ref: '#/components/schemas/UpdateEvent'
 *     responses:
 *       200:
 *         description: Event updated successfully
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
 *                   example: Event updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/events/{id}:
 *   delete:
 *     summary: Delete event by ID
 *     tags: [Events]
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
 *         description: Event deleted successfully
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
 *                   example: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cms/events:
 *   delete:
 *     summary: Bulk delete events (soft delete)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["uuid-1", "uuid-2", "uuid-3"]
 *     responses:
 *       200:
 *         description: Events deleted successfully
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
 *                   example: 3 event(s) deleted successfully
 *                 deletedCount:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Event IDs are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No events found or already deleted
 *       500:
 *         description: Server error
 */
