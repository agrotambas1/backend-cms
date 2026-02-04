import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildCMSSolutionPaginationParams,
  buildCMSSolutionSortParams,
  buildCMSSolutionWhereCondition,
} from "../../../utils/queryBuilder/cms/solutions/solution";
import { validateSolutionData } from "../../../validators/solutions/solutionValidator";

export const getSolutions = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      page = "1",
      limit = "10",
      search,
      isActive,
      sortBy,
      order,
    } = req.query;

    const where = buildCMSSolutionWhereCondition({
      search: search as string,
      isActive: isActive as string,
    });

    const pagination = buildCMSSolutionPaginationParams(
      page as string,
      limit as string,
    );

    const orderBy = buildCMSSolutionSortParams(
      sortBy as string,
      order as string,
    );

    const [solutions, total] = await Promise.all([
      prisma.solution.findMany({
        where,
        orderBy,
        ...pagination,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          icon: true,
          color: true,
          order: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              caseStudies: true,
              events: true,
              // articles: true,
            },
          },
        },
      }),
      prisma.solution.count({ where }),
    ]);

    return res.status(200).json({
      data: solutions,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching solutions:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch solutions"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

export const getSolutionById = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Solution ID is required" });
    }

    const solution = await prisma.solution.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            caseStudies: true,
            events: true,
            // articles: true,
          },
        },
      },
    });

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    return res.status(200).json({
      data: solution,
    });
  } catch (error) {
    console.error("Error fetching solution:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch solution"
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

export const createSolution = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate for CREATE (isUpdate = false)
    const errors = validateSolutionData(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const { name, slug, description, icon, color, order, isActive } = req.body;

    const finalSlug = slug?.trim() ? slug : generateSlug(name);

    const existing = await prisma.solution.findFirst({
      where: {
        slug: finalSlug,
        deletedAt: null,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Solution with the same slug already exists",
      });
    }

    const solution = await prisma.solution.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        icon: icon || null,
        color: color || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json({
      status: "success",
      data: { solution },
      message: "Solution created successfully",
    });
  } catch (error) {
    console.error("Error creating solution:", error);
    res.status(500).json({
      message: "Failed to create solution",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateSolution = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Solution ID is required" });
    }

    const errors = validateSolutionData(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const existingSolution = await prisma.solution.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingSolution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    const { name, slug, description, icon, color, order, isActive } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (slug !== undefined || name !== undefined) {
      const finalSlug = slug?.trim()
        ? slug
        : name
          ? generateSlug(name)
          : existingSolution.slug;

      const slugConflict = await prisma.solution.findFirst({
        where: {
          slug: finalSlug,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (slugConflict) {
        return res.status(409).json({
          message: "Solution with the same slug already exists",
        });
      }

      updateData.slug = finalSlug;
    }

    const solution = await prisma.solution.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      status: "success",
      data: { solution },
      message: "Solution updated successfully",
    });
  } catch (error) {
    console.error("Error updating solution:", error);
    res.status(500).json({
      message: "Failed to update solution",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteSolution = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Solution ID is required" });
    }

    const solution = await prisma.solution.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            caseStudies: true,
            events: true,
            // articles: true,
          },
        },
      },
    });

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    const totalUsage = solution._count.caseStudies + solution._count.events;

    if (totalUsage > 0) {
      return res.status(409).json({
        message: `Cannot delete solution. It is being used in ${totalUsage} content item(s)`,
        usage: {
          caseStudies: solution._count.caseStudies,
          events: solution._count.events,
          // articles: solution._count.articles,
        },
      });
    }

    await prisma.solution.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Solution deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting solution:", error);
    res.status(500).json({ message: "Failed to delete solution" });
  }
};
