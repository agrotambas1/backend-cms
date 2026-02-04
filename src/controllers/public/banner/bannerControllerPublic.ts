import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import { bannerPublicSelect } from "../../../includes/public/bannerIncludePublic";

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        deletedAt: null,
        status: "published",
      },
      select: bannerPublicSelect,
      orderBy: {
        order: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("Error fetching banner:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch banner"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Banner ID is required" });
    }

    const banner = await prisma.banner.findUnique({
      where: { id, deletedAt: null, status: "published" },
      select: bannerPublicSelect,
    });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      status: "success",
      data: { banner },
    });
  } catch (error) {
    console.error("Error fetching banner:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch banner"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
