"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = process.env.PORT || 3001;
(0, db_1.connectDB)();
const server = app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
process.on("unhandledRejection", (error) => {
    console.error(error);
    (0, db_1.disconnectDB)();
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    console.error(error);
    (0, db_1.disconnectDB)();
    process.exit(1);
});
process.on("SIGTERM", () => {
    (0, db_1.disconnectDB)();
    process.exit(0);
});
//# sourceMappingURL=server.js.map