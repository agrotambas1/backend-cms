import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildCMSCaseStudiesCategoryPaginationParams,
  buildCMSCaseStudiesCategorySortParams,
  buildCMSCaseStudiesCategoryWhereCondition,
} from "../../../utils/queryBuilder/cms/caseStudies/categories";

export const getCategories = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      page = "1",
      limit = "10",
      sortBy,
      order,
      search,
      isActive,
    } = req.query;

    const where = buildCMSCaseStudiesCategoryWhereCondition({
      search: search as string,
      isActive: isActive as string,
    });

    const pagination = buildCMSCaseStudiesCategoryPaginationParams(
      page as string,
      limit as string,
    );

    const orderByParams = buildCMSCaseStudiesCategorySortParams(
      sortBy as string,
      order as string,
    );

    const [categories, total] = await Promise.all([
      prisma.caseStudyCategory.findMany({
        where,
        orderBy: orderByParams,
        ...pagination,
      }),
      prisma.caseStudyCategory.count({ where }),
    ]);

    return res.status(200).json({
      data: categories,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching case study categories:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch case study categories"
        : (error as Error).message;

    res.status(500).json({ message });
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

    const { name, slug, description, icon, order } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // const slug = generateSlug(name);
    const finalSlug = slug?.trim() ? slug : generateSlug(name);

    const existing = await prisma.caseStudyCategory.findFirst({
      where: {
        slug: finalSlug,
        deletedAt: null,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Category with the same name already exists",
      });
    }

    const category = await prisma.caseStudyCategory.create({
      data: {
        name,
        slug: finalSlug,
        description,
        icon,
        order,
        isActive: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: { category },
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
    const { name, slug, description, icon, order, isActive } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // const slug = generateSlug(name);
    const finalSlug = slug?.trim() ? slug : generateSlug(name);

    const existing = await prisma.caseStudyCategory.findFirst({
      where: {
        slug: finalSlug,
        NOT: { id },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Category with the same name already exists",
      });
    }

    const category = await prisma.caseStudyCategory.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        description,
        icon,
        order,
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

    const category = await prisma.caseStudyCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await prisma.caseStudyCategory.update({
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
