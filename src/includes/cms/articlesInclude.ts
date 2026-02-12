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
  updater: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.ArticleInclude;

export const transformArticle = (article: any) => ({
  ...article,
  tags: article.tags.map((at: any) => at.tag) || [],

  seoKeywords: article.seoKeywords || [],
});
