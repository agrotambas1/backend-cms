import { Request, Response } from "express";
import { prisma } from "../../config/db";
import fs from "fs";
import path from "path";
import { error } from "console";

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        deletedAt: null,
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

export const createBannerWithMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      alt_text,
      caption,
      linkImage,
      order,
      status,
      startDate,
      endDate,
    } = req.body;
    const file = req.file;

    if (!file || !description || !title) {
      return res
        .status(400)
        .json({ message: "Title, description, and image file are required" });
    }

    // Media
    const media = await prisma.media.create({
      data: {
        fileName: file.filename,
        filePath: file.path,
        mimeType: file.mimetype,
        fileSize: file.size,
        url: `/uploads/${file.filename}`,
        altText: alt_text || null,
        caption: caption || null,
        createdBy: req.user.id,
      },
    });

    // Banner
    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        imageId: media.id,
        imageUrl: media.url,
        imageAlt: alt_text || null,
        linkImage: linkImage || null,
        order: order ? parseInt(order, 10) : 0,
        status: status || "draft",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdBy: req.user.id,
        updatedBy: req.user.id,
      },
      include: { image: true, creator: true, updater: true },
    });

    return res.status(201).json({
      status: "success",
      data: { banner },
    });
  } catch (error: any) {
    console.error("Error creating banner:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    res.status(500).json({
      message: "Failed to create banner",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateBannerWithMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (!id) return res.status(400).json({ message: "Banner ID is required" });

    const {
      title,
      description,
      alt_text,
      caption,
      linkImage,
      order,
      status,
      startDate,
      endDate,
    } = req.body;

    const file = req.file;

    const existingBanner = await prisma.banner.findUnique({
      where: { id },
      include: { image: true },
    });

    if (!existingBanner || existingBanner.deletedAt) {
      return res.status(404).json({ message: "Banner not found" });
    }

    let imageId = existingBanner.imageId;
    let imageUrl = existingBanner.imageUrl;
    let imageAlt = existingBanner.imageAlt;

    const oldImageId = existingBanner.imageId;
    const oldImageFilePath = existingBanner.image?.filePath;

    if (file) {
      const media = await prisma.media.create({
        data: {
          fileName: file.filename,
          filePath: file.path,
          mimeType: file.mimetype,
          fileSize: file.size,
          url: `/uploads/${file.filename}`,
          altText: alt_text || null,
          caption: caption || null,
          createdBy: req.user.id,
        },
      });

      imageId = media.id;
      imageUrl = media.url;
      imageAlt = alt_text || null;
    } else if (alt_text !== undefined || caption !== undefined) {
      if (existingBanner.imageId) {
        await prisma.media.update({
          where: { id: existingBanner.imageId },
          data: {
            ...(alt_text !== undefined && { altText: alt_text || null }),
            ...(caption !== undefined && { caption: caption || null }),
          },
        });

        if (alt_text !== undefined) {
          imageAlt = alt_text || null;
        }
      }
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: {
        title: title || existingBanner.title,
        description: description || existingBanner.description,
        imageId,
        imageUrl,
        imageAlt,
        linkImage: linkImage || existingBanner.linkImage,
        order: order ? parseInt(order, 10) : existingBanner.order,
        status: status || existingBanner.status,
        startDate: startDate ? new Date(startDate) : existingBanner.startDate,
        endDate: endDate ? new Date(endDate) : existingBanner.endDate,
        updatedBy: req.user.id,
      },
      include: { image: true, creator: true, updater: true },
    });

    if (file && oldImageId) {
      if (oldImageFilePath) {
        const oldFilePath = path.resolve(oldImageFilePath);
        fs.unlink(oldFilePath, (error) => {
          if (error) console.error("Error deleting old media file:", error);
        });
      }

      await prisma.media
        .delete({
          where: { id: oldImageId },
        })
        .catch((error) => {
          console.error("Error deleting old media record:", error);
        });
    }

    return res.json({
      status: "success",
      data: { banner: updatedBanner },
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    res.status(500).json({
      message: "Failed to update banner",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
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
      include: { image: true },
    });

    if (!banner || banner.deletedAt) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await prisma.banner.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    if (banner.imageId) {
      await prisma.media
        .update({
          where: { id: banner.imageId },
          data: {
            deletedAt: new Date(),
          },
        })
        .catch((error) => {
          console.error("Error soft deleting associated media:", error);
        });
    }

    return res.json({
      status: "success",
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Failed to delete banner" });
  }
};
