"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMedia = exports.uploadPortfolio = exports.uploadEvent = exports.uploadInsight = exports.createUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
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
const getUploadPath = (module) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const uploadPath = path_1.default.join("uploads", module, String(year), month);
    if (!fs_1.default.existsSync(uploadPath)) {
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
    }
    return uploadPath;
};
const createStorage = (module) => {
    return multer_1.default.diskStorage({
        destination: (_req, _file, cb) => {
            const uploadPath = getUploadPath(module);
            cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
            const ext = path_1.default.extname(file.originalname);
            const filename = `${(0, uuid_1.v4)()}${ext}`;
            cb(null, filename);
        },
    });
};
const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};
const createUploadMiddleware = (module) => {
    return (0, multer_1.default)({
        storage: createStorage(module),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter,
    });
};
exports.createUploadMiddleware = createUploadMiddleware;
exports.uploadInsight = (0, exports.createUploadMiddleware)("insights");
exports.uploadEvent = (0, exports.createUploadMiddleware)("events");
exports.uploadPortfolio = (0, exports.createUploadMiddleware)("portfolios");
exports.uploadMedia = (0, exports.createUploadMiddleware)("media");
//# sourceMappingURL=upload.js.map