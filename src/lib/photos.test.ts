import { describe, expect, it } from "vitest";
import { validatePhoto, isPrivateBlobUrl } from "./photos";

describe("photo validation", () => {
  it("accepts a small JPEG matching its declared type", async () => {
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff, 0x00])], "photo.jpg", { type: "image/jpeg" });
    expect(await validatePhoto(file)).toBeNull();
  });

  it("rejects mismatched, unsupported, and oversized files", async () => {
    expect(await validatePhoto(new File(["text"], "fake.png", { type: "image/png" }))).toMatch(/contents/);
    expect(await validatePhoto(new File(["<svg/>"], "image.svg", { type: "image/svg+xml" }))).toMatch(/JPEG/);
    expect(await validatePhoto(new File([new Uint8Array(3 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" }))).toMatch(/3 MB/);
  });

  it("recognizes only private Vercel Blob hosts", () => {
    expect(isPrivateBlobUrl("https://store.private.blob.vercel-storage.com/listings/one.jpg")).toBe(true);
    expect(isPrivateBlobUrl("https://store.private.blob.vercel-storage.com.evil.test/one.jpg")).toBe(false);
  });
});
