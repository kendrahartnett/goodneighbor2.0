import { del, get, put } from "@vercel/blob";

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isPrivateBlobUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".private.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function isPhotoStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && (process.env.VERCEL_OIDC_TOKEN || process.env.VERCEL === "1")));
}

export async function validatePhoto(file: File): Promise<string | null> {
  if (!extensions[file.type]) return "Use a JPEG, PNG, or WebP photo.";
  if (!file.size || file.size > MAX_PHOTO_BYTES) return "The photo must be smaller than 3 MB.";
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes.length >= 8 && bytes.slice(0, 8).every((byte, index) => byte === [137, 80, 78, 71, 13, 10, 26, 10][index]);
  const webp = bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if ((file.type === "image/jpeg" && jpeg) || (file.type === "image/png" && png) || (file.type === "image/webp" && webp)) return null;
  return "The photo contents do not match its file type.";
}

export async function uploadPhoto(file: File, area: "listings" | "requests") {
  if (!isPhotoStorageConfigured()) throw new Error("Blob storage is not configured");
  const pathname = `${area}/${crypto.randomUUID()}.${extensions[file.type]}`;
  const blob = await put(pathname, file, { access: "private", contentType: file.type });
  return blob.url;
}

export async function readPhoto(url: string) {
  if (!isPrivateBlobUrl(url)) return null;
  return get(url, { access: "private" });
}

export async function deletePrivatePhoto(url: string) {
  if (!isPrivateBlobUrl(url)) return;
  if (!isPhotoStorageConfigured()) throw new Error("Blob storage is not configured");
  await del(url);
}
