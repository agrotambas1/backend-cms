"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventData = void 0;
const zod_1 = require("zod");
const VALID_STATUSES = ["draft", "published", "archived"];
const VALID_LOCATION_TYPES = ["online", "offline", "hybrid"];
const VALID_EVENT_TYPES = ["webinar", "conference", "roundtable"];
const emptyStringToNull = zod_1.z
    .string()
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional();
const eventSchema = zod_1.z.object({
    eventName: zod_1.z
        .string()
        .min(1, "Title cannot be empty")
        .max(255, "Title is too long (max 255 characters)")
        .optional(),
    slug: zod_1.z
        .string()
        .min(1, "Slug cannot be empty")
        .max(255, "Slug is too long (max 255 characters)")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
        .optional(),
    excerpt: emptyStringToNull,
    description: zod_1.z.string().min(1, "Description is required"),
    eventDate: zod_1.z.coerce.date({ error: "Invalid event date format" }).optional(),
    locationType: zod_1.z
        .enum(VALID_LOCATION_TYPES, {
        message: `Invalid location type. Must be one of: ${VALID_LOCATION_TYPES.join(", ")}`,
    })
        .optional(),
    location: emptyStringToNull,
    meetingUrl: emptyStringToNull,
    registrationUrl: emptyStringToNull,
    thumbnailId: emptyStringToNull,
    quota: zod_1.z.number().optional().nullable(),
    status: zod_1.z
        .enum(VALID_STATUSES, {
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
    })
        .optional(),
    eventType: zod_1.z.enum(VALID_EVENT_TYPES, {
        message: `Invalid event type. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
    }),
    serviceId: zod_1.z.preprocess((val) => (val === "none" || val === "" ? null : val), zod_1.z.string().uuid("Invalid solution ID").optional().nullable()),
    industryId: zod_1.z.preprocess((val) => (val === "none" || val === "" ? null : val), zod_1.z.string().uuid("Invalid industry ID").optional().nullable()),
});
const requiredFields = [
    "eventName",
    "slug",
    "eventDate",
    "locationType",
    "status",
];
const validateEventData = (data, isUpdate = false) => {
    const errors = [];
    if (!isUpdate) {
        if (!data.eventName)
            errors.push("Title is required");
        if (!data.slug)
            errors.push("Slug is required");
        if (!data.eventDate)
            errors.push("Event date is required");
        if (!data.locationType)
            errors.push("Location type is required");
        if (!data.status)
            errors.push("Status is required");
        if (errors.length > 0)
            return errors;
    }
    const result = eventSchema.safeParse(data);
    if (!result.success) {
        result.error.issues.forEach((issue) => {
            if (!isUpdate &&
                issue.code === "invalid_type" &&
                requiredFields.includes(issue.path[0])) {
                return;
            }
            errors.push(issue.message);
        });
    }
    return errors;
};
exports.validateEventData = validateEventData;
//# sourceMappingURL=eventValidator.js.map