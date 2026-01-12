const VALID_STATUSES = ["draft", "published", "scheduled", "archived"];
const VALID_LOCATION_TYPES = ["online", "offline"];

export const validateEventData = (data: {
  title?: string;
  slug?: string;
  eventStart?: string | Date;
  eventEnd?: string | Date;
  locationType?: string;
  location?: string;
  meetingUrl?: string;
  status?: string;
}) => {
  const errors: string[] = [];

  if (!data.title) errors.push("Title is required");
  if (!data.slug) errors.push("Slug is required");
  if (!data.eventStart) errors.push("Event start date is required");
  if (!data.eventEnd) errors.push("Event end date is required");
  if (!data.locationType) errors.push("Location type is required");
  if (!data.status) errors.push("Status is required");

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (data.locationType && !VALID_LOCATION_TYPES.includes(data.locationType)) {
    errors.push(
      `Invalid location type. Must be one of: ${VALID_LOCATION_TYPES.join(
        ", "
      )}`
    );
  }

  if (data.locationType === "online" && !data.meetingUrl) {
    errors.push("Meeting URL is required for online events");
  }

  if (data.locationType === "offline" && !data.location) {
    errors.push("Location is required for offline events");
  }

  return errors;
};
