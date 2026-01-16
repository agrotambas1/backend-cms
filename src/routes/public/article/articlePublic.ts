import express from "express";
import {
  getPublicArticleBySlug,
  getPublicArticles,
} from "../../../controllers/public/article/articleController";

const router = express.Router();

router.get("/article", getPublicArticles);

router.get("/article/:slug", getPublicArticleBySlug);

export default router;
