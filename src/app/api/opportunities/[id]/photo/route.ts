import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { readPhoto } from "@/lib/photos";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const item = await prisma.opportunity.findUnique({ where: { id: (await params).id }, select: { status: true, imageUrl: true } });
  if (!item?.imageUrl) return new Response(null, { status: 404 });
  if (item.status !== "PUBLISHED" && !(await requireAdmin()).ok) return new Response(null, { status: 404 });
  try {
    const result = await readPhoto(item.imageUrl);
    if (result?.statusCode !== 200 || !result.stream) return new Response(null, { status: 404 });
    return new Response(result.stream, { headers: {
      "Content-Type": result.blob.contentType ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": item.status === "PUBLISHED" ? "public, max-age=3600" : "private, no-cache",
    } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
