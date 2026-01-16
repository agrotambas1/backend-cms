const VALID_STATUSES = ["draft", "active", "inactive"];

export const validateBannerData = (data: {
  title?: string;
  description?: string;
  imageId?: string;
  status?: string;
}) => {
  const errors: string[] = [];

  if (!data.title) errors.push("Title is required");
  if (!data.description) errors.push("Description is required");
  if (!data.imageId) errors.push("Image file is required");

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  return errors;
};

export const validateBannerStatus = (status: string): boolean => {
  return VALID_STATUSES.includes(status);
};
