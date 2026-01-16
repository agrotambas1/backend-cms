import { Request, Response } from "express";
import { prisma } from "../../../config/db";

export const getPublicCaseStudyCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.caseStudyCategory.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        order: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching case study categories:", error);
    return res.status(500).json({
      message: "Failed to fetch case study categories",
    });
  }
};

export const getPublicCaseStudyCategoryBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const category = await prisma.caseStudyCategory.findFirst({
      where: {
        slug: slug,
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        order: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching case study category by slug:", error);
    return res.status(500).json({
      message: "Failed to fetch case study category by slug",
    });
  }
};
