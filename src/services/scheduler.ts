import cron from "node-cron";
import { prisma } from "../config/db";

export class ContentSchedulerService {
  static startScheduler() {
    cron.schedule("*/5 * * * *", async () => {
      console.log("Checking for scheduled content to publish...");

      try {
        const now = new Date();

        const articlesResult = await prisma.article.updateMany({
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
      } catch (error) {
        console.error("❌ Error auto-publishing content:", error);
      }
    });

    // console.log("📅 Content scheduler started - checking every 5 minutes");
  }
}
