import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlobAccessError } from "@vercel/blob";

const { requireAdmin, isPhotoStorageConfigured, uploadPhoto, validatePhoto } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  isPhotoStorageConfigured: vi.fn(),
  uploadPhoto: vi.fn(),
  validatePhoto: vi.fn(),
}));

vi.mock("@/lib/admin", () => ({ requireAdmin }));
vi.mock("@/lib/photos", () => ({ isPhotoStorageConfigured, uploadPhoto, validatePhoto }));

import { POST } from "./route";

function photoRequest() {
  const form = new FormData();
  form.set("photo", new File([new Uint8Array([0xff, 0xd8, 0xff])], "photo.jpg", { type: "image/jpeg" }));
  return new Request("http://localhost/api/admin/photos", { method: "POST", body: form });
}

describe("admin photo upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue({ ok: true });
    validatePhoto.mockResolvedValue(null);
    isPhotoStorageConfigured.mockReturnValue(true);
  });

  it("denies anonymous uploads before touching storage", async () => {
    requireAdmin.mockResolvedValue({ ok: false, status: 401 });
    const response = await POST(photoRequest());
    expect(response.status).toBe(401);
    expect(uploadPhoto).not.toHaveBeenCalled();
  });

  it("explains missing storage configuration", async () => {
    isPhotoStorageConfigured.mockReturnValue(false);
    const response = await POST(photoRequest());
    expect(response.status).toBe(503);
    expect((await response.json()).error.code).toBe("STORAGE_NOT_CONFIGURED");
    expect(uploadPhoto).not.toHaveBeenCalled();
  });

  it("explains when the Blob store is inaccessible", async () => {
    uploadPhoto.mockRejectedValue(new BlobAccessError());
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await POST(photoRequest());
      expect(response.status).toBe(503);
      expect((await response.json()).error.code).toBe("STORAGE_ACCESS");
    } finally {
      spy.mockRestore();
    }
  });
});
