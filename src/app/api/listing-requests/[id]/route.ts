import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { deletePrivatePhoto } from "@/lib/photos";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return Response.json({ error: { code: admin.status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN", message: "Admin access required." } }, { status: admin.status });
  const item = await prisma.listingRequest.findUnique({ where: { id: (await params).id } });
  return item
    ? Response.json(item, { headers: { "Cache-Control": "private, no-store" } })
    : Response.json({ error: { code: "NOT_FOUND", message: "Request not found." } }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return Response.json({ error: { code: admin.status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN", message: "Admin access required." } }, { status: admin.status });
  const body = await request.json().catch(() => null);
  if (typeof body?.archived !== "boolean") return Response.json({ error: { code: "VALIDATION", message: "Choose whether to archive this request." } }, { status: 400 });
  const result = await prisma.listingRequest.updateMany({ where: { id: (await params).id }, data: { archivedAt: body.archived ? new Date() : null } });
  return result.count
    ? Response.json({ archived: body.archived }, { headers: { "Cache-Control": "private, no-store" } })
    : Response.json({ error: { code: "NOT_FOUND", message: "Request not found." } }, { status: 404 });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return Response.json({ error: { code: admin.status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN", message: "Admin access required." } }, { status: admin.status });
  const id = (await params).id;
  const item = await prisma.listingRequest.findUnique({ where: { id }, select: { photoUrl: true } });
  if (!item) return Response.json({ error: { code: "NOT_FOUND", message: "Request not found." } }, { status: 404 });
  try {
    if (item.photoUrl) await deletePrivatePhoto(item.photoUrl);
    await prisma.listingRequest.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: { code: "UNAVAILABLE", message: "Could not delete this request. Please try again." } }, { status: 503 });
  }
}
