"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bannerControllerPublic_1 = require("../../../controllers/public/banner/bannerControllerPublic");
const router = express_1.default.Router();
router.get("/banner", bannerControllerPublic_1.getBanners);
router.get("/banner/:id", bannerControllerPublic_1.getBannerById);
exports.default = router;
//# sourceMappingURL=bannerPublic.js.map