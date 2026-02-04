import { Prisma } from "@prisma/client";

export const caseStudyPublicSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  // content: true,

  client: true,
  // projectUrl: true,
  // demoURL: true,
  duration: true,
  year: true,

  // status: true,
  publishedAt: true,
  isFeatured: true,
  // order: true,

  createdAt: true,

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
      icon: true,
    },
  },

  // images: {
  //   orderBy: {
  //     order: "asc" as const,
  //   },
  //   select: {
  //     id: true,
  //     order: true,
  //     media: {
  //       select: {
  //         id: true,
  //         url: true,
  //         altText: true,
  //       },
  //     },
  //   },
  // },

  technologies: {
    select: {
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
} satisfies Prisma.CaseStudySelect;

export const caseStudyPublicDetailSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  content: true,

  client: true,
  projectUrl: true,
  demoURL: true,
  duration: true,
  year: true,

  publishedAt: true,
  isFeatured: true,

  thumbnailMedia: {
    select: {
      id: true,
      url: true,
      altText: true,
      width: true,
      height: true,
    },
  },

  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      description: true,
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
        },
      },
    },
  },

  technologies: {
    select: {
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
} satisfies Prisma.CaseStudySelect;

export const transformCaseStudyPublic = (caseStudy: any) => ({
  ...caseStudy,
  technologies: caseStudy.technologies?.map((ct: any) => ct.technology) || [],
  images:
    caseStudy.images?.map((img: any) => ({
      id: img.id,
      order: img.order,
      ...img.media,
    })) || [],
});
