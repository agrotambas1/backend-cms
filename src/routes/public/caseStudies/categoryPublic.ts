import express from "express";
import {
  getPublicCaseStudyCategories,
  getPublicCaseStudyCategoryBySlug,
} from "../../../controllers/public/caseStudies/categoryController";

const router = express.Router();

router.get("/case-studies-categories", getPublicCaseStudyCategories);

router.get("/case-studies-categories/:slug", getPublicCaseStudyCategoryBySlug);

export default router;
