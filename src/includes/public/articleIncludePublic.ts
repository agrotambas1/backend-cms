export const articlePublicSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  publishedAt: true,
  viewCount: true,
  isFeatured: true,
  metaTitle: true,
  metaDescription: true,
  updatedAt: true,

  thumbnailMedia: {
    select: {
      id: true,
      url: true,
      altText: true,
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
    select: {
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
};

export const transformArticlePublic = (article: any) => ({
  ...article,
  tags: article.tags.map((at: any) => at.tag),
});
