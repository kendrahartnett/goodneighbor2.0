"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Opportunity } from "@prisma/client";
import { ListingCard } from "@/components/listing-card";
import { categories as listingCategories, categoryLabels } from "@/lib/categories";

const categories = ["ALL", ...listingCategories] as const;
const timeTypes = ["ALL", "ONGOING", "DATE_SPECIFIC", "NEXT_OCCURRENCE"] as const;
const labels: Record<string, string> = { ALL: "All", ...categoryLabels, ONGOING: "Ongoing", DATE_SPECIFIC: "Date specific", NEXT_OCCURRENCE: "Next occurrence" };
const label = (value: string) => labels[value] ?? value.replaceAll("_", " ");

export function OpportunityBrowserV2({ items }: { items: Opportunity[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "ALL");
  const [timeType, setTimeType] = useState(searchParams.get("time") ?? "ALL");
  const filtered = useMemo(() => items.filter((item) => {
    const matchesQuery = `${item.title} ${item.organizationName} ${item.neighborhood} ${item.summary} ${item.volunteerPositions ?? ""}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "ALL" || item.category === category) && (timeType === "ALL" || item.dateType === timeType);
  }), [items, query, category, timeType]);
  function update(nextQuery = query, nextCategory = category, nextTimeType = timeType) {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextCategory !== "ALL") params.set("category", nextCategory);
    if (nextTimeType !== "ALL") params.set("time", nextTimeType);
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  }
  function reset() { setQuery(""); setCategory("ALL"); setTimeType("ALL"); router.replace(pathname, { scroll: false }); }
  return <>
    <div className="filter-panel"><div><label className="field-label" htmlFor="opportunity-search">Search opportunities</label><input id="opportunity-search" value={query} onChange={(event) => { setQuery(event.target.value); update(event.target.value); }} placeholder="Organization, neighborhood, or interest" /></div>
    <fieldset><legend>Category</legend><div className="filter-options">{categories.map((option) => <button className="filter-option" type="button" aria-pressed={category === option} onClick={() => { setCategory(option); update(query, option); }} key={option}>{label(option)}</button>)}</div></fieldset>
    <fieldset><legend>Availability</legend><div className="filter-options">{timeTypes.map((option) => <button className="filter-option" type="button" aria-pressed={timeType === option} onClick={() => { setTimeType(option); update(query, category, option); }} key={option}>{label(option)}</button>)}</div></fieldset></div>
    <div className="result-summary"><p aria-live="polite">{filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}</p><button className="button-quiet" type="button" onClick={reset}>Clear filters</button></div>
    {filtered.length ? <div className="listing-grid">{filtered.map((item) => <ListingCard key={item.id} item={item} />)}</div> : <div className="card"><h2>No opportunities match those filters.</h2><p>Try a broader search, or reset to see all verified Chicago listings.</p><button className="button-quiet" type="button" onClick={reset}>Clear filters</button></div>}
  </>;
}
