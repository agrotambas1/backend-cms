import { Prisma } from "@prisma/client";

export const eventPublicSelect = {
  id: true,
  eventName: true,
  slug: true,
  eventType: true,
  excerpt: true,
  description: true,
  eventDate: true,
  location: true,
  locationType: true,
  quota: true,
  status: true,
  createdAt: true,

  thumbnailMedia: {
    select: {
      id: true,
      url: true,
      altText: true,
    },
  },

  service: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  },
  industry: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
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
  eventName: true,
  slug: true,
  eventType: true,
  excerpt: true,
  description: true,
  eventDate: true,
  location: true,
  locationType: true,
  quota: true,
  status: true,
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

  service: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  },
  industry: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
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
});
