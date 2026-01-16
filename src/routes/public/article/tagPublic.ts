import express from "express";
import {
  getPublicTagBySlug,
  getPublicTags,
} from "../../../controllers/public/article/tagController";

const router = express.Router();

router.get("/article-tags", getPublicTags);

router.get("/article-tags/:slug", getPublicTagBySlug);

export default router;
