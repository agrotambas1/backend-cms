import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  caseStudyInclude,
  transformCaseStudy,
} from "../../../includes/cms/caseStudiesInclude";
import {
  parseCaseStudyImages,
  parseTechnologies,
} from "../../../utils/parseHelper";
import { validateCaseStudyData } from "../../../validators/caseStudyValidator";
import {
  buildCMSCaseStudyPaginationParams,
  buildCMSCaseStudySortParams,
  buildCMSCaseStudyWhereCondition,
} from "../../../utils/queryBuilder/cms/caseStudies/caseStudies";

// export const getCaseStudies = async (req: Request, res: Response) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const caseStudies = await prisma.caseStudy.findMany({
//       where: {
//         deletedAt: null,
//       },
//       include: caseStudyInclude,
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const transformedCaseStudies = caseStudies.map(transformCaseStudy);

//     return res.status(200).json({
//       status: "success",
//       data: transformedCaseStudies,
//     });
//   } catch (error) {
//     console.error("Error fetching case studies:", error);
//     res.status(500).json({ message: "Failed to fetch case studies" });
//   }
// };

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
      categorySlug,
    } = req.query;

    const where = buildCMSCaseStudyWhereCondition({
      search: search as string,
      status: status as string,
      isFeatured: isFeatured as string,
      categorySlug: categorySlug as string,
    });

    const pagination = buildCMSCaseStudyPaginationParams(
      page as string,
      limit as string
    );

    const orderByParams = buildCMSCaseStudySortParams(
      sortBy as string,
      order as string
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
    res.status(500).json({ message: "Failed to fetch case studies", error });
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
    res.status(500).json({ message: "Failed to fetch case studies" });
  }
};

export const createCaseStudy = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      description,
      client,
      duration,
      year,
      status,
      publishedAt,
      isFeatured,
      thumbnailId,
      technologies,
      images,
      categoryId,
    } = req.body;

    let parsedTechnologies, parsedImages;
    try {
      parsedTechnologies = parseTechnologies(technologies);
      parsedImages = parseCaseStudyImages(images);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    for (const img of parsedImages) {
      const media = await prisma.media.findUnique({
        where: { id: img.imageId },
      });
      if (!media || media.deletedAt) {
        return res
          .status(404)
          .json({ message: `Media with ID ${img.imageId} not found` });
      }
    }

    const validationErrors = validateCaseStudyData({
      title,
      slug,
      content,
      description,
      client,
      status,
      technologies: parsedTechnologies,
      categoryId,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    if (categoryId) {
      const categoryExists = await prisma.caseStudyCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res.status(400).json({ message: "Category not found" });
      }
    }

    const existingCaseStudy = await prisma.caseStudy.findFirst({
      where: { slug, deletedAt: null },
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
      slug,
      excerpt,
      content,
      description,
      client,
      duration,
      year,
      status,
      publishedAt,
      isFeatured,
      thumbnailId: selectedThumbnailId,
      categoryId,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    if (parsedTechnologies.length > 0) {
      caseStudyData.technologies = {
        create: parsedTechnologies.map((techId: string) => ({
          technologyId: techId,
        })),
      };
    }

    if (parsedImages.length > 0) {
      caseStudyData.images = {
        create: parsedImages.map((img) => ({
          imageId: img.imageId,
          order: img.order || 0,
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
      excerpt,
      content,
      description,
      client,
      duration,
      year,
      status,
      publishedAt,
      isFeatured,
      thumbnailId,
      technologies,
      images,
      categoryId,
    } = req.body;

    const existingCaseStudy = await prisma.caseStudy.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingCaseStudy) {
      return res.status(404).json({ message: "Case study not found" });
    }

    let parsedTechnologies, parsedImages;
    try {
      parsedTechnologies = parseTechnologies(technologies);
      parsedImages = parseCaseStudyImages(images);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid format",
      });
    }

    const validationErrors = validateCaseStudyData({
      title,
      slug,
      content,
      description,
      client,
      status,
      technologies: parsedTechnologies,
      categoryId,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    if (categoryId) {
      const categoryExists = await prisma.caseStudyCategory.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (slug) {
      const slugExists = await prisma.caseStudy.findFirst({
        where: {
          slug,
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
      slug,
      excerpt,
      content,
      description,
      client,
      duration,
      year,
      status,
      publishedAt,
      isFeatured,
      thumbnailId: selectedThumbnailId,
      categoryId,
      updatedBy: req.user.id,
    };

    if (parsedTechnologies.length > 0) {
      caseStudyData.technologies = {
        deleteMany: {},
        create: parsedTechnologies.map((techId: string) => ({
          technologyId: techId,
        })),
      };
    }

    if (parsedImages.length > 0) {
      caseStudyData.images = {
        deleteMany: {},
        create: parsedImages.map((img) => ({
          imageId: img.imageId,
          order: img.order || 0,
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
