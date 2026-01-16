const VALID_STATUSES = ["draft", "published", "scheduled", "archived"];

export const validateCaseStudyData = (data: {
  title?: string;
  slug?: string;
  description?: string;
  client?: string;
  content?: string;
  categoryId?: string;
  status?: string;
  technologies?: any;
}) => {
  const errors: string[] = [];

  if (!data.title) errors.push("Title is required");
  if (!data.slug) errors.push("Slug is required");
  if (!data.description) errors.push("Description is required");
  if (!data.client) errors.push("Client is required");
  if (!data.content) errors.push("Content is required");
  if (!data.categoryId) errors.push("Category is required");
  if (!data.status) errors.push("Status is required");
  if (!data.technologies || data.technologies.length === 0) {
    errors.push("Technologies are required");
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  return errors;
};
