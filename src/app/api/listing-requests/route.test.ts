import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAdmin, findMany, create } = vi.hoisted(() => ({
  requireAdmin: vi.fn(), findMany: vi.fn(), create: vi.fn(),
}));
vi.mock("@/lib/admin", () => ({ requireAdmin }));
vi.mock("@/lib/prisma", () => ({ prisma: { listingRequest: { findMany, create } } }));

import { GET, POST } from "./route";

function request(fields: Record<string, string> = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: "Taylor Neighbor", contactInformation: "Call me at 312-555-0100",
    email: "taylor@example.org", description: "A Chicago neighborhood garden needs helpers on Saturdays.", ...fields,
  })) form.set(key, value);
  return new Request("http://localhost/api/listing-requests", { method: "POST", body: form });
}

describe("listing request API", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("accepts a valid public suggestion without a photo", async () => {
    create.mockImplementation(async ({ data }) => ({ id: "request-1", ...data }));
    const response = await POST(request());
    expect(response.status).toBe(201);
    expect(create.mock.calls[0][0].data).toMatchObject({ email: "taylor@example.org", photoUrl: null });
  });

  it("silently discards submissions that fill the honeypot", async () => {
    const response = await POST(request({ website: "https://spam.example" }));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ id: "received" });
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects public photo attachments without saving the request", async () => {
    const form = await request().formData();
    form.set("photo", new File([new Uint8Array([0xff, 0xd8, 0xff])], "photo.jpg", { type: "image/jpeg" }));
    const response = await POST(new Request("http://localhost/api/listing-requests", { method: "POST", body: form }));
    expect(response.status).toBe(400);
    expect((await response.json()).error.message).toMatch(/not accepted/);
    expect(create).not.toHaveBeenCalled();
  });

  it("returns structured validation errors without storing invalid content", async () => {
    const response = await POST(request({ email: "not-email", description: "short" }));
    expect(response.status).toBe(400);
    expect((await response.json()).error.fields.email).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
  });

  it("denies anonymous inbox access before querying", async () => {
    requireAdmin.mockResolvedValue({ ok: false, status: 401 });
    const response = await GET(new Request("http://localhost/api/listing-requests"));
    expect(response.status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();
  });

  it("shows the allowlisted admin requests newest first", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    findMany.mockResolvedValue([{ id: "new" }, { id: "old" }]);
    const response = await GET(new Request("http://localhost/api/listing-requests"));
    expect(response.status).toBe(200);
    expect(findMany.mock.calls[0][0].where).toEqual({ archivedAt: null });
    expect(findMany.mock.calls[0][0].orderBy).toEqual([{ createdAt: "desc" }, { id: "desc" }]);
    expect((await response.json()).items.map((item: { id: string }) => item.id)).toEqual(["new", "old"]);
  });

  it("shows archived requests only when the admin selects that view", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    findMany.mockResolvedValue([{ id: "archived" }]);
    const response = await GET(new Request("http://localhost/api/listing-requests?view=archived"));
    expect(response.status).toBe(200);
    expect(findMany.mock.calls[0][0].where).toEqual({ archivedAt: { not: null } });
  });
});
