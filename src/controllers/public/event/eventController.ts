import { Request, Response } from "express";
import { prisma } from "../../../config/db";
import {
  eventPublicSelect,
  transformEventPublic,
} from "../../../includes/public/eventIncludePublic";
import {
  buildPublicEventPaginationMeta,
  buildPublicEventPaginationParams,
  buildPublicEventSortParams,
  buildPublicEventWhereCondition,
} from "../../../utils/queryBuilder/public/event/event";

export const getPublicEvents = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy,
      order,
      search,
      serviceSlug,
      industrySlug,
      timeFilter,
    } = req.query;

    const where = buildPublicEventWhereCondition({
      search: search as string,
      serviceSlug: serviceSlug as string,
      industrySlug: industrySlug as string,
      timeFilter: timeFilter as "upcoming" | "past" | "homepage",
    });

    const pagination = buildPublicEventPaginationParams(
      page as string,
      limit as string,
    );

    const orderBy = buildPublicEventSortParams(
      sortBy as string,
      order as string,
    );

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        select: eventPublicSelect,
        orderBy,
        ...pagination,
      }),
      prisma.event.count({ where }),
    ]);

    res.set({
      "Cache-Control": "public, max-age=300, s-maxage=600",
      "X-Total-Count": total.toString(),
    });

    return res.status(200).json({
      success: true,
      data: events.map(transformEventPublic),
      meta: buildPublicEventPaginationMeta(total, Number(page), Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching events:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch events"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getPublicEventBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const event = await prisma.event.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: "published",
      },
      select: eventPublicSelect,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.set({
      "Cache-Control": "public, max-age=600, s-maxage=3600",
    });

    return res.status(200).json({
      success: true,
      data: transformEventPublic(event),
    });
  } catch (error) {
    console.error("Error fetching event:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch event"
        : (error as Error).message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
