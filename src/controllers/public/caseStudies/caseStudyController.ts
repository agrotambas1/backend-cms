import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildPublicCaseStudyPaginationMeta,
  buildPublicCaseStudyPaginationParams,
  buildPublicCaseStudySortParams,
  buildPublicCaseStudyWhereCondition,
} from "../../../utils/queryBuilder/public/caseStudies/caseStudies";
import {
  caseStudyPublicDetailSelect,
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
      limit as string,
    );

    const orderBy = buildPublicCaseStudySortParams(
      sortBy as string,
      order as string,
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

    res.set({
      "Cache-Control": "public, max-age=600, s-maxage=3600",
      "X-Total-Count": total.toString(),
    });

    return res.status(200).json({
      success: true,
      data: caseStudies.map(transformCaseStudyPublic),
      meta: buildPublicCaseStudyPaginationMeta(
        total,
        Number(page),
        Number(limit),
      ),
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch case studies"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
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
      select: caseStudyPublicDetailSelect,
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: "Case study not found",
      });
    }

    res.set({
      "Cache-Control": "public, max-age=1800, s-maxage=7200",
      "Last-Modified": caseStudy.publishedAt?.toUTCString() || "",
    });

    return res.status(200).json({
      success: true,
      data: transformCaseStudyPublic(caseStudy),
    });
  } catch (error) {
    console.error("Error fetching case study:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch case study"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
