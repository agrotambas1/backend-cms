import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import { Request } from "express";
import fs from "fs";

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
];

const getUploadPath = (module: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const uploadPath = path.join("uploads", module, String(year), month);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return uploadPath;
};

const createStorage = (module: string) => {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = getUploadPath(module);
      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${uuid()}${ext}`;
      cb(null, filename);
    },
  });
};

// File filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

export const createUploadMiddleware = (module: string) => {
  return multer({
    storage: createStorage(module),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter,
  });
};

export const uploadArticle = createUploadMiddleware("articles");
export const uploadEvent = createUploadMiddleware("events");
export const uploadPortfolio = createUploadMiddleware("portfolios");
export const uploadMedia = createUploadMiddleware("media");
