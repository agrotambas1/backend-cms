import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import fs from "fs";
import path from "path";
import { error } from "console";

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        image: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json(banners);
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
      include: {
        image: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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

    // Validasi
    if (!imageId) {
      return res.status(400).json({ message: "Image file is required" });
    } else if (!title) {
      return res.status(400).json({ message: "Title is required" });
    } else if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    // Validasi status
    const validStatuses = ["draft", "active", "inactive"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    let selectedImageId: string;
    if (imageId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: imageId },
      });
      if (!mediaExists) {
        return res
          .status(400)
          .json({ message: "Selected image does not exist" });
      }
      selectedImageId = imageId;
    } else {
      return res.status(400).json({ message: "Image ID is required" });
    }

    // Create banner
    const banner = await prisma.banner.create({
      data: {
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
      },
      include: {
        image: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
            mimeType: true,
            width: true,
            height: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Banner created successfully",
      data: { banner },
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
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

    const validStatuses = ["draft", "active", "inactive"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const existingBanner = await prisma.banner.findFirst({
      where: { id, deletedAt: null },
      include: { image: true },
    });

    if (!existingBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    let selectedImageId: string = existingBanner.imageId;
    if (imageId) {
      const mediaExists = await prisma.media.findUnique({
        where: { id: imageId },
      });
      if (!mediaExists) {
        return res
          .status(400)
          .json({ message: "Selected image does not exist" });
      }
      selectedImageId = imageId;
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        title: title ?? existingBanner.title,
        description: description ?? existingBanner.description,
        imageId: selectedImageId,
        linkImage:
          linkImage !== undefined ? linkImage : existingBanner.linkImage,
        order: order !== undefined ? parseInt(order, 10) : existingBanner.order,
        status: status || existingBanner.status,
        startDate: startDate ? new Date(startDate) : existingBanner.startDate,
        endDate: endDate ? new Date(endDate) : existingBanner.endDate,
        updatedBy: req.user.id,
      },
      include: {
        image: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            altText: true,
            url: true,
            mimeType: true,
            width: true,
            height: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Banner updated successfully",
      data: { banner: updatedBanner },
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
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
