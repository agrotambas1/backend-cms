// const VALID_STATUSES = ["draft", "published", "scheduled", "archived"];
// const VALID_LOCATION_TYPES = ["online", "offline"];

// export const validateEventData = (data: {
//   title?: string;
//   slug?: string;
//   eventStart?: string | Date;
//   eventEnd?: string | Date;
//   locationType?: string;
//   location?: string;
//   meetingUrl?: string;
//   status?: string;
// }) => {
//   const errors: string[] = [];

//   if (!data.title) errors.push("Title is required");
//   if (!data.slug) errors.push("Slug is required");
//   if (!data.eventStart) errors.push("Event start date is required");
//   if (!data.eventEnd) errors.push("Event end date is required");
//   if (!data.locationType) errors.push("Location type is required");
//   if (!data.status) errors.push("Status is required");

//   if (data.status && !VALID_STATUSES.includes(data.status)) {
//     errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
//   }

//   if (data.locationType && !VALID_LOCATION_TYPES.includes(data.locationType)) {
//     errors.push(
//       `Invalid location type. Must be one of: ${VALID_LOCATION_TYPES.join(
//         ", "
//       )}`
//     );
//   }

//   if (data.locationType === "online" && !data.meetingUrl) {
//     errors.push("Meeting URL is required for online events");
//   }

//   if (data.locationType === "offline" && !data.location) {
//     errors.push("Location is required for offline events");
//   }

//   return errors;
// };

const VALID_STATUSES = ["draft", "published", "scheduled", "archived"];
const VALID_LOCATION_TYPES = ["online", "offline", "hybrid"];
const VALID_EVENT_TYPES = ["webinar", "conference", "roundtable"];

export const validateEventData = (
  data: {
    title?: string;
    slug?: string;
    eventStart?: string | Date;
    eventEnd?: string | Date;
    locationType?: string;
    location?: string;
    meetingUrl?: string;
    status?: string;
    eventType?: string;
    solutions?: any;
  },
  isUpdate = false,
) => {
  const errors: string[] = [];

  if (!isUpdate) {
    if (!data.title) errors.push("Title is required");
    if (!data.slug) errors.push("Slug is required");
    if (!data.eventStart) errors.push("Event start date is required");
    if (!data.eventEnd) errors.push("Event end date is required");
    if (!data.locationType) errors.push("Location type is required");
    if (!data.status) errors.push("Status is required");
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

  if (data.locationType && !VALID_LOCATION_TYPES.includes(data.locationType)) {
    errors.push(
      `Invalid location type. Must be one of: ${VALID_LOCATION_TYPES.join(", ")}`,
    );
  }

  if (data.eventType && !VALID_EVENT_TYPES.includes(data.eventType)) {
    errors.push(
      `Invalid event type. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
    );
  }

  if (
    (data.locationType === "online" || data.locationType === "hybrid") &&
    !data.meetingUrl
  ) {
    errors.push("Meeting URL is required for online/hybrid events");
  }

  if (data.locationType === "offline" && !data.location) {
    errors.push("Location is required for offline events");
  }

  if (data.eventStart && data.eventEnd) {
    const startDate = new Date(data.eventStart);
    const endDate = new Date(data.eventEnd);

    if (isNaN(startDate.getTime())) {
      errors.push("Invalid event start date format");
    }

    if (isNaN(endDate.getTime())) {
      errors.push("Invalid event end date format");
    }

    if (startDate >= endDate) {
      errors.push("Event end date must be after start date");
    }
  }

  if (data.solutions !== undefined) {
    if (!Array.isArray(data.solutions)) {
      errors.push("Solutions must be an array");
    }
  }

  return errors;
};
