import { Prisma } from "@prisma/client";

export const eventPublicSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,

  eventStart: true,
  eventEnd: true,

  location: true,
  locationType: true,
  quota: true,

  status: true,
  isFeatured: true,

  createdAt: true,

  thumbnailMedia: {
    select: {
      id: true,
      url: true,
      altText: true,
    },
  },

  creator: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.EventSelect;

export const eventPublicDetailSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,

  eventStart: true,
  eventEnd: true,

  location: true,
  locationType: true,
  meetingUrl: true,
  registrationUrl: true,
  quota: true,

  status: true,
  isFeatured: true,

  createdAt: true,

  thumbnailMedia: {
    select: {
      id: true,
      url: true,
      altText: true,
      width: true,
      height: true,
    },
  },

  images: {
    orderBy: {
      order: "asc" as const,
    },
    select: {
      id: true,
      order: true,
      media: {
        select: {
          id: true,
          url: true,
          altText: true,
          width: true,
          height: true,
        },
      },
    },
  },

  creator: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.EventSelect;

export const transformEventPublic = (event: any) => ({
  ...event,
  images: event.images.map((img: any) => ({
    id: img.id,
    order: img.order,
    media: img.media,
  })),
});
