import { describe, expect, it } from "vitest";
import { opportunitySchema } from "./validation";

const valid = {
  slug: "community-garden",
  title: "Community Garden Day",
  organizationName: "Example organizer",
  summary: "Help care for a neighborhood garden.",
  description: "Help care for a neighborhood garden alongside local volunteers.",
  category: "ENVIRONMENT",
  neighborhood: "Chicago",
  dateType: "ONGOING",
  organizerUrl: "https://example.org/volunteer",
  sourceUrl: "https://example.org/volunteer",
  verifiedAt: "2026-10-09T12:00:00.000Z",
};

describe("opportunity validation", () => {
  it("accepts an ongoing draft without invented dates", () => {
    const result = opportunitySchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("DRAFT");
  });

  it("requires a start for a date-specific opportunity", () => {
    expect(opportunitySchema.safeParse({ ...valid, dateType: "DATE_SPECIFIC" }).success).toBe(false);
  });

  it("rejects an end before the start", () => {
    expect(opportunitySchema.safeParse({ ...valid, startsAt: "2026-10-11T12:00:00.000Z", endsAt: "2026-10-10T12:00:00.000Z" }).success).toBe(false);
  });

  it("rejects unsafe organizer URLs and missing image alt text", () => {
    expect(opportunitySchema.safeParse({ ...valid, organizerUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(opportunitySchema.safeParse({ ...valid, imageUrl: "https://example.org/photo.jpg" }).success).toBe(false);
  });

  it.each(["ANIMAL_WELFARE", "SKILLS_BASED_VIRTUAL", "PUBLIC_SAFETY"])(
    "accepts the %s category",
    (category) => expect(opportunitySchema.safeParse({ ...valid, category }).success).toBe(true),
  );

  it("accepts optional address, phone, and volunteer positions", () => {
    expect(opportunitySchema.safeParse({
      ...valid,
      addressText: "123 Example St, Chicago, IL",
      phoneNumber: "+1 (312) 555-0100",
      volunteerPositions: "Garden assistant; outreach volunteer",
    }).success).toBe(true);
  });

  it("rejects an invalid phone number", () => {
    expect(opportunitySchema.safeParse({ ...valid, phoneNumber: "call me" }).success).toBe(false);
  });
});
