import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
      user?: User;
    }
  }
}

export {};
