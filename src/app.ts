import express from "express";
import cors from "cors";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

// routes
import auth from "./routes/cms/auth/auth";
import media from "./routes/cms/media/media";
import user from "./routes/cms/users/users";
import banner from "./routes/cms/banner/banners";
import services from "./routes/cms/service/service";
import capabilities from "./routes/cms/capabilities/capability";
import industries from "./routes/cms/industries/industry";
import articleCategories from "./routes/cms/articles/categories";
import articleTags from "./routes/cms/articles/tags";
import article from "./routes/cms/articles/articles";
import event from "./routes/cms/events/events";
import caseStudiesCategories from "./routes/cms/caseStudies/categories";
import caseStudiesTechnologies from "./routes/cms/caseStudies/technologies";
import caseStudies from "./routes/cms/caseStudies/caseStudies";

import bannerPublic from "./routes/public/banner/bannerPublic";
import articleCategoriesPublic from "./routes/public/article/categoryPublic";
import articleTagsPublic from "./routes/public/article/tagPublic";
import articlePublic from "./routes/public/article/articlePublic";
import eventPublic from "./routes/public/event/event";
import caseStudiesPublic from "./routes/public/caseStudies/caseStudyPublic";
import caseStudiesCategoriesPublic from "./routes/public/caseStudies/categoryPublic";
import caseStudiesTechnologiesPublic from "./routes/public/caseStudies/technologyPublic";

import fileMedia from "./routes/file/file";

import { ContentSchedulerService } from "./services/scheduler";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  override: true,
});

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const cmsOrigins = [
  process.env.CMS_FRONTEND_URL || "http://localhost:3005",
  process.env.CMS_FRONTEND_PROD_URL,
  `http://localhost:${PORT}`,
  // `http://192.168.1.10:3000`,
  ,
].filter(Boolean);

const publicOrigins = [
  process.env.PUBLIC_FRONTEND_URL || "http://localhost:3002",
  process.env.PUBLIC_FRONTEND_PROD_URL,
].filter(Boolean);

const cmsCors = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (cmsOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

const publicCors = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (publicOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  "/api-docs/cms",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "API Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
  }),
);

// CMS
app.use("/api/cms", cmsCors, auth);
app.use("/api/cms", cmsCors, user);
app.use("/api/cms", cmsCors, media);
app.use("/api/cms", cmsCors, banner);
app.use("/api/cms", cmsCors, services);
// app.use("/api/cms", cmsCors, capabilities);
app.use("/api/cms", cmsCors, industries);
app.use("/api/cms", cmsCors, articleCategories);
app.use("/api/cms", cmsCors, articleTags);
app.use("/api/cms", cmsCors, article);
app.use("/api/cms", cmsCors, event);
// app.use("/api/cms", cmsCors, caseStudiesCategories);
// app.use("/api/cms", cmsCors, caseStudiesTechnologies);
app.use("/api/cms", cmsCors, caseStudies);

// Public
app.use("/api/public", publicCors, bannerPublic);
app.use("/api/public", publicCors, articleCategoriesPublic);
app.use("/api/public", publicCors, articleTagsPublic);
app.use("/api/public", publicCors, articlePublic);
app.use("/api/public", publicCors, eventPublic);
app.use("/api/public", publicCors, caseStudiesPublic);
// app.use("/api/public", publicCors, caseStudiesCategoriesPublic);
// app.use("/api/public", publicCors, caseStudiesTechnologiesPublic);

// File
app.use("/uploads", fileMedia);
ContentSchedulerService.startScheduler();

export default app;
