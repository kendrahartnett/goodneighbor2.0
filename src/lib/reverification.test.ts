import { describe, expect, it } from "vitest";
import { reverificationReview } from "./reverification";

describe("six-month Chicago reverification cadence", () => {
  it("marks a listing due on the same calendar day six months later", () => {
    const review = reverificationReview(new Date("2026-10-09T12:00:00Z"), new Date("2027-04-09T12:00:00Z"));
    expect(review.dueAt.toISOString()).toBe("2027-04-09T00:00:00.000Z");
    expect(review.state).toBe("due-soon");
  });

  it("clamps dates at the end of shorter months and marks overdue after the due day", () => {
    const review = reverificationReview(new Date("2026-08-31T17:00:00Z"), new Date("2027-03-01T17:00:00Z"));
    expect(review.dueAt.toISOString()).toBe("2027-02-28T00:00:00.000Z");
    expect(review.state).toBe("overdue");
  });

  it("keeps listings outside the 30-day window current", () => {
    expect(reverificationReview(new Date("2026-10-09T12:00:00Z"), new Date("2027-03-01T12:00:00Z")).state).toBe("current");
  });
});
