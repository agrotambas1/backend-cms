import express from "express";
import {
  getPublicCaseStudyTechnologies,
  getPublicCaseStudyTechnologyBySlug,
} from "../../../controllers/public/caseStudies/technologyController";

const router = express.Router();

router.get("/case-studies-technologies", getPublicCaseStudyTechnologies);

router.get(
  "/case-studies-technologies/:slug",
  getPublicCaseStudyTechnologyBySlug
);

export default router;
