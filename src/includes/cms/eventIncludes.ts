import { Prisma } from "@prisma/client";

export const eventInclude = {
  thumbnailMedia: {
    select: {
      id: true,
      fileName: true,
      filePath: true,
      altText: true,
      url: true,
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
  creator: { select: { id: true, name: true, username: true } },
  updater: { select: { id: true, name: true, username: true } },
} satisfies Prisma.EventInclude;

export const transformEvent = (event: any) => ({
  ...event,
});
