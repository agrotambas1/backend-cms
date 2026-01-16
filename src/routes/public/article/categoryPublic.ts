import express from "express";
import {
  getPublicCategories,
  getPublicCategoryBySlug,
} from "../../../controllers/public/article/categoryController";

const router = express.Router();

router.get("/article-categories", getPublicCategories);

router.get("/article-categories/:slug", getPublicCategoryBySlug);

export default router;
