const VALID_STATUSES = ["draft", "published", "scheduled", "archived"];

export const validateCaseStudyData = (
  data: {
    title?: string;
    slug?: string;
    summary?: string;
    description?: string;
    content?: string;
    problem?: string;
    solution?: string;
    outcome?: string;
    client?: string;
    status?: string;
    metaTitle?: string;
    metaDescription?: string;
    solutions?: any;
    industries?: any;
    capabilities?: any;
  },
  isUpdate = false,
) => {
  const errors: string[] = [];

  if (!isUpdate) {
    if (!data.title) errors.push("Title is required");
    if (!data.slug) errors.push("Slug is required");
    if (!data.status) errors.push("Status is required");
    if (!data.solutions || data.solutions.length === 0) {
      errors.push("At least one solution is required");
    }
    if (!data.industries || data.industries.length === 0) {
      errors.push("At least one industry is required");
    }
  }

  if (data.title !== undefined) {
    if (data.title.trim().length === 0) {
      errors.push("Title cannot be empty");
    }
    if (data.title.length > 255) {
      errors.push("Title is too long (max 255 characters)");
    }
  }

  if (data.slug !== undefined && data.slug.trim()) {
    if (data.slug.length > 255) {
      errors.push("Slug is too long (max 255 characters)");
    }
    if (!/^[a-z0-9-]*$/.test(data.slug)) {
      errors.push(
        "Slug must contain only lowercase letters, numbers, and hyphens",
      );
    }
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (data.metaTitle !== undefined && data.metaTitle.trim()) {
    if (data.metaTitle.length > 255) {
      errors.push("Meta title is too long (max 255 characters)");
    }
  }

  if (data.metaDescription !== undefined && data.metaDescription.trim()) {
    if (data.metaDescription.length > 500) {
      errors.push("Meta description is too long (max 500 characters)");
    }
  }

  if (data.problem !== undefined && data.problem.trim()) {
    if (data.problem.length > 5000) {
      errors.push("Problem description is too long (max 5000 characters)");
    }
  }

  if (data.solution !== undefined && data.solution.trim()) {
    if (data.solution.length > 5000) {
      errors.push("Solution description is too long (max 5000 characters)");
    }
  }

  if (data.outcome !== undefined && data.outcome.trim()) {
    if (data.outcome.length > 5000) {
      errors.push("Outcome description is too long (max 5000 characters)");
    }
  }

  if (data.solutions !== undefined) {
    if (!Array.isArray(data.solutions)) {
      errors.push("Solutions must be an array");
    } else if (!isUpdate && data.solutions.length === 0) {
      errors.push("At least one solution is required");
    }
  }

  if (data.industries !== undefined) {
    if (!Array.isArray(data.industries)) {
      errors.push("Industries must be an array");
    } else if (!isUpdate && data.industries.length === 0) {
      errors.push("At least one industry is required");
    }
  }

  if (data.capabilities !== undefined) {
    if (!Array.isArray(data.capabilities)) {
      errors.push("Capabilities must be an array");
    }
  }

  return errors;
};
