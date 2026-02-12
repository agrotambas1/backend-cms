export declare const parseTags: (tags: any) => string[];
export declare const parseSeoKeywords: (seoKeywords: any) => {
    keyword: string;
    order?: number;
}[];
export type ParsedGalleryItem = {
    mediaId: string;
    order?: number;
};
export declare const parseGallery: (gallery: any) => ParsedGalleryItem[];
export declare const parseTechnologies: (technologies: any) => string[];
export declare const parseSolutions: (solutions: any) => string[];
export declare const parseIndustries: (industries: any) => string[];
export declare const parseCapabilities: (capabilities: any) => string[];
export type ParsedCaseStudyImage = {
    imageId: string;
    order?: number;
};
export declare const parseCaseStudyImages: (images: any) => ParsedCaseStudyImage[];
//# sourceMappingURL=parseHelper.d.ts.map