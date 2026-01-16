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
  images: {
    orderBy: [{ order: "asc" as Prisma.SortOrder }],
    include: { media: true },
  },
  creator: { select: { id: true, name: true, username: true } },
  updater: { select: { id: true, name: true, username: true } },
};

export const transformEvent = (event: any) => ({
  ...event,
  images: event.images.map((img: any) => img.media),
});
