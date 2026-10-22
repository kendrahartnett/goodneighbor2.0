import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { requireAdmin, findMany, count, create } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin }));
vi.mock("@/lib/prisma", () => ({ prisma: { opportunity: { findMany, count, create } } }));

import { GET, POST } from "./route";

describe("opportunities collection API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("limits public reads to published listings", async () => {
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);
    const response = await GET(new NextRequest("http://localhost/api/opportunities"));
    expect(response.status).toBe(200);
    expect(findMany.mock.calls[0][0].where.status).toBe("PUBLISHED");
    expect(count.mock.calls[0][0].where.status).toBe("PUBLISHED");
    expect(findMany.mock.calls[0][0].orderBy).toEqual([{ publishedAt: "desc" }, { id: "desc" }]);
  });

  it("includes volunteer positions in public keyword search", async () => {
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);
    await GET(new NextRequest("http://localhost/api/opportunities?q=mentor"));
    const fields = findMany.mock.calls[0][0].where.OR.map((part: Record<string, unknown>) => Object.keys(part)[0]);
    expect(fields).toContain("volunteerPositions");
  });

  it("denies an anonymous create before touching the database", async () => {
    requireAdmin.mockResolvedValue({ ok: false, status: 401 });
    const response = await POST(new Request("http://localhost/api/opportunities", { method: "POST", body: "{}" }));
    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe("UNAUTHENTICATED");
    expect(create).not.toHaveBeenCalled();
  });

  it("returns structured field errors for an invalid admin create", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    const response = await POST(new Request("http://localhost/api/opportunities", { method: "POST", body: "{}" }));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION");
    expect(body.error.fields.title).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
  });

  it("creates a draft with the new optional contact and position fields", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    create.mockImplementation(async ({ data }) => ({ id: "new", ...data }));
    const payload = {
      slug: "garden-helper", title: "Garden Helper", organizationName: "Example organizer",
      summary: "Help care for a local community garden.",
      description: "Help care for a local community garden alongside other volunteers.",
      category: "SKILLS_BASED_VIRTUAL", neighborhood: "Chicago",
      addressText: "123 Example St", phoneNumber: "+1 (312) 555-0100",
      volunteerPositions: "Outreach and volunteer coordination",
      dateType: "ONGOING", organizerUrl: "https://example.org/volunteer",
      sourceUrl: "https://example.org/volunteer", verifiedAt: "2026-10-10T12:00:00.000Z",
    };
    const response = await POST(new Request("http://localhost/api/opportunities", {
      method: "POST", body: JSON.stringify(payload),
    }));
    expect(response.status).toBe(201);
    expect(create.mock.calls[0][0].data).toMatchObject({
      addressText: payload.addressText,
      phoneNumber: payload.phoneNumber,
      volunteerPositions: payload.volunteerPositions,
      category: payload.category,
      status: "DRAFT",
    });
  });
});
