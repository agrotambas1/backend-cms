import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildCMSCaseStudiesTechnologyPaginationParams,
  buildCMSCaseStudiesTechnologySortParams,
  buildCMSCaseStudiesTechnologyWhereCondition,
} from "../../../utils/queryBuilder/cms/caseStudies/technologies";

// export const getTechnologies = async (req: Request, res: Response) => {

//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const technologies = await prisma.caseStudyTechnology.findMany({
//       where: { deletedAt: null },
//       orderBy: { createdAt: "desc" },
//     });

//     return res.status(200).json(technologies);
//   } catch (error) {
//     console.error("Error fetching technologies:", error);
//     res.status(500).json({ message: "Failed to fetch technologies" });
//   }
// };

export const getTechnologies = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { page = "1", limit = "10", sortBy, order, search } = req.query;

    const where = buildCMSCaseStudiesTechnologyWhereCondition({
      search: search as string,
    });

    const pagination = buildCMSCaseStudiesTechnologyPaginationParams(
      page as string,
      limit as string
    );

    const orderByParams = buildCMSCaseStudiesTechnologySortParams(
      sortBy as string,
      order as string
    );

    const [technologies, total] = await Promise.all([
      prisma.caseStudyTechnology.findMany({
        where,
        orderBy: orderByParams,
        ...pagination,
      }),
      prisma.caseStudyTechnology.count({ where }),
    ]);

    return res.status(200).json({
      data: technologies,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching technologies:", error);
    res.status(500).json({ message: "Failed to fetch technologies", error });
  }
};

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

export const createTechnology = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Technology name is required" });
    }

    const slug = generateSlug(name);

    const existing = await prisma.caseStudyTechnology.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Technology with the same name already exists",
      });
    }

    const technology = await prisma.caseStudyTechnology.create({
      data: {
        name,
        slug,
        icon,
        color,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Technology created successfully",
      data: { technology },
    });
  } catch (error) {
    console.error("Error creating technology:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    res.status(500).json({
      message: "Failed to create technology",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateTechnology = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, icon, color } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Technology ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Technology name is required" });
    }

    const slug = generateSlug(name);

    const existing = await prisma.caseStudyTechnology.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Technology with the same name already exists",
      });
    }

    const technology = await prisma.caseStudyTechnology.update({
      where: { id },
      data: {
        name,
        slug,
        icon,
        color,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Technology updated successfully",
      data: { technology },
    });
  } catch (error) {
    console.error("Error updating technology:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    res.status(500).json({
      message: "Failed to update technology",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteTechnology = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Technology ID is required" });
    }

    const technology = await prisma.caseStudyTechnology.findUnique({
      where: { id },
    });

    if (!technology) {
      return res.status(404).json({ message: "Technology not found" });
    }

    await prisma.caseStudyTechnology.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Technology deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting technology:", error);
    res.status(500).json({ message: "Failed to delete technology" });
  }
};
