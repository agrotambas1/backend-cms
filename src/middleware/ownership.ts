import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

// Generic ownership check
const checkOwnership = (resourceName: string, findFunction: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ message: `${resourceName} ID is required` });
      }

      const resource = await findFunction(id);

      if (!resource || resource.deletedAt) {
        return res.status(404).json({ message: `${resourceName} not found` });
      }

      if (req.user!.role === "ADMIN") {
        (req as any)[resourceName.toLowerCase()] = resource;
        return next();
      }

      if (resource.createdBy !== req.user!.id) {
        return res.status(403).json({
          message: `Forbidden: You can only manage your own ${resourceName.toLowerCase()}`,
        });
      }

      (req as any)[resourceName.toLowerCase()] = resource;
      next();
    } catch (error) {
      console.error(`Error checking ${resourceName} ownership:`, error);
      res.status(500).json({ message: "Failed to verify ownership" });
    }
  };
};

// Specific ownership middlewares
export const checkMediaOwnership = checkOwnership(
  "Media",
  async (id: string) => {
    return await prisma.media.findUnique({ where: { id } });
  }
);

// export const checkArticleOwnership = checkOwnership("Article", async (id: string) => {
//   return await prisma.article.findUnique({ where: { id } });
// });

// export const checkEventOwnership = checkOwnership("Event", async (id: string) => {
//   return await prisma.event.findUnique({ where: { id } });
// });

// export const checkCaseStudyOwnership = checkOwnership("CaseStudy", async (id: string) => {
//   return await prisma.caseStudy.findUnique({ where: { id } });
// });

// export const checkBannerOwnership = checkOwnership("Banner", async (id: string) => {
//   return await prisma.banner.findUnique({ where: { id } });
// });
