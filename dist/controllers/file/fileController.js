"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getFile = async (req, res) => {
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
        const relativePath = path_1.default.join("uploads", module, year, month, filename);
        const filepath = path_1.default.resolve(relativePath);
        console.log("Relative:", relativePath);
        console.log("Absolute:", filepath);
        if (!fs_1.default.existsSync(filepath)) {
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
    }
    catch (error) {
        console.error("Error serving file:", error);
        const message = process.env.NODE_ENV === "production"
            ? "Failed to serve file"
            : error.message;
        res.status(500).json({ message });
    }
};
exports.getFile = getFile;
//# sourceMappingURL=fileController.js.map