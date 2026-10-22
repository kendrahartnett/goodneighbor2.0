import Link from "next/link";
import type { Opportunity } from "@prisma/client";
import { categoryLabels } from "@/lib/categories";
import { ListingPhoto } from "@/components/listing-photo";

export function ListingCard({ item }: { item: Opportunity }) {
  return <article className="card">
    {item.imageUrl && item.imageAlt && <ListingPhoto id={item.id} url={item.imageUrl} alt={item.imageAlt} />}
    <span className="category-chip">{categoryLabels[item.category]}</span>
    <h2><Link href={`/opportunities/${item.slug}`}>{item.title}</Link></h2>
    <p className="card-organization">{item.organizationName}</p>
    <p className="card-summary">{item.summary}</p>
    <div className="card-bottom"><span className="card-location">{item.neighborhood} · {item.dateType === "ONGOING" ? "Ongoing" : item.dateType === "DATE_SPECIFIC" ? "Date specific" : "Next occurrence"}</span><span className="card-verified">Verified {item.verifiedAt.toLocaleDateString("en-US", { timeZone: "America/Chicago", month: "short", day: "numeric", year: "numeric" })}</span><span className="card-action" aria-hidden="true">View details ↗</span></div>
  </article>;
}
