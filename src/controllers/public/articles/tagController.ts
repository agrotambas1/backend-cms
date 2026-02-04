import { Request, Response } from "express";
import { prisma } from "../../../config/db";

export const getPublicTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.articleTag.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    });
    return res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching Tags:", error);
  }
};

export const getPublicTagBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const tag = await prisma.articleTag.findFirst({
      where: {
        slug: slug,
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error fetching tag:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tag",
    });
  }
};
