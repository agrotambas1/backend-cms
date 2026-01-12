import express from "express";
import cors from "cors";
import Api from "./routes/api";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import mediaRoutesPublic from "./routes/public/mediaPublic";
import authRoutes from "./routes/cms/auth/auth";
import mediaRoutes from "./routes/cms/media/media";
import userRoutes from "./routes/cms/users/users";
import bannerRoutes from "./routes/cms/banner/banners";
import categoryArticleRoutes from "./routes/cms/articles/categories";
import tagArticleRoutes from "./routes/cms/articles/tags";
import Article from "./routes/cms/articles/articles";
import Event from "./routes/cms/events/events";

config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api-docs/cms",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "API Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// CMS
app.use("/api/cms", Api);
app.use("/api/cms", authRoutes);
app.use("/api/cms", userRoutes);
app.use("/api/cms", mediaRoutes);
app.use("/api/cms", bannerRoutes);
app.use("/api/cms", categoryArticleRoutes);
app.use("/api/cms", tagArticleRoutes);
app.use("/api/cms", Article);
app.use("/api/cms", Event);

// Public
app.use("/api/public", mediaRoutesPublic);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs/cms`);
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
