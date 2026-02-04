export const parseTags = (tags: any): string[] => {
  try {
    if (typeof tags === "string") {
      if (tags.trim().startsWith("[")) {
        return JSON.parse(tags);
      } else {
        return tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      }
    } else if (Array.isArray(tags)) {
      return tags;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid tags format");
  }
};

export const parseSeoKeywords = (
  seoKeywords: any,
): { keyword: string; order?: number }[] => {
  try {
    if (typeof seoKeywords === "string") {
      if (seoKeywords.trim().startsWith("[")) {
        return JSON.parse(seoKeywords);
      } else if (seoKeywords.trim().length > 0) {
        return [{ keyword: seoKeywords.trim(), order: 0 }];
      }
      return [];
    } else if (Array.isArray(seoKeywords)) {
      return seoKeywords;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid seoKeywords format");
  }
};

export type ParsedGalleryItem = {
  mediaId: string;
  order?: number;
};

export const parseGallery = (gallery: any): ParsedGalleryItem[] => {
  try {
    if (typeof gallery === "string") {
      if (gallery.trim().startsWith("[")) {
        return JSON.parse(gallery);
      } else if (gallery.trim().length > 0) {
        return [{ mediaId: gallery.trim(), order: 0 }];
      }
      return [];
    } else if (Array.isArray(gallery)) {
      return gallery;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid gallery format");
  }
};

export const parseTechnologies = (technologies: any): string[] => {
  try {
    if (typeof technologies === "string") {
      if (technologies.trim().startsWith("[")) {
        return JSON.parse(technologies);
      } else {
        return technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      }
    } else if (Array.isArray(technologies)) {
      return technologies;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid technologies format");
  }
};

export const parseSolutions = (solutions: any): string[] => {
  try {
    if (typeof solutions === "string") {
      if (solutions.trim().startsWith("[")) {
        return JSON.parse(solutions);
      } else {
        return solutions
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      }
    } else if (Array.isArray(solutions)) {
      return solutions;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid solutions format");
  }
};

export const parseIndustries = (industries: any): string[] => {
  try {
    if (typeof industries === "string") {
      if (industries.trim().startsWith("[")) {
        return JSON.parse(industries);
      } else {
        return industries
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i.length > 0);
      }
    } else if (Array.isArray(industries)) {
      return industries;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid industries format");
  }
};

export const parseCapabilities = (capabilities: any): string[] => {
  try {
    if (typeof capabilities === "string") {
      if (capabilities.trim().startsWith("[")) {
        return JSON.parse(capabilities);
      } else {
        return capabilities
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
      }
    } else if (Array.isArray(capabilities)) {
      return capabilities;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid capabilities format");
  }
};

export type ParsedCaseStudyImage = {
  imageId: string;
  order?: number;
};

export const parseCaseStudyImages = (images: any): ParsedCaseStudyImage[] => {
  try {
    if (typeof images === "string") {
      if (images.trim().startsWith("[")) {
        return JSON.parse(images);
      } else if (images.trim().length > 0) {
        return [{ imageId: images.trim(), order: 0 }];
      }
      return [];
    } else if (Array.isArray(images)) {
      return images;
    }
    return [];
  } catch (e) {
    throw new Error("Invalid case study images format");
  }
};
