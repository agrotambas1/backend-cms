import express from "express";
import {
  getPublicCaseStudies,
  getPublicCaseStudyBySlug,
} from "../../../controllers/public/caseStudies/caseStudiesController";

const router = express.Router();

router.get("/case-studies", getPublicCaseStudies);

router.get("/case-studies/:slug", getPublicCaseStudyBySlug);

export default router;
