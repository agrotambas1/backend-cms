import e, { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  caseStudyInclude,
  transformCaseStudy,
} from "../../../includes/cms/caseStudiesInclude";
import {
  parseCapabilities,
  parseCaseStudyImages,
  parseIndustries,
  parseSeoKeywords,
  parseSolutions,
  parseTechnologies,
} from "../../../utils/parseHelper";
import { validateCaseStudyData } from "../../../validators/caseStudyValidator";
import {
  buildCMSCaseStudyPaginationParams,
  buildCMSCaseStudySortParams,
  buildCMSCaseStudyWhereCondition,
} from "../../../utils/queryBuilder/cms/caseStudies/caseStudies";
import sanitizeHtml from "sanitize-html";

export const getCaseStudies = async (req: Request, res: Response) => {
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
      status,
      isFeatured,
      solutionSlug,
      industrySlug,
      capabilitySlug,
      year,
    } = req.query;

    const where = buildCMSCaseStudyWhereCondition({
      search: search as string,
      status: status as string,
      isFeatured: isFeatured as string,
      solutionSlug: solutionSlug as string,
      industrySlug: industrySlug as string,
      capabilitySlug: capabilitySlug as string,
      year: year as string,
    });

    const pagination = buildCMSCaseStudyPaginationParams(
      page as string,
      limit as string,
    );

    const orderByParams = buildCMSCaseStudySortParams(
      sortBy as string,
      order as string,
    );

    const [caseStudies, total] = await Promise.all([
      prisma.caseStudy.findMany({
        where,
        include: caseStudyInclude,
        orderBy: orderByParams,
        ...pagination,
      }),
      prisma.caseStudy.count({ where }),
    ]);

    return res.status(200).json({
      data: caseStudies.map(transformCaseStudy),
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch case studies"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

export const getCaseStudyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Case study ID is required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const caseStudy = await prisma.caseStudy.findUnique({
      where: { id },
      include: caseStudyInclude,
    });

    if (!caseStudy || caseStudy.deletedAt) {
      return res.status(404).json({ message: "Case study not found" });
    }

    return res.status(200).json({
      status: "success",
      data: transformCaseStudy(caseStudy),
    });
  } catch (error) {
    console.error("Error fetching case studies:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch case studies"
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

const resolveCreateCaseStudySlug = (slug?: string, title?: string) => {
  if (slug && slug.trim()) {
    return slug.trim().toLowerCase();
  }

  if (title) {
    return generateSlug(title).toLowerCase();
  }

  return null;
};

export const createCaseStudy = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      slug,
      summary,
      content,
      description,
      problem,
      solution,
      client,
      year,
      status,
      metaTitle,
      metaDescription,
      publishedAt,
      isFeatured,
      thumbnailId,
      solutions,
      industries,
      capabilities,
      seoKeywords,
    } = req.body;

    const cleanContent =
      typeof content === "string"
        ? sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "img",
              "span",
            ]),
            allowedAttributes: false,
            allowedSchemes: ["http", "https", "data"],
            disallowedTagsMode: "discard",
            nonBooleanAttributes: ["style"],
          })
        : "";

    let parsedSolutions,
      parsedIndustries,
      parsedCapabilities,
      parsedSeoKeywords;
    try {
      parsedSolutions = parseSolutions(solutions);
      parsedIndustries = parseIndustries(industries);
      parsedCapabilities = parseCapabilities(capabilities);
      parsedSeoKeywords = parseSeoKeywords(seoKeywords);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    const validationErrors = validateCaseStudyData({
      title,
      slug,
      summary,
      content,
      description,
      problem,
      solution,
      client,
      status,
      solutions: parsedSolutions,
      industries: parsedIndustries,
      capabilities: parsedCapabilities,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    if (parsedSolutions.length > 0) {
      const solutionsExist = await prisma.solution.findMany({
        where: {
          id: { in: parsedSolutions },
          deletedAt: null,
          isActive: true,
        },
      });

      if (solutionsExist.length !== parsedSolutions.length) {
        return res.status(400).json({
          message: "One or more solutions not found or inactive",
        });
      }
    }

    if (parsedIndustries.length > 0) {
      const industriesExist = await prisma.industry.findMany({
        where: {
          id: { in: parsedIndustries },
          deletedAt: null,
          isActive: true,
        },
      });

      if (industriesExist.length !== parsedIndustries.length) {
        return res.status(400).json({
          message: "One or more industries not found or inactive",
        });
      }
    }

    if (parsedCapabilities.length > 0) {
      const capabilitiesExist = await prisma.capability.findMany({
        where: {
          id: { in: parsedCapabilities },
          deletedAt: null,
          isActive: true,
        },
      });

      if (capabilitiesExist.length !== parsedCapabilities.length) {
        return res.status(400).json({
          message: "One or more capabilities not found or inactive",
        });
      }
    }

    const finalSlug = resolveCreateCaseStudySlug(slug, title);

    if (!finalSlug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const existingCaseStudy = await prisma.caseStudy.findFirst({
      where: { slug: finalSlug, deletedAt: null },
    });

    if (existingCaseStudy) {
      return res.status(409).json({
        message: "Case study with the same slug already exists",
      });
    }

    let selectedThumbnailId: string | null = null;
    if (thumbnailId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: thumbnailId },
      });
      if (!mediaExists) {
        return res.status(400).json({
          message: `Media with ID ${thumbnailId} not found`,
        });
      }
      selectedThumbnailId = thumbnailId;
    }

    const caseStudyData: any = {
      title,
      slug: finalSlug,
      summary,
      content: cleanContent,
      description,
      problem,
      solution,
      client,
      year,
      status,
      metaTitle,
      metaDescription,
      publishedAt,
      isFeatured,
      thumbnailId: selectedThumbnailId,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    if (parsedSolutions.length > 0) {
      caseStudyData.solutions = {
        create: parsedSolutions.map((solutionId: string) => ({
          solutionId: solutionId,
        })),
      };
    }

    if (parsedIndustries.length > 0) {
      caseStudyData.industries = {
        create: parsedIndustries.map((industryId: string) => ({
          industryId: industryId,
        })),
      };
    }

    if (parsedCapabilities.length > 0) {
      caseStudyData.capabilities = {
        create: parsedCapabilities.map((capabilityId: string) => ({
          capabilityId: capabilityId,
        })),
      };
    }

    if (parsedSeoKeywords.length > 0) {
      caseStudyData.seoKeywords = {
        create: parsedSeoKeywords.map((item) => ({
          keyword: item.keyword,
          order: item.order || 0,
        })),
      };
    }

    const caseStudy = await prisma.caseStudy.create({
      data: caseStudyData,
      include: caseStudyInclude,
    });

    return res.status(201).json({
      status: "success",
      message: "Case study created successfully",
      data: {
        caseStudy: transformCaseStudy(caseStudy),
      },
    });
  } catch (error) {
    console.error("Error creating case study:", error);
    return res.status(500).json({
      message: "Failed to create case study",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateCaseStudy = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Case study ID is required" });
    }

    const {
      title,
      slug,
      summary,
      content,
      description,
      problem,
      solution,
      client,
      year,
      status,
      metaTitle,
      metaDescription,
      publishedAt,
      isFeatured,
      thumbnailId,
      solutions,
      industries,
      capabilities,
      seoKeywords,
    } = req.body;

    const existingCaseStudy = await prisma.caseStudy.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingCaseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }

    const cleanContent =
      typeof content === "string"
        ? sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "img",
              "span",
            ]),
            allowedAttributes: false,
            allowedSchemes: ["http", "https", "data"],
            disallowedTagsMode: "discard",
            nonBooleanAttributes: ["style"],
          })
        : existingCaseStudy.content;

    let parsedSolutions,
      parsedIndustries,
      parsedCapabilities,
      parsedSeoKeywords;
    try {
      parsedSolutions = parseSolutions(solutions);
      parsedIndustries = parseIndustries(industries);
      parsedCapabilities = parseCapabilities(capabilities);
      parsedSeoKeywords = parseSeoKeywords(seoKeywords);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    const validationErrors = validateCaseStudyData(
      {
        title,
        slug,
        summary,
        content,
        description,
        problem,
        solution,
        client,
        status,
        metaTitle,
        metaDescription,
        solutions: parsedSolutions,
        industries: parsedIndustries,
        capabilities: parsedCapabilities,
      },
      true,
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    if (parsedSolutions.length > 0) {
      const solutionsExist = await prisma.solution.findMany({
        where: {
          id: { in: parsedSolutions },
          deletedAt: null,
          isActive: true,
        },
      });

      if (solutionsExist.length !== parsedSolutions.length) {
        return res.status(400).json({
          message: "One or more solutions not found or inactive",
        });
      }
    }

    if (parsedIndustries.length > 0) {
      const industriesExist = await prisma.industry.findMany({
        where: {
          id: { in: parsedIndustries },
          deletedAt: null,
          isActive: true,
        },
      });

      if (industriesExist.length !== parsedIndustries.length) {
        return res.status(400).json({
          message: "One or more industries not found or inactive",
        });
      }
    }

    if (parsedCapabilities.length > 0) {
      const capabilitiesExist = await prisma.capability.findMany({
        where: {
          id: { in: parsedCapabilities },
          deletedAt: null,
          isActive: true,
        },
      });

      if (capabilitiesExist.length !== parsedCapabilities.length) {
        return res.status(400).json({
          message: "One or more capabilities not found or inactive",
        });
      }
    }

    const finalSlug = slug?.trim()
      ? slug.trim().toLowerCase()
      : existingCaseStudy.slug;

    if (slug) {
      const slugExists = await prisma.caseStudy.findFirst({
        where: {
          slug: finalSlug,
          NOT: { id },
          deletedAt: null,
        },
      });

      if (slugExists) {
        return res.status(409).json({
          message: "Case study with the same slug already exists",
        });
      }
    }

    let selectedThumbnailId: string | null = existingCaseStudy.thumbnailId;
    if (thumbnailId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: thumbnailId },
      });
      if (!mediaExists) {
        return res.status(400).json({
          message: "Selected media does not exist",
        });
      }
      selectedThumbnailId = thumbnailId;
    }

    const caseStudyData: any = {
      title,
      slug: finalSlug,
      summary,
      content: cleanContent,
      description,
      problem,
      solution,
      client,
      year,
      status,
      metaTitle,
      metaDescription,
      publishedAt,
      isFeatured,
      thumbnailId: selectedThumbnailId,
      updatedBy: req.user.id,
    };

    if (parsedSolutions.length > 0) {
      caseStudyData.solutions = {
        deleteMany: {},
        create: parsedSolutions.map((solutionId: string) => ({
          solutionId: solutionId,
        })),
      };
    }

    if (parsedIndustries.length > 0) {
      caseStudyData.industries = {
        deleteMany: {},
        create: parsedIndustries.map((industryId: string) => ({
          industryId: industryId,
        })),
      };
    }

    if (parsedCapabilities.length > 0) {
      caseStudyData.capabilities = {
        deleteMany: {},
        create: parsedCapabilities.map((capabilityId: string) => ({
          capabilityId: capabilityId,
        })),
      };
    }

    if (parsedSeoKeywords.length > 0) {
      caseStudyData.seoKeywords = {
        deleteMany: {},
        create: parsedSeoKeywords.map((item) => ({
          keyword: item.keyword,
          order: item.order || 0,
        })),
      };
    }

    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: caseStudyData,
      include: caseStudyInclude,
    });

    return res.status(200).json({
      status: "success",
      message: "Case study updated successfully",
      data: {
        caseStudy: transformCaseStudy(caseStudy),
      },
    });
  } catch (error) {
    console.error("Error updating case study:", error);
    return res.status(500).json({
      message: "Failed to update case study",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteCaseStudy = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Case study ID is required" });
    }

    const existingCaseStudy = await prisma.caseStudy.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingCaseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }

    await prisma.caseStudy.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: req.user.id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Case study deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting case study:", error);
    return res.status(500).json({
      message: "Failed to delete case study",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const bulkDeleteCaseStudy = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { ids } = req.body as { ids?: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Case study IDs are required",
      });
    }

    const caseStudies = await prisma.caseStudy.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      select: { id: true },
    });

    if (caseStudies.length === 0) {
      return res.status(404).json({
        message: "No case studies found or already deleted",
      });
    }

    await prisma.caseStudy.updateMany({
      where: {
        id: { in: caseStudies.map((c) => c.id) },
      },
      data: {
        deletedAt: new Date(),
        updatedBy: req.user.id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: `${caseStudies.length} case study(ies) deleted successfully`,
      deletedCount: caseStudies.length,
    });
  } catch (error) {
    console.error("Error bulk deleting case study:", error);
    return res.status(500).json({
      message: "Failed to bulk delete case studies",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
