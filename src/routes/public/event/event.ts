import express from "express";
import {
  getPublicEventBySlug,
  getPublicEvents,
} from "../../../controllers/public/event/eventController";

const router = express.Router();

router.get("/event", getPublicEvents);

router.get("/event/:slug", getPublicEventBySlug);

export default router;
