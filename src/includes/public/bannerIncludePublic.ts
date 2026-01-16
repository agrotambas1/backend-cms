export const bannerPublicSelect = {
  id: true,
  title: true,
  description: true,
  linkImage: true,
  order: true,

  image: {
    select: {
      id: true,
      url: true,
      altText: true,
    },
  },
};
