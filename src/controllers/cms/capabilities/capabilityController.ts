import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  buildCMSCapabilityPaginationParams,
  buildCMSCapabilitySortParams,
  buildCMSCapabilityWhereCondition,
} from "../../../utils/queryBuilder/cms/capabilities/capability";
import { validateCapabilityData } from "../../../validators/capabilities/capabilityValidator";

export const getCapabilities = async (req: Request, res: Response) => {
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

    const where = buildCMSCapabilityWhereCondition({
      search: search as string,
      isActive: isActive as string,
    });

    const pagination = buildCMSCapabilityPaginationParams(
      page as string,
      limit as string,
    );

    const orderBy = buildCMSCapabilitySortParams(
      sortBy as string,
      order as string,
    );

    const [capabilities, total] = await Promise.all([
      prisma.capability.findMany({
        where,
        orderBy,
        ...pagination,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          icon: true,
          color: true,
          order: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              caseStudies: true,
              // events: true,
              // articles: true,
            },
          },
        },
      }),
      prisma.capability.count({ where }),
    ]);

    return res.status(200).json({
      data: capabilities,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching capabilities:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch capabilities"
        : (error as Error).message;

    res.status(500).json({ message });
  }
};

export const getCapabilityById = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Capability ID is required" });
    }

    const capability = await prisma.capability.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            caseStudies: true,
            // events: true,
            // articles: true,
          },
        },
      },
    });

    if (!capability) {
      return res.status(404).json({ message: "Capability not found" });
    }

    return res.status(200).json({
      data: capability,
    });
  } catch (error) {
    console.error("Error fetching capability:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch capability"
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

export const createCapability = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate for CREATE (isUpdate = false)
    const errors = validateCapabilityData(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const { name, slug, description, icon, color, order, isActive } = req.body;

    const finalSlug = slug?.trim() ? slug : generateSlug(name);

    const existing = await prisma.capability.findFirst({
      where: {
        slug: finalSlug,
        deletedAt: null,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Capability with the same slug already exists",
      });
    }

    const capability = await prisma.capability.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        icon: icon || null,
        color: color || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json({
      status: "success",
      data: { capability },
      message: "Capability created successfully",
    });
  } catch (error) {
    console.error("Error creating capability:", error);
    res.status(500).json({
      message: "Failed to create capability",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateCapability = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Capability ID is required" });
    }

    const errors = validateCapabilityData(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const existingCapability = await prisma.capability.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingCapability) {
      return res.status(404).json({ message: "Capability not found" });
    }

    const { name, slug, description, icon, color, order, isActive } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (slug !== undefined || name !== undefined) {
      const finalSlug = slug?.trim()
        ? slug
        : name
          ? generateSlug(name)
          : existingCapability.slug;

      const slugConflict = await prisma.capability.findFirst({
        where: {
          slug: finalSlug,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (slugConflict) {
        return res.status(409).json({
          message: "Capability with the same slug already exists",
        });
      }

      updateData.slug = finalSlug;
    }

    const capability = await prisma.capability.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      status: "success",
      data: { capability },
      message: "Capability updated successfully",
    });
  } catch (error) {
    console.error("Error updating capability:", error);
    res.status(500).json({
      message: "Failed to update capability",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteCapability = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Capability ID is required" });
    }

    const capability = await prisma.capability.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            caseStudies: true,
            // events: true,
            // articles: true,
          },
        },
      },
    });

    if (!capability) {
      return res.status(404).json({ message: "Capability not found" });
    }

    // const totalUsage = capability._count.caseStudies + capability._count.events;
    const totalUsage = capability._count.caseStudies;

    if (totalUsage > 0) {
      return res.status(409).json({
        message: `Cannot delete capability. It is being used in ${totalUsage} content item(s)`,
        usage: {
          caseStudies: capability._count.caseStudies,
          // events: capability._count.events,
          // articles: capability._count.articles,
        },
      });
    }

    await prisma.capability.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Capability deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting capability:", error);
    res.status(500).json({ message: "Failed to delete capability" });
  }
};
