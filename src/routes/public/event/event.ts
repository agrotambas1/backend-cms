import express from "express";
import {
  getPublicEventBySlug,
  getPublicEvents,
} from "../../../controllers/public/event/eventController";

const router = express.Router();

router.get("/events", getPublicEvents);

router.get("/events/:slug", getPublicEventBySlug);

export default router;
