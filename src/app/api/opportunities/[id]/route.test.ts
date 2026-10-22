import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAdmin, findUnique, update } = vi.hoisted(() => ({
  requireAdmin: vi.fn(), findUnique: vi.fn(), update: vi.fn(),
}));
vi.mock("@/lib/admin", () => ({ requireAdmin }));
vi.mock("@/lib/prisma", () => ({ prisma: { opportunity: { findUnique, update } } }));

import { PATCH } from "./route";

const current = {
  id: "existing", slug: "garden-helper", title: "Garden Helper",
  organizationName: "Example organizer", summary: "Help care for a local community garden.",
  description: "Help care for a local community garden alongside other volunteers.",
  category: "ENVIRONMENT", neighborhood: "Chicago", addressText: null,
  phoneNumber: null, volunteerPositions: null, dateType: "ONGOING",
  startsAt: null, endsAt: null, timeZone: "America/Chicago",
  commitmentText: null, accessibilityText: null, eligibilityText: null,
  imageUrl: null, imageAlt: null, organizerUrl: "https://example.org/volunteer",
  sourceUrl: "https://example.org/volunteer", verifiedAt: new Date("2026-10-10T12:00:00.000Z"),
  status: "DRAFT", createdAt: new Date(), updatedAt: new Date(),
};
const context = { params: Promise.resolve({ id: "existing" }) };

describe("opportunity item API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findUnique.mockResolvedValue(current);
    update.mockImplementation(async ({ data }) => ({ ...current, ...data }));
  });

  it("rejects an unauthorized update before reading the record", async () => {
    requireAdmin.mockResolvedValue({ ok: false, status: 403 });
    const response = await PATCH(new Request("http://localhost/api/opportunities/existing", {
      method: "PATCH", body: JSON.stringify({ phoneNumber: "+1 (312) 555-0100" }),
    }), context);
    expect(response.status).toBe(403);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("updates contact, positions, and a new category", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    const changes = {
      addressText: "123 Example St", phoneNumber: "+1 (312) 555-0100",
      volunteerPositions: "Garden assistant", category: "ANIMAL_WELFARE",
    };
    const response = await PATCH(new Request("http://localhost/api/opportunities/existing", {
      method: "PATCH", body: JSON.stringify(changes),
    }), context);
    expect(response.status).toBe(200);
    expect(update.mock.calls[0][0].data).toMatchObject(changes);
  });

  it("allows clearing optional contact and position fields", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    const response = await PATCH(new Request("http://localhost/api/opportunities/existing", {
      method: "PATCH", body: JSON.stringify({ addressText: null, phoneNumber: null, volunteerPositions: null }),
    }), context);
    expect(response.status).toBe(200);
    expect(update.mock.calls[0][0].data).toMatchObject({
      addressText: null, phoneNumber: null, volunteerPositions: null,
    });
  });

  it("rejects an invalid cross-field date update", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    const response = await PATCH(new Request("http://localhost/api/opportunities/existing", {
      method: "PATCH", body: JSON.stringify({ dateType: "DATE_SPECIFIC" }),
    }), context);
    expect(response.status).toBe(400);
    expect((await response.json()).error.fields.startsAt).toBeTruthy();
    expect(update).not.toHaveBeenCalled();
  });

  it("records the publication time when a draft becomes public", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    const before = Date.now();
    const response = await PATCH(new Request("http://localhost/api/opportunities/existing", {
      method: "PATCH", body: JSON.stringify({ status: "PUBLISHED" }),
    }), context);
    expect(response.status).toBe(200);
    expect(update.mock.calls[0][0].data.publishedAt.getTime()).toBeGreaterThanOrEqual(before);
  });
});
