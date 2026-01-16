import { Request, Response } from "express";
import { prisma } from "../../../config/db";

export const getPublicCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.articleCategory.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
      orderBy: { name: "asc" },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const getPublicCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const category = await prisma.articleCategory.findFirst({
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
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};
