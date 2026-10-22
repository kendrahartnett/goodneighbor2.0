import { requireAdmin } from "@/lib/admin";
import { isPhotoStorageConfigured, uploadPhoto, validatePhoto } from "@/lib/photos";
import { BlobAccessError, BlobStoreNotFoundError, BlobStoreSuspendedError } from "@vercel/blob";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return Response.json({ error: { code: admin.status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN", message: "Admin access required." } }, { status: admin.status });
  if (Number(request.headers.get("content-length")) > 3.5 * 1024 * 1024) return Response.json({ error: { code: "VALIDATION", message: "The photo must be smaller than 3 MB." } }, { status: 400 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("photo");
  if (!(file instanceof File)) return Response.json({ error: { code: "VALIDATION", message: "Choose a photo." } }, { status: 400 });
  const problem = await validatePhoto(file);
  if (problem) return Response.json({ error: { code: "VALIDATION", message: problem } }, { status: 400 });
  if (!isPhotoStorageConfigured()) return Response.json({ error: { code: "STORAGE_NOT_CONFIGURED", message: "Photo storage is not configured yet. Save the listing without a photo or connect a private Vercel Blob store." } }, { status: 503 });
  try {
    return Response.json({ imageUrl: await uploadPhoto(file, "listings") }, { status: 201 });
  } catch (error) {
    // Keep credential and provider error details out of the browser response.
    console.error("Listing photo upload failed", { name: error instanceof Error ? error.name : "UnknownError" });
    if (error instanceof BlobAccessError || error instanceof BlobStoreNotFoundError || (error instanceof Error && error.constructor.name === "BlobOidcEnvironmentNotAllowedError")) {
      return Response.json({ error: { code: "STORAGE_ACCESS", message: "Blob credentials or environment access are invalid. Check the private store connection in Vercel and redeploy." } }, { status: 503 });
    }
    if (error instanceof BlobStoreSuspendedError) {
      return Response.json({ error: { code: "STORAGE_SUSPENDED", message: "The private Blob store is suspended. Check its status in Vercel Storage." } }, { status: 503 });
    }
    return Response.json({ error: { code: "STORAGE", message: "Photo storage is unavailable. Check the Vercel function logs, then try again." } }, { status: 503 });
  }
}
