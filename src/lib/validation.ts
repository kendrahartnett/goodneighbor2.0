import { z } from "zod";
import { categories } from "./categories";

export { categories } from "./categories";
export const dateTypes = ["ONGOING", "DATE_SPECIFIC", "NEXT_OCCURRENCE"] as const;

const url = z.string().url().refine(
  (value) => value.startsWith("https://") || value.startsWith("http://"),
  "Use an http(s) URL",
);
const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();
const phoneNumber = z.string().trim().min(7).max(40).refine(
  (value) => /^[+0-9().\-\s]+(?:\s*(?:x|ext\.?)\s*\d+)?$/i.test(value) && value.replace(/\D/g, "").length >= 7,
  "Enter a valid phone number",
).nullable().optional();

const opportunityFields = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  title: z.string().min(3).max(150),
  organizationName: z.string().min(2).max(150),
  summary: z.string().min(10).max(280),
  description: z.string().min(20).max(5000),
  category: z.enum(categories),
  neighborhood: z.string().min(2).max(160),
  addressText: optionalText(200),
  phoneNumber,
  volunteerPositions: optionalText(1500),
  dateType: z.enum(dateTypes),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
  timeZone: z.literal("America/Chicago").default("America/Chicago"),
  commitmentText: optionalText(500),
  accessibilityText: optionalText(500),
  eligibilityText: optionalText(500),
  imageUrl: url.nullable().optional(),
  imageAlt: optionalText(250),
  organizerUrl: url,
  sourceUrl: url,
  verifiedAt: z.string().datetime(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

function checkOpportunity(
  value: z.infer<typeof opportunityFields>,
  ctx: z.RefinementCtx,
) {
  if (value.dateType === "DATE_SPECIFIC" && !value.startsAt) {
    ctx.addIssue({ code: "custom", path: ["startsAt"], message: "A date-specific listing needs a start time." });
  }
  if (value.endsAt && value.startsAt && new Date(value.endsAt) < new Date(value.startsAt)) {
    ctx.addIssue({ code: "custom", path: ["endsAt"], message: "End time must be after start time." });
  }
  if (value.imageUrl && !value.imageAlt) {
    ctx.addIssue({ code: "custom", path: ["imageAlt"], message: "Image alt text is required when an image is supplied." });
  }
}

export const opportunitySchema = opportunityFields.superRefine(checkOpportunity);
export const opportunityPatchSchema = opportunityFields.partial();

export const listingRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  contactInformation: z.string().trim().min(5, "Enter a way to contact you.").max(240),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  description: z.string().trim().min(20, "Add at least 20 characters of detail.").max(5000),
});

export function errors(error: z.ZodError) {
  return Object.fromEntries(error.issues.map((issue) => [issue.path.join("."), issue.message]));
}
