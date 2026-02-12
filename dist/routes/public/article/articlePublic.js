"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articleController_1 = require("../../../controllers/public/articles/articleController");
const router = express_1.default.Router();
router.get("/articles", articleController_1.getPublicArticles);
router.get("/articles/:slug", articleController_1.getPublicArticleBySlug);
exports.default = router;
//# sourceMappingURL=articlePublic.js.map