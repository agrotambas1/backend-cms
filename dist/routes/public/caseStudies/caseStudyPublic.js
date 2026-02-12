"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const caseStudyController_1 = require("../../../controllers/public/caseStudies/caseStudyController");
const router = express_1.default.Router();
router.get("/case-studies", caseStudyController_1.getPublicCaseStudies);
router.get("/case-studies/:slug", caseStudyController_1.getPublicCaseStudyBySlug);
exports.default = router;
//# sourceMappingURL=caseStudyPublic.js.map