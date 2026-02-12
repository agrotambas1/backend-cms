"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBannerStatus = exports.validateBannerData = void 0;
const VALID_STATUSES = ["draft", "active", "inactive"];
const validateBannerData = (data) => {
    const errors = [];
    if (!data.title)
        errors.push("Title is required");
    if (!data.description)
        errors.push("Description is required");
    if (!data.imageId)
        errors.push("Image file is required");
    if (data.status && !VALID_STATUSES.includes(data.status)) {
        errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
    }
    return errors;
};
exports.validateBannerData = validateBannerData;
const validateBannerStatus = (status) => {
    return VALID_STATUSES.includes(status);
};
exports.validateBannerStatus = validateBannerStatus;
//# sourceMappingURL=bannerValidator.js.map