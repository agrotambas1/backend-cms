import { z } from "zod";

const VALID_STATUSES = ["draft", "published", "archived"] as const;
const VALID_LOCATION_TYPES = ["online", "offline", "hybrid"] as const;
const VALID_EVENT_TYPES = ["webinar", "conference", "roundtable"] as const;

const emptyStringToNull = z
  .string()
  .transform((val) => (val === "" ? null : val))
  .nullable()
  .optional();

const eventSchema = z.object({
  eventName: z
    .string()
    .min(1, "Title cannot be empty")
    .max(255, "Title is too long (max 255 characters)")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug cannot be empty")
    .max(255, "Slug is too long (max 255 characters)")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    )
    .optional(),
  excerpt: emptyStringToNull,
  description: z.string().min(1, "Description is required"),
  eventDate: z.coerce.date({ error: "Invalid event date format" }).optional(),
  locationType: z
    .enum(VALID_LOCATION_TYPES, {
      message: `Invalid location type. Must be one of: ${VALID_LOCATION_TYPES.join(", ")}`,
    })
    .optional(),
  location: emptyStringToNull,
  meetingUrl: emptyStringToNull,
  registrationUrl: emptyStringToNull,
  thumbnailId: emptyStringToNull,
  quota: z.number().optional().nullable(),
  status: z
    .enum(VALID_STATUSES, {
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    })
    .optional(),
  eventType: z.enum(VALID_EVENT_TYPES, {
    message: `Invalid event type. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
  }),
  serviceId: z.preprocess(
    (val) => (val === "none" || val === "" ? null : val),
    z.string().uuid("Invalid solution ID").optional().nullable(),
  ),
  industryId: z.preprocess(
    (val) => (val === "none" || val === "" ? null : val),
    z.string().uuid("Invalid industry ID").optional().nullable(),
  ),
});

const requiredFields: (keyof z.infer<typeof eventSchema>)[] = [
  "eventName",
  "slug",
  "eventDate",
  "locationType",
  "status",
];

export const validateEventData = (
  data: {
    eventName?: string;
    slug?: string;
    excerpt?: string;
    description?: string;
    thumbnailId?: string;
    registrationUrl?: string;
    quota?: number;
    eventDate?: string | Date;
    locationType?: string;
    location?: string;
    meetingUrl?: string;
    status?: string;
    eventType?: string;
    serviceId?: string;
    industryId?: string;
  },
  isUpdate = false,
) => {
  const errors: string[] = [];

  if (!isUpdate) {
    if (!data.eventName) errors.push("Title is required");
    if (!data.slug) errors.push("Slug is required");
    if (!data.eventDate) errors.push("Event date is required");
    if (!data.locationType) errors.push("Location type is required");
    if (!data.status) errors.push("Status is required");

    if (errors.length > 0) return errors;
  }

  const result = eventSchema.safeParse(data);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      if (
        !isUpdate &&
        issue.code === "invalid_type" &&
        requiredFields.includes(issue.path[0] as any)
      ) {
        return;
      }
      errors.push(issue.message);
    });
  }

  return errors;
};
