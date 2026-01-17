import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildCMSArticleTagPaginationParams,
  buildCMSArticleTagSortParams,
  buildCMSArticleTagWhereCondition,
} from "../../../utils/queryBuilder/cms/article/tags";

// export const getTags = async (req: Request, res: Response) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const tags = await prisma.articleTag.findMany({
//       where: { deletedAt: null },
//       orderBy: { createdAt: "desc" },
//     });
//     return res.status(200).json(tags);
//   } catch (error) {
//     console.error("Error fetching Tags:", error);
//   }
// };

export const getTags = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      page = "1",
      limit = "10",
      search,
      isActive,
      sortBy,
      order,
    } = req.query;

    const where = buildCMSArticleTagWhereCondition({
      search: search as string,
      isActive: isActive as string,
    });

    const pagination = buildCMSArticleTagPaginationParams(
      page as string,
      limit as string,
    );

    const orderBy = buildCMSArticleTagSortParams(
      sortBy as string,
      order as string,
    );

    const [tags, total] = await Promise.all([
      prisma.articleTag.findMany({
        where,
        orderBy,
        ...pagination,
      }),
      prisma.articleTag.count({ where }),
    ]);

    return res.status(200).json({
      data: tags,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching Tags:", error);
    res.status(500).json({ message: "Failed to fetch tags" });
  }
};

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

export const createTag = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const slug = generateSlug(name);

    const exisiting = await prisma.articleTag.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });

    if (exisiting) {
      return res.status(409).json({
        message: "Tag with the same name already exists",
      });
    }

    const tag = await prisma.articleTag.create({
      data: {
        name,
        slug,
        isActive: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        tag,
      },
      message: "Tag created successfully",
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    res.status(500).json({
      message: "Failed to create tag",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, isActive } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const slug = generateSlug(name);

    const existing = await prisma.articleTag.findFirst({
      where: {
        slug,
        deletedAt: null,
        NOT: { id },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Tag with the same name already exists",
      });
    }

    const tag = await prisma.articleTag.update({
      where: { id },
      data: {
        name,
        slug,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    res.status(200).json({
      status: "Success",
      data: {
        tag,
      },
      message: "Tag updated successfully",
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    res.status(500).json({
      message: "Failed to update tag",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }

    const tag = await prisma.articleTag.findUnique({
      where: { id },
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await prisma.articleTag.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Failed to delete tag" });
  }
};
