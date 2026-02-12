"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagController_1 = require("../../../controllers/public/articles/tagController");
const router = express_1.default.Router();
router.get("/article-tags", tagController_1.getPublicTags);
router.get("/article-tags/:slug", tagController_1.getPublicTagBySlug);
exports.default = router;
//# sourceMappingURL=tagPublic.js.map