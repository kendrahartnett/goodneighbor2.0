import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { categoryLabels } from "@/lib/categories";
import { ListingPhoto } from "@/components/listing-photo";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = await prisma.opportunity.findFirst({ where: { slug: (await params).slug, status: "PUBLISHED" }, select: { title: true, summary: true } });
  return item ? { title: item.title, description: item.summary } : { title: "Opportunity not found" };
}

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const item = await prisma.opportunity.findFirst({
    where: { slug: (await params).slug, status: "PUBLISHED" },
  });

  if (!item) notFound();

  const date = item.dateType === "ONGOING"
    ? "Ongoing"
    : item.startsAt?.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "long", timeStyle: "short" }) ?? "Contact organizer";

  const facts = [
    ["Organization", item.organizationName], ["When", date], ["Where", item.neighborhood],
    ...(item.addressText ? [["Address", item.addressText]] : []),
    ...(item.phoneNumber ? [["Phone", item.phoneNumber]] : []),
    ...(item.commitmentText ? [["Commitment", item.commitmentText]] : []), ...(item.accessibilityText ? [["Accessibility", item.accessibilityText]] : []), ...(item.eligibilityText ? [["Eligibility", item.eligibilityText]] : []),
  ];
  return <article className="shell detail-page">
    <Link className="breadcrumb" href="/opportunities">← Back to opportunities</Link>
    {item.imageUrl && item.imageAlt && <ListingPhoto id={item.id} url={item.imageUrl} alt={item.imageAlt} variant="detail" />}
    <div className="detail-intro">
      <div className="detail-intro-content">
        <header className="detail-header"><span className="detail-badge">{categoryLabels[item.category]}</span><h1>{item.title}</h1><p className="detail-summary">{item.summary}</p></header>
        <p className="detail-copy">{item.description}</p>
      </div>
    </div>
    <dl className="detail-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {item.volunteerPositions && <section className="detail-copy"><h2>Volunteer positions</h2><p>{item.volunteerPositions}</p></section>}
    <section className="organizer-panel" aria-label="Continue with organizer"><div><p className="eyebrow">READY TO HELP?</p><p>Volunteer sign-up and final logistics are handled by {item.organizationName}.</p><p className="external-note">The link opens the organizer’s site in a new tab.</p></div><a className="button" href={item.organizerUrl} target="_blank" rel="noopener noreferrer">Volunteer with this organization <span aria-hidden="true">↗</span></a></section>
    <p className="verification-note"><strong>Verified:</strong> GoodNeighbor checked <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">the organizer’s official source</a> on {item.verifiedAt.toLocaleDateString("en-US", { timeZone: "America/Chicago", dateStyle: "long" })}. Confirm logistics directly with the organizer.</p>
  </article>;
}
