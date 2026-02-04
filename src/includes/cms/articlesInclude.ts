import { Prisma } from "@prisma/client";

export const articleInclude = {
  thumbnailMedia: {
    select: {
      id: true,
      fileName: true,
      filePath: true,
      altText: true,
      url: true,
    },
  },
  publication: {
    select: {
      id: true,
      fileName: true,
      filePath: true,
      altText: true,
      url: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  tags: {
    include: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
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
  updater: {
    select: {
      id: true,
      name: true,
    },
  },
  seoKeywords: {
    select: {
      id: true,
      keyword: true,
      order: true,
    },
    orderBy: {
      order: "asc" as const,
    },
  },
} satisfies Prisma.ArticleInclude;

export const transformArticle = (article: any) => ({
  ...article,
  tags: article.tags.map((at: any) => at.tag),
});
