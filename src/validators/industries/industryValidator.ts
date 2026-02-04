export const validateIndustryData = (
  data: {
    name?: string;
    slug?: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    order?: number;
    isActive?: boolean;
  },
  isUpdate = false,
) => {
  const errors: string[] = [];

  if (!isUpdate) {
    if (!data.name) errors.push("Industry name is required");
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
      errors.push(
        "Slug must contain only lowercase letters, numbers, and hyphens",
      );
    }
  }

  if (data.description !== undefined && data.description !== null) {
    if (data.description.length > 5000) {
      errors.push("Description is too long (max 5000 characters)");
    }
  }

  if (data.icon !== undefined && data.icon !== null) {
    if (data.icon.length > 500) {
      errors.push("Icon path is too long (max 500 characters)");
    }
  }

  if (data.color !== undefined && data.color !== null && data.color.trim()) {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(data.color)) {
      errors.push("Color must be a valid hex code (e.g., #fff or #ffffff)");
    }
  }

  if (data.order !== undefined) {
    if (!Number.isInteger(data.order) || data.order < 0) {
      errors.push("Order must be a positive integer");
    }
  }

  if (data.isActive !== undefined) {
    if (typeof data.isActive !== "boolean") {
      errors.push("isActive must be a boolean value");
    }
  }

  return errors;
};
