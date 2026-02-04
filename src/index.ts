import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import auth from "./routes/cms/auth/auth";
import media from "./routes/cms/media/media";
import user from "./routes/cms/users/users";
import banner from "./routes/cms/banner/banners";
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

config();
connectDB();

const app = express();

const PORT = process.env.PORT || 3001;

const cmsOrigins = [
  process.env.CMS_FRONTEND_URL || "http://localhost:3005",
  process.env.CMS_FRONTEND_PROD_URL,
  `http://localhost:${PORT}`,
].filter(Boolean);

const publicOrigins = [
  process.env.PUBLIC_FRONTEND_URL || "http://localhost:3002",
  process.env.PUBLIC_FRONTEND_PROD_URL,
].filter(Boolean);

const cmsCors = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (cmsOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
});

const publicCors = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (publicOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false,
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 86400,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/cms", cmsCors, articleCategories);
app.use("/api/cms", cmsCors, articleTags);
app.use("/api/cms", cmsCors, article);
app.use("/api/cms", cmsCors, event);
app.use("/api/cms", cmsCors, caseStudiesCategories);
app.use("/api/cms", cmsCors, caseStudiesTechnologies);
app.use("/api/cms", cmsCors, caseStudies);

// Public
app.use("/api/public", publicCors, bannerPublic);
app.use("/api/public", publicCors, articleCategoriesPublic);
app.use("/api/public", publicCors, articleTagsPublic);
app.use("/api/public", publicCors, articlePublic);
app.use("/api/public", publicCors, eventPublic);
app.use("/api/public", publicCors, caseStudiesPublic);
app.use("/api/public", publicCors, caseStudiesCategoriesPublic);
app.use("/api/public", publicCors, caseStudiesTechnologiesPublic);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs/cms`);
  console.log(`CMS allowed origins: ${cmsOrigins.join(", ")}`);
  console.log(`Public allowed origins: ${publicOrigins.join(", ")}`);
});

process.on("unhandledRejection", (error) => {
  console.error(error);
  disconnectDB();
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error(error);
  disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", () => {
  disconnectDB();
  process.exit(0);
});
