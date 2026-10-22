import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAdmin } from "./actions";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { reverificationReview } from "@/lib/reverification";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const admin = await requireAdmin();
  if (!admin.ok && admin.status === 401) redirect("/admin/sign-in");

  if (!admin.ok) {
    return (
      <section className="shell admin-page">
        <div className="admin-notice">
          <p className="eyebrow">MANAGEMENT</p>
          <h1>Admin access unavailable</h1>
          <p role="alert">You are signed in with GitHub, but this account is not authorized to access GoodNeighbor administration. Please sign out and choose the configured admin account.</p>
          <form action={signOutAdmin}>
            <button className="button" type="submit">Sign out and choose another account</button>
          </form>
        </div>
      </section>
    );
  }

  const [items, requestCount] = await Promise.all([
    prisma.opportunity.findMany({ orderBy: [{ updatedAt: "desc" }, { id: "desc" }] }),
    prisma.listingRequest.count({ where: { archivedAt: null } }),
  ]);
  const published = items.filter((item) => item.status === "PUBLISHED").length;
  const reviewStates = items.map((item) => reverificationReview(item.verifiedAt));
  const dueCount = reviewStates.filter((review) => review.state !== "current").length;
  return (
    <section className="shell admin-page">
      <div className="admin-header">
        <div><p className="eyebrow">MANAGEMENT</p><h1>Dashboard</h1><p className="muted">Keep Chicago opportunities accurate and ready to explore.</p></div>
        <div className="admin-actions">
          <Link className="button-secondary" href="/admin/requests">Listing Requests <span className="inbox-pill">{requestCount}</span></Link>
          <Link className="button" href="/admin/listings/new">New opportunity</Link>
          <form action={signOutAdmin}><button className="button-quiet" type="submit">Sign out</button></form>
        </div>
      </div>
      <div className="dashboard-stats">
        <div className="stat-card"><strong>{items.length}</strong><span>Total listings</span></div>
        <div className="stat-card"><strong>{published}</strong><span>Published</span></div>
        <div className="stat-card"><strong>{items.length - published}</strong><span>Drafts</span></div>
      </div>
      <div className="review-notice"><strong>{dueCount ? `${dueCount} listing${dueCount === 1 ? "" : "s"} due for source review` : "No scheduled source reviews due"}</strong><p>Recheck each official organizer source every six months. Update the listing and verification date only after confirming its details; unpublish anything you cannot verify.</p></div>
      <div className="admin-list-heading"><div><h2>Opportunities</h2><p>Review verification dates before publishing.</p></div><span>{items.length} total</span></div>
      {items.length ? <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Opportunity</th><th>Status</th><th>Verified</th><th>Review due</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>{items.map((item, index) => (
            <tr key={item.id}>
              <td data-label="Opportunity"><strong>{item.title}</strong><br /><span className="card-meta">{item.organizationName}</span></td>
              <td data-label="Status"><span className="status-badge" data-status={item.status}>{item.status}</span></td>
              <td data-label="Verified">{item.verifiedAt.toLocaleDateString("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric" })}</td>
              <td data-label="Review due">{reviewStates[index].dueAt.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" })}<br /><span className="review-state" data-state={reviewStates[index].state}>{reviewStates[index].state === "overdue" ? "Overdue" : reviewStates[index].state === "due-soon" ? "Due soon" : "Current"}</span></td>
              <td data-label="Actions"><Link className="table-action" href={`/admin/listings/${item.id}`}>Edit</Link></td>
            </tr>
          ))}</tbody>
        </table>
      </div> : <div className="admin-empty"><h2>No opportunities yet.</h2><p>Create a draft to start the guide.</p><Link className="button" href="/admin/listings/new">Create opportunity</Link></div>}
    </section>
  );
}
