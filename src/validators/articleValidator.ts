const VALID_STATUSES = ["draft", "published", "scheduled", "archived"];

export const validateArticleData = (data: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  categoryId?: string;
  tags?: any;
  status?: string;
}) => {
  const errors: string[] = [];

  if (!data.title) errors.push("Title is required");
  if (!data.slug) errors.push("Slug is required");
  if (!data.excerpt) errors.push("Excerpt is required");
  if (!data.content) errors.push("Content is required");
  if (!data.categoryId) errors.push("Category is required");
  if (!data.tags || data.tags.length === 0) errors.push("Tags are required");
  if (!data.status) errors.push("Status is required");

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  return errors;
};
