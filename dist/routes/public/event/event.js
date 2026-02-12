"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../../../controllers/public/event/eventController");
const router = express_1.default.Router();
router.get("/events", eventController_1.getPublicEvents);
router.get("/events/:slug", eventController_1.getPublicEventBySlug);
exports.default = router;
//# sourceMappingURL=event.js.map