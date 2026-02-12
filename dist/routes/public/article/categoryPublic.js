"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../../../controllers/public/articles/categoryController");
const router = express_1.default.Router();
router.get("/article-categories", categoryController_1.getPublicCategories);
router.get("/article-categories/:slug", categoryController_1.getPublicCategoryBySlug);
exports.default = router;
//# sourceMappingURL=categoryPublic.js.map