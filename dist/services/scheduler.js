"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentSchedulerService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../config/db");
class ContentSchedulerService {
    static startScheduler() {
        node_cron_1.default.schedule("*/5 * * * *", async () => {
            console.log("Checking for scheduled content to publish...");
            try {
                const now = new Date();
                const articlesResult = await db_1.prisma.article.updateMany({
                    where: {
                        status: "scheduled",
                        scheduledAt: {
                            lte: now,
                        },
                    },
                    data: {
                        status: "published",
                        publishedAt: now,
                    },
                });
                const totalPublished = articlesResult.count;
                if (totalPublished > 0) {
                    console.log(`✅ Published ${articlesResult.count} article(s)`);
                }
            }
            catch (error) {
                console.error("❌ Error auto-publishing content:", error);
            }
        });
        // console.log("📅 Content scheduler started - checking every 5 minutes");
    }
}
exports.ContentSchedulerService = ContentSchedulerService;
//# sourceMappingURL=scheduler.js.map