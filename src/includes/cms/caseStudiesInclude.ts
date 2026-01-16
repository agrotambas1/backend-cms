export const caseStudyInclude = {
  thumbnailMedia: {
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
      icon: true,
    },
  },
  images: {
    select: {
      id: true,
      order: true,
      media: {
        select: {
          id: true,
          fileName: true,
          filePath: true,
          altText: true,
          url: true,
        },
      },
    },
    orderBy: {
      order: "asc" as const,
    },
  },
  technologies: {
    include: {
      technology: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
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
};

export const transformCaseStudy = (caseStudy: any) => ({
  ...caseStudy,
  technologies: caseStudy.technologies.map((ct: any) => ct.technology),
  images: caseStudy.images.map((img: any) => ({
    id: img.id,
    order: img.order,
    ...img.media,
  })),
});
