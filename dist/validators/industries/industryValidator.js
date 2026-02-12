"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIndustryData = void 0;
const validateIndustryData = (data, isUpdate = false) => {
    const errors = [];
    if (!isUpdate) {
        if (!data.name)
            errors.push("Industry name is required");
    }
    if (data.name !== undefined) {
        if (data.name.trim().length === 0) {
            errors.push("Industry name cannot be empty");
        }
        if (data.name.length > 255) {
            errors.push("Industry name is too long (max 255 characters)");
        }
    }
    if (data.slug !== undefined && data.slug !== null && data.slug.trim()) {
        if (data.slug.length > 255) {
            errors.push("Slug is too long (max 255 characters)");
        }
        if (!/^[a-z0-9-]*$/.test(data.slug)) {
            errors.push("Slug must contain only lowercase letters, numbers, and hyphens");
        }
    }
    if (data.description !== undefined && data.description !== null) {
        if (data.description.length > 5000) {
            errors.push("Description is too long (max 5000 characters)");
        }
    }
    if (data.isActive !== undefined) {
        if (typeof data.isActive !== "boolean") {
            errors.push("isActive must be a boolean value");
        }
    }
    return errors;
};
exports.validateIndustryData = validateIndustryData;
//# sourceMappingURL=industryValidator.js.map