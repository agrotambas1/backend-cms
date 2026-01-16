import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import { bannerInclude } from "../../../includes/cms/bannerInclude";
import { validateBannerData } from "../../../validators/bannerValidator";
import {
  buildCMSBannerPaginationParams,
  buildCMSBannerSortParams,
  buildCMSBannerWhereCondition,
} from "../../../utils/queryBuilder/cms/banner/banner";

// export const getBanners = async (req: Request, res: Response) => {
//   try {
//     const banners = await prisma.banner.findMany({
//       where: {
//         deletedAt: null,
//       },
//       include: bannerInclude,
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     res.json(banners);
//   } catch (error) {
//     console.error("Error fetching banners:", error);
//     res.status(500).json({ message: "Failed to fetch banners" });
//   }
// };

export const getBanners = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      page = "1",
      limit = "10",
      search,
      status,
      sortBy,
      order,
    } = req.query;

    const where = buildCMSBannerWhereCondition({
      search: search as string,
      status: status as string,
    });

    const pagination = buildCMSBannerPaginationParams(
      page as string,
      limit as string
    );

    const orderBy = buildCMSBannerSortParams(sortBy as string, order as string);

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        include: bannerInclude,
        orderBy,
        ...pagination,
      }),
      prisma.banner.count({ where }),
    ]);

    return res.status(200).json({
      data: banners,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Banner ID is required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const banner = await prisma.banner.findUnique({
      where: { id },
      include: bannerInclude,
    });

    if (!banner || banner.deletedAt) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({
      status: "success",
      data: { banner },
    });
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({ message: "Failed to fetch banner" });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      imageId,
      linkImage,
      order,
      status,
      startDate,
      endDate,
    } = req.body;

    const validationErrors = validateBannerData({
      title,
      description,
      imageId,
      status,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    let selectedImageId: string | null = null;
    if (imageId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: imageId },
      });
      if (!mediaExists) {
        return res.status(400).json({
          message: `Media with ID ${imageId} not found`,
        });
      }
      selectedImageId = imageId;
    }

    const bannerData: any = {
      title,
      description,
      imageId: selectedImageId,
      linkImage: linkImage || null,
      order: order ? parseInt(order, 10) : 0,
      status: status || "draft",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    const banner = await prisma.banner.create({
      data: bannerData,
      include: bannerInclude,
    });

    return res.status(201).json({
      status: "success",
      message: "Banner created successfully",
      data: { banner },
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    return res.status(500).json({
      message: "Failed to create banner",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Banner ID is required" });
    }

    const {
      title,
      description,
      imageId,
      linkImage,
      order,
      status,
      startDate,
      endDate,
    } = req.body;

    const existingBanner = await prisma.banner.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const validationErrors = validateBannerData({
      title,
      description,
      imageId,
      status,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
      });
    }

    let selectedImageId: string | null = existingBanner.imageId;
    if (imageId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: imageId },
      });
      if (!mediaExists) {
        return res.status(400).json({
          message: "Selected media does not exist",
        });
      }
      selectedImageId = imageId;
    }

    const bannerData: any = {
      title,
      description,
      imageId: selectedImageId,
      linkImage: linkImage || null,
      order: order ? parseInt(order, 10) : 0,
      status: status || "draft",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      updatedBy: req.user.id,
    };

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: bannerData,
      include: bannerInclude,
    });

    return res.status(200).json({
      status: "success",
      message: "Banner updated successfully",
      data: { banner: updatedBanner },
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    return res.status(500).json({
      message: "Failed to update banner",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Banner ID is required" });
    }

    // Check banner exists
    const banner = await prisma.banner.findFirst({
      where: { id, deletedAt: null },
    });

    if (!banner) {
      return res.status(404).json({
        message: "Banner not found or already deleted",
      });
    }

    await prisma.banner.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: req.user.id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return res.status(500).json({
      message: "Failed to delete banner",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
