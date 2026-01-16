import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import fs from "fs";
import {
  buildCMSMediaPaginationParams,
  buildCMSMediaSortParams,
  buildCMSMediaWhereCondition,
} from "../../../utils/queryBuilder/cms/media/media";

// export const getMedia = async (req: Request, res: Response) => {
//   try {
//     const mediaItems = await prisma.media.findMany({
//       where: {
//         deletedAt: null,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     res.json(mediaItems);
//   } catch (error) {
//     console.error("Error fetching media:", error);
//     res.status(500).json({ message: "Failed to fetch media" });
//   }
// };

export const getMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { page = "1", limit = "20", search, type, sortBy, order } = req.query;

    const where = buildCMSMediaWhereCondition({
      search: search as string,
      type: type as string,
    });

    const pagination = buildCMSMediaPaginationParams(
      page as string,
      limit as string
    );

    const orderBy = buildCMSMediaSortParams(sortBy as string, order as string);

    const [mediaItems, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy,
        ...pagination,
      }),
      prisma.media.count({ where }),
    ]);

    return res.status(200).json({
      data: mediaItems,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Failed to fetch media" });
  }
};

export const getMediaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Media ID is required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media || media.deletedAt) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.json({
      status: "success",
      data: { media },
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Failed to fetch media" });
  }
};

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const file = req.file;
    const { alt_text, caption } = req.body;

    const media = await prisma.media.create({
      data: {
        fileName: file.filename,
        filePath: file.path,
        mimeType: file.mimetype,
        fileSize: file.size,
        url: `/uploads/${file.filename}`,
        altText: alt_text,
        caption: caption,
        createdBy: req.user.id,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ message: "Failed to upload media" });
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Media ID is required" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { altText, caption } = req.body;

    // Check if media exists
    const mediaExists = await prisma.media.findUnique({
      where: { id },
    });

    if (!mediaExists || mediaExists.deletedAt) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Prepare update data
    const updateData: any = {};

    // Update metadata
    if (altText !== undefined) updateData.altText = altText;
    if (caption !== undefined) updateData.caption = caption;

    // Jika ada file baru, replace file lama
    if (req.file) {
      const file = req.file;

      // Hapus file lama
      try {
        if (fs.existsSync(mediaExists.filePath)) {
          fs.unlinkSync(mediaExists.filePath);
        }
      } catch (fileError) {
        console.error("Error deleting old file:", fileError);
      }

      // Update dengan file baru
      updateData.fileName = file.filename;
      updateData.filePath = file.path;
      updateData.mimeType = file.mimetype;
      updateData.fileSize = file.size;
      updateData.url = `/uploads/${file.filename}`;
    }

    const media = await prisma.media.update({
      where: { id },
      data: updateData,
    });

    res.json({
      status: "success",
      data: { media },
    });
  } catch (error) {
    console.error("Error updating media:", error);
    res.status(500).json({ message: "Failed to update media" });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Media ID is required" });
    }

    // Check authorization
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if media exists
    const mediaExists = await prisma.media.findUnique({
      where: { id },
    });

    if (!mediaExists || mediaExists.deletedAt) {
      return res.status(404).json({ message: "Media not found" });
    }

    if (mediaExists.createdBy !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to update this media",
      });
    }

    const media = await prisma.media.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Optional: Hard delete + hapus file fisik (uncomment jika mau hard delete)
    // try {
    //   // Hapus file fisik dari server
    //   if (fs.existsSync(mediaExists.filePath)) {
    //     fs.unlinkSync(mediaExists.filePath);
    //   }
    // } catch (fileError) {
    //   console.error("Error deleting file:", fileError);
    //   // Tetap lanjut hapus dari database meskipun file gagal dihapus
    // }
    //
    // // Hard delete dari database
    // await prisma.media.delete({
    //   where: { id },
    // });

    res.json({
      status: "success",
      message: "Media deleted successfully",
      data: { media },
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ message: "Failed to delete media" });
  }
};
