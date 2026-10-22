import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { readPhoto } from "@/lib/photos";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return new Response(null, { status: admin.status });
  const item = await prisma.listingRequest.findUnique({ where: { id: (await params).id }, select: { photoUrl: true } });
  if (!item?.photoUrl) return new Response(null, { status: 404 });
  try {
    const result = await readPhoto(item.photoUrl);
    if (result?.statusCode !== 200 || !result.stream) return new Response(null, { status: 404 });
    return new Response(result.stream, { headers: {
      "Content-Type": result.blob.contentType ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-cache",
    } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
