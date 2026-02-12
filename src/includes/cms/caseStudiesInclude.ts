export const caseStudyInclude = {
  thumbnailMedia: {
    select: {
      id: true,
      fileName: true,
      altText: true,
      url: true,
    },
  },
  publication: {
    select: {
      id: true,
      fileName: true,
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
  outcomes: caseStudy.outcomes || [],
  seoKeywords: caseStudy.seoKeywords || [],
});
