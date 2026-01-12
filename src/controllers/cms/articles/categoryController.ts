import { Request, Response } from "express";
import { prisma } from "../../../config/db";

export const getCategories = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = generateSlug(name);

    const existing = await prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Category with the same name already exists",
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        isActive: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    res.status(500).json({
      message: "Failed to create category",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, description, isActive } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = generateSlug(name);

    const existing = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Category with the same name already exists",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    res.status(200).json({
      status: "success",
      data: { category },
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    res.status(500).json({
      message: "Failed to update category",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
