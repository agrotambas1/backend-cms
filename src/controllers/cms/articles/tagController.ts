import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildCMSArticleTagPaginationParams,
  buildCMSArticleTagSortParams,
  buildCMSArticleTagWhereCondition,
} from "../../../utils/queryBuilder/cms/articles/tags";
import { generateSlug } from "../../../utils/generateSlug";

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
    console.error("Error fetching article tags:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch article tags"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // const slug = generateSlug(name);
    const finalSlug = slug?.trim() ? slug : generateSlug(name);

    const exisiting = await prisma.articleTag.findFirst({
      where: {
        slug: finalSlug,
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
        slug: finalSlug,
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
    const { name, slug, isActive } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // const slug = generateSlug(name);
    const finalSlug = slug?.trim() ? slug : generateSlug(name);

    const existing = await prisma.articleTag.findFirst({
      where: {
        slug: finalSlug,
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
        slug: finalSlug,
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

// export const deleteTag = async (req: Request, res: Response) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: "Tag ID is required" });
//     }

//     const tag = await prisma.articleTag.findUnique({
//       where: { id },
//     });

//     if (!tag) {
//       return res.status(404).json({ message: "Tag not found" });
//     }

//     await prisma.articleTag.update({
//       where: { id },
//       data: {
//         deletedAt: new Date(),
//       },
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Tag deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting tag:", error);
//     res.status(500).json({ message: "Failed to delete tag" });
//   }
// };

export const deleteTag = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Tag ID is required" });
    }

    const tag = await prisma.articleTag.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    if (tag._count.articles > 0) {
      return res.status(409).json({
        message: `Cannot delete tag. It is being used in ${tag._count.articles} article(s).`,
        usage: {
          articles: tag._count.articles,
        },
      });
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
