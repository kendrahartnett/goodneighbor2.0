import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireAdmin, findUnique, updateMany, remove, deletePrivatePhoto } = vi.hoisted(() => ({ requireAdmin: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn(), remove: vi.fn(), deletePrivatePhoto: vi.fn() }));
vi.mock("@/lib/admin", () => ({ requireAdmin }));
vi.mock("@/lib/prisma", () => ({ prisma: { listingRequest: { findUnique, updateMany, delete: remove } } }));
vi.mock("@/lib/photos", () => ({ deletePrivatePhoto }));

import { GET, PATCH, DELETE } from "./route";
const context = { params: Promise.resolve({ id: "id" }) };

describe("private listing request detail", () => {
  beforeEach(() => vi.clearAllMocks());
  it("denies a signed-in non-admin before reading data", async () => {
    requireAdmin.mockResolvedValue({ ok: false, status: 403 });
    const response = await GET(new Request("http://localhost/api/listing-requests/id"), { params: Promise.resolve({ id: "id" }) });
    expect(response.status).toBe(403);
    expect(findUnique).not.toHaveBeenCalled();
  });
  it("returns the request to the allowlisted admin", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    findUnique.mockResolvedValue({ id: "id", name: "Taylor" });
    const response = await GET(new Request("http://localhost/api/listing-requests/id"), { params: Promise.resolve({ id: "id" }) });
    expect(response.status).toBe(200);
    expect((await response.json()).name).toBe("Taylor");
  });
  it("denies anonymous archive and delete before touching data", async () => {
    requireAdmin.mockResolvedValue({ ok: false, status: 401 });
    const archive = await PATCH(new Request("http://localhost/api/listing-requests/id", { method: "PATCH", body: JSON.stringify({ archived: true }) }), context);
    const deleteResponse = await DELETE(new Request("http://localhost/api/listing-requests/id", { method: "DELETE" }), context);
    expect(archive.status).toBe(401);
    expect(deleteResponse.status).toBe(401);
    expect(updateMany).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
  it("requires a boolean archive value", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    const response = await PATCH(new Request("http://localhost/api/listing-requests/id", { method: "PATCH", body: JSON.stringify({ archived: "yes" }) }), context);
    expect(response.status).toBe(400);
    expect(updateMany).not.toHaveBeenCalled();
  });
  it("archives and restores only the selected request", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    updateMany.mockResolvedValue({ count: 1 });
    const archive = await PATCH(new Request("http://localhost/api/listing-requests/id", { method: "PATCH", body: JSON.stringify({ archived: true }) }), context);
    const restore = await PATCH(new Request("http://localhost/api/listing-requests/id", { method: "PATCH", body: JSON.stringify({ archived: false }) }), context);
    expect(archive.status).toBe(200);
    expect(restore.status).toBe(200);
    expect(updateMany.mock.calls[0][0].where).toEqual({ id: "id" });
    expect(updateMany.mock.calls[0][0].data.archivedAt).toBeInstanceOf(Date);
    expect(updateMany.mock.calls[1][0].data.archivedAt).toBeNull();
  });
  it("deletes the selected request and reports missing records", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    findUnique.mockResolvedValueOnce({ photoUrl: null }).mockResolvedValueOnce(null);
    remove.mockResolvedValue({ id: "id" });
    expect((await DELETE(new Request("http://localhost/api/listing-requests/id", { method: "DELETE" }), context)).status).toBe(204);
    expect((await DELETE(new Request("http://localhost/api/listing-requests/id", { method: "DELETE" }), context)).status).toBe(404);
    expect(remove.mock.calls[0][0].where).toEqual({ id: "id" });
  });
  it("keeps historical requests if their private photo cannot be removed", async () => {
    requireAdmin.mockResolvedValue({ ok: true });
    findUnique.mockResolvedValue({ photoUrl: "https://example.private.blob.vercel-storage.com/photo" });
    deletePrivatePhoto.mockRejectedValue(new Error("Unavailable"));
    const response = await DELETE(new Request("http://localhost/api/listing-requests/id", { method: "DELETE" }), context);
    expect(response.status).toBe(503);
    expect(remove).not.toHaveBeenCalled();
  });
});
