import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/listing-card";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { SuggestListing } from "@/components/suggest-listing";
export const dynamic = "force-dynamic";
export default async function Home() {
  const items = await prisma.opportunity.findMany({ where: { status: "PUBLISHED" }, take: 3, orderBy: [{ publishedAt: "desc" }, { id: "desc" }] });
  return <>
    <HeroSlideshow />
    <section className="shell section" aria-labelledby="featured-title">
      <div className="section-heading"><div><p className="eyebrow">YOUR CITY, YOUR WAY</p><h2 id="featured-title">Find something meaningful.</h2><p className="muted">A few ways to give your time to the Chicago communities around you.</p></div><Link className="button-secondary" href="/opportunities">See all opportunities <span aria-hidden="true">↗</span></Link></div>
      <div className="feature-grid">{items.map((item) => <ListingCard key={item.id} item={item} />)}</div>
    </section>
    <section className="shell section" aria-labelledby="how-title"><div className="how-strip"><div><p className="eyebrow">SIMPLE BY DESIGN</p><h2 id="how-title">Good starts here.</h2></div><div className="how-step"><strong>01 · Explore</strong><p>Search by cause, neighborhood, or timing.</p></div><div className="how-step"><strong>02 · Discover</strong><p>Read details and check when the listing was verified.</p></div><div className="how-step"><strong>03 · Connect</strong><p>Continue to the organizer’s official site to take part.</p></div></div></section>
    <section className="shell section" aria-labelledby="verified-title"><div className="trust-note"><div><p className="eyebrow">OUR PROMISE</p><h2 id="verified-title">Checked with care. Made for connection.</h2></div><p>Each opportunity links to an official organizer source and shows when we last checked it. The organizer confirms availability, accessibility, and final logistics.</p></div></section>
    <SuggestListing />
  </>;
}
