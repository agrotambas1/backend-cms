export const caseStudyInclude = {
  thumbnailMedia: {
    select: {
      id: true,
      fileName: true,
      altText: true,
      url: true,
    },
  },
  solutions: {
    select: {
      solution: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
    },
  },
  industries: {
    select: {
      industry: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },
    },
  },
  capabilities: {
    select: {
      capability: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
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
};

export const transformCaseStudy = (caseStudy: any) => ({
  ...caseStudy,
  solutions: caseStudy.solutions?.map((cs: any) => cs.solution) || [],
  industries: caseStudy.industries?.map((ci: any) => ci.industry) || [],
  capabilities: caseStudy.capabilities?.map((cc: any) => cc.capability) || [],
});
