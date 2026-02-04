import express from "express";
import {
  getPublicArticleBySlug,
  getPublicArticles,
} from "../../../controllers/public/articles/articleController";

const router = express.Router();

router.get("/articles", getPublicArticles);

router.get("/articles/:slug", getPublicArticleBySlug);

export default router;
