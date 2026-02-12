export const validateServiceData = (
  data: {
    name?: string;
    slug?: string;
    description?: string | null;
    isActive?: boolean;
  },
  isUpdate = false,
) => {
  const errors: string[] = [];

  if (!isUpdate) {
    if (!data.name) errors.push("Service name is required");
  }

  if (data.name !== undefined) {
    if (data.name.trim().length === 0) {
      errors.push("Service name cannot be empty");
    }
    if (data.name.length > 255) {
      errors.push("Service name is too long (max 255 characters)");
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

  if (data.isActive !== undefined) {
    if (typeof data.isActive !== "boolean") {
      errors.push("isActive must be a boolean value");
    }
  }

  return errors;
};
