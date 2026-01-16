import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildPublicCaseStudyPaginationMeta,
  buildPublicCaseStudyPaginationParams,
  buildPublicCaseStudySortParams,
  buildPublicCaseStudyWhereCondition,
} from "../../../utils/queryBuilder/public/caseStudies/caseStudies";
import {
  caseStudyPublicSelect,
  transformCaseStudyPublic,
} from "../../../includes/public/caseStudiesInclude";

export const getPublicCaseStudies = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy,
      order,
      categorySlug,
      technologySlug,
      search,
      isFeatured,
    } = req.query;

    const where = buildPublicCaseStudyWhereCondition({
      categorySlug: categorySlug as string,
      technologySlug: technologySlug as string,
      search: search as string,
      isFeatured: isFeatured as string,
    });

    const pagination = buildPublicCaseStudyPaginationParams(
      page as string,
      limit as string
    );

    const orderBy = buildPublicCaseStudySortParams(
      sortBy as string,
      order as string
    );

    const [caseStudies, total] = await Promise.all([
      prisma.caseStudy.findMany({
        where,
        select: caseStudyPublicSelect,
        orderBy,
        ...pagination,
      }),
      prisma.caseStudy.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: caseStudies.map(transformCaseStudyPublic),
      meta: buildPublicCaseStudyPaginationMeta(
        total,
        Number(page),
        Number(limit)
      ),
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch case studies",
    });
  }
};

export const getPublicCaseStudyBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const caseStudy = await prisma.caseStudy.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: "published",
        publishedAt: {
          lte: new Date(),
        },
      },
      select: caseStudyPublicSelect,
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case study not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: transformCaseStudyPublic(caseStudy),
    });
  } catch (error) {
    console.error("Error fetching case study:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch case study",
    });
  }
};
