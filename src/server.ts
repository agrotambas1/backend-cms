import app from "./app";
import { connectDB, disconnectDB } from "./config/db";

const PORT = process.env.PORT || 3001;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
