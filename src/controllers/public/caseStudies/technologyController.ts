import { Request, Response } from "express";
import { prisma } from "../../../config/db";

export const getPublicCaseStudyTechnologies = async (
  req: Request,
  res: Response
) => {
  try {
    const technologies = await prisma.caseStudyTechnology.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        color: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json(technologies);
  } catch (error) {
    console.error("Error fetching case study technologies:", error);
    return res.status(500).json({
      message: "Failed to fetch case study technologies",
    });
  }
};

export const getPublicCaseStudyTechnologyBySlug = async (
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

    const technology = await prisma.caseStudyTechnology.findFirst({
      where: {
        slug: slug,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        color: true,
      },
    });

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found",
      });
    }

    return res.status(200).json(technology);
  } catch (error) {
    console.error("Error fetching case study technology by slug:", error);
    return res.status(500).json({
      message: "Failed to fetch case study technology by slug",
    });
  }
};
