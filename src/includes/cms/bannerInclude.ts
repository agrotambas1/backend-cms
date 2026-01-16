export const bannerInclude = {
  image: {
    select: {
      id: true,
      fileName: true,
      filePath: true,
      altText: true,
      url: true,
    },
  },
  creator: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
  updater: {
    select: {
      id: true,
      name: true,
      username: true,
    },
  },
};
