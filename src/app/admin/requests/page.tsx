import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { RequestActions } from "@/components/request-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Listing Requests" };

export default async function ListingRequests({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/admin");
  const archived = (await searchParams).view === "archived";
  const items = await prisma.listingRequest.findMany({ where: { archivedAt: archived ? { not: null } : null }, orderBy: [{ createdAt: "desc" }, { id: "desc" }] });
  return <section className="shell admin-page">
    <Link className="breadcrumb" href="/admin">← Back to dashboard</Link>
    <div className="admin-header"><div><p className="eyebrow">MANAGEMENT</p><h1>Listing Requests</h1><p className="muted">Suggestions are private until you verify and create a listing.</p></div><span className="inbox-count">{items.length} {archived ? "archived" : "active"}</span></div>
    <nav className="request-views" aria-label="Request views"><Link href="/admin/requests" aria-current={!archived ? "page" : undefined}>Active</Link><Link href="/admin/requests?view=archived" aria-current={archived ? "page" : undefined}>Archived</Link></nav>
    {items.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Submitted</th><th>Name</th><th>Contact</th><th>Summary</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}>
      <td data-label="Submitted">{item.createdAt.toLocaleDateString("en-US", { timeZone: "America/Chicago", dateStyle: "medium" })}</td>
      <td data-label="Name"><strong>{item.name}</strong></td>
      <td data-label="Contact"><span>{item.email}</span><br /><span className="card-meta">{item.contactInformation}</span></td>
      <td data-label="Summary"><span className="request-summary">{item.description}</span></td>
      <td data-label="Actions"><div className="request-row-actions"><Link className="table-action" href={`/admin/requests/${item.id}`}>View request</Link><RequestActions id={item.id} archived={archived} /></div></td>
    </tr>)}</tbody></table></div> : <div className="admin-empty"><h2>{archived ? "No archived requests." : "No active listing requests."}</h2><p>{archived ? "Requests you archive will appear here." : "New suggestions from visitors will appear here."}</p></div>}
  </section>;
}
