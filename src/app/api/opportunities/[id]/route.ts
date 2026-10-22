import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { errors, opportunityPatchSchema, opportunitySchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

async function adminOrPublic(id: string) {
  const admin = await requireAdmin();
  const item = await prisma.opportunity.findUnique({ where: { id } });
  if (!item || (!admin.ok && item.status !== "PUBLISHED")) return null;
  return item;
}

export async function GET(_: Request, { params }: Context) {
  const item = await adminOrPublic((await params).id);
  return item
    ? Response.json(item)
    : Response.json({ error: { code: "NOT_FOUND", message: "Opportunity not found." } }, { status: 404 });
}

export async function PATCH(request: Request, { params }: Context) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return Response.json(
      { error: { code: admin.status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN", message: "Admin access required." } },
      { status: admin.status },
    );
  }

  const parsed = opportunityPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: { code: "VALIDATION", message: "Fix the highlighted fields.", fields: errors(parsed.error) } },
      { status: 400 },
    );
  }

  const id = (await params).id;
  const current = await prisma.opportunity.findUnique({ where: { id } });
  if (!current) {
    return Response.json({ error: { code: "NOT_FOUND", message: "Opportunity not found." } }, { status: 404 });
  }

  const complete = opportunitySchema.safeParse({
    ...current,
    startsAt: current.startsAt?.toISOString() ?? null,
    endsAt: current.endsAt?.toISOString() ?? null,
    verifiedAt: current.verifiedAt.toISOString(),
    ...parsed.data,
  });
  if (!complete.success) {
    return Response.json(
      { error: { code: "VALIDATION", message: "Fix the highlighted fields.", fields: errors(complete.error) } },
      { status: 400 },
    );
  }

  const { startsAt, endsAt, verifiedAt, ...fields } = parsed.data;
  try {
    const item = await prisma.opportunity.update({
      where: { id },
      data: {
        ...fields,
        ...(startsAt !== undefined ? { startsAt: startsAt ? new Date(startsAt) : null } : {}),
        ...(endsAt !== undefined ? { endsAt: endsAt ? new Date(endsAt) : null } : {}),
        ...(verifiedAt !== undefined ? { verifiedAt: new Date(verifiedAt) } : {}),
        ...(fields.status === "PUBLISHED" && current.status !== "PUBLISHED" ? { publishedAt: new Date() } : {}),
        ...(fields.status === "DRAFT" ? { publishedAt: null } : {}),
      },
    });
    return Response.json(item);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return Response.json({ error: { code: "CONFLICT", message: "That slug is already in use." } }, { status: 409 });
    }
    return Response.json({ error: { code: "NOT_FOUND", message: "Opportunity not found." } }, { status: 404 });
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return Response.json(
      { error: { code: admin.status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN", message: "Admin access required." } },
      { status: admin.status },
    );
  }

  try {
    await prisma.opportunity.delete({ where: { id: (await params).id } });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: { code: "NOT_FOUND", message: "Opportunity not found." } }, { status: 404 });
  }
}
