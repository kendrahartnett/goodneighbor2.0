import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { Opportunity } from "@prisma/client";
import { ListingCard } from "./listing-card";

const base = {
  id: "listing-1", slug: "garden", title: "Garden helpers", organizationName: "Chicago Garden",
  summary: "Help care for a neighborhood garden.", category: "ENVIRONMENT", neighborhood: "Chicago",
  dateType: "ONGOING", verifiedAt: new Date("2026-10-12T12:00:00Z"), imageUrl: null, imageAlt: null,
} as Opportunity;

describe("listing photo layout", () => {
  it("has no empty media box when a listing has no photo", () => {
    const html = renderToStaticMarkup(<ListingCard item={base} />);
    expect(html).toContain("Garden helpers");
    expect(html).not.toContain("listing-photo");
  });

  it("shows an uploaded photo with meaningful alt text", () => {
    const html = renderToStaticMarkup(<ListingCard item={{ ...base, imageUrl: "https://store.private.blob.vercel-storage.com/listings/a.jpg", imageAlt: "Neighbors planting seedlings" }} />);
    expect(html).toContain("listing-photo-card");
    expect(html).toContain("Neighbors planting seedlings");
    expect(html).toContain("%2Fapi%2Fopportunities%2Flisting-1%2Fphoto");
  });
});
