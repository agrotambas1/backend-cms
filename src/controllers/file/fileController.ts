import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const getFile = async (req: Request, res: Response) => {
  try {
    const { module, year, month, filename } = req.params;

    if (!module || !year || !month || !filename) {
      return res.status(400).json({
        message: "Module, year, month, and filename are required",
      });
    }

    const allowedModules = ["articles", "events", "portfolios", "media"];
    if (!allowedModules.includes(module)) {
      return res.status(400).json({ message: "Invalid module" });
    }

    const relativePath = path.join("uploads", module, year, month, filename);

    const filepath = path.resolve(relativePath);

    console.log("Relative:", relativePath);
    console.log("Absolute:", filepath);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        message: "File not found",
        debug: {
          cwd: process.cwd(),
          relativePath,
          absolutePath: filepath,
        },
      });
    }

    res.sendFile(filepath);
  } catch (error) {
    console.error("Error serving file:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to serve file"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};
