import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const getMedia = async (req: Request, res: Response) => {
  try {
    const mediaItems = await prisma.media.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(mediaItems);
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
