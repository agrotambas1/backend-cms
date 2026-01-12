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
  seoKeywords: any
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
    if (!gallery) return [];

    if (typeof gallery === "string") {
      const trimmed = gallery.trim();

      if (trimmed.startsWith("[")) {
        const parsed = JSON.parse(trimmed);
        if (!Array.isArray(parsed)) throw new Error();
        return parsed.map((item, index) => ({
          mediaId: item.mediaId,
          order: typeof item.order === "number" ? item.order : index,
        }));
      }

      return trimmed
        .split(",")
        .map((id, index) => ({ mediaId: id.trim(), order: index }))
        .filter((item) => item.mediaId.length > 0);
    }

    if (Array.isArray(gallery)) {
      return gallery.map((item, index) => ({
        mediaId: item.mediaId,
        order: typeof item.order === "number" ? item.order : index,
      }));
    }

    return [];
  } catch {
    throw new Error("Invalid gallery format");
  }
};
