import express from "express";
import Api from "./routes/api";
import authRoutes from "./routes/cms/authRoutes";
import mediaRoutes from "./routes/cms/mediaRoutes";
import userRoutes from "./routes/cms/userRoutes";
import bannerRoutes from "./routes/cms/bannerRoutes";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import mediaRoutesPublic from "./routes/public/mediaRoutesPublic";

config();
connectDB();

const app = express();

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

app.use("/api/cms", Api);
app.use("/api/cms", authRoutes);
app.use("/api/cms", userRoutes);
app.use("/api/cms", mediaRoutes);
app.use("/api/cms", bannerRoutes);

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
