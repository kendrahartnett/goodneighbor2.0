"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Opportunity } from "@prisma/client";
import Image from "next/image";
import { categories, categoryLabels } from "@/lib/categories";

type FieldErrors = Record<string, string>;

function localDate(value?: Date | null) {
  return value ? value.toISOString().slice(0, 16) : "";
}

export function AdminListingForm({ item }: { item?: Opportunity }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const initial = {
    slug: item?.slug ?? "", title: item?.title ?? "", organizationName: item?.organizationName ?? "",
    summary: item?.summary ?? "", description: item?.description ?? "", neighborhood: item?.neighborhood ?? "",
    addressText: item?.addressText ?? "", phoneNumber: item?.phoneNumber ?? "",
    volunteerPositions: item?.volunteerPositions ?? "",
    organizerUrl: item?.organizerUrl ?? "", sourceUrl: item?.sourceUrl ?? "",
    imageUrl: item?.imageUrl ?? "", imageAlt: item?.imageAlt ?? "",
    verifiedAt: localDate(item?.verifiedAt) || localDate(new Date()), category: item?.category ?? "FOOD_SECURITY",
    dateType: item?.dateType ?? "ONGOING", status: item?.status ?? "DRAFT", startsAt: localDate(item?.startsAt), endsAt: localDate(item?.endsAt),
  };
  const errorFor = (field: string) => fieldErrors[field] && <small className="field-error" role="alert">{fieldErrors[field]}</small>;

  async function save(form: HTMLFormElement) {
    setBusy(true); setMessage(""); setFieldErrors({});
    const formData = new FormData(form);
    const photo = formData.get("photo");
    const removePhoto = formData.get("removePhoto") === "on";
    formData.delete("photo"); formData.delete("removePhoto");
    const values: Record<string, string | null> = Object.fromEntries(formData) as Record<string, string>;
    values.imageUrl = removePhoto ? null : initial.imageUrl || null;
    values.imageAlt = removePhoto ? null : String(values.imageAlt ?? "").trim() || null;
    if (photo instanceof File && photo.size > 0) {
      if (!values.imageAlt) { setFieldErrors({ imageAlt: "Describe the photo for screen readers." }); setMessage("Fix the highlighted fields."); setBusy(false); return; }
      if (photo.size > 3 * 1024 * 1024) { setMessage("Choose a photo smaller than 3 MB."); setBusy(false); return; }
      if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) { setMessage("Choose a JPEG, PNG, or WebP photo."); setBusy(false); return; }
      const upload = new FormData(); upload.set("photo", photo);
      const uploaded = await fetch("/api/admin/photos", { method: "POST", body: upload }).catch(() => null);
      const result = await uploaded?.json().catch(() => ({}));
      if (!uploaded?.ok) { setMessage(result?.error?.message ?? (uploaded ? `Photo upload failed (${uploaded.status}). Please try again.` : "Could not reach the photo upload service. Check your connection and try again.")); setBusy(false); return; }
      values.imageUrl = result.imageUrl;
    }
    const startsAt = String(values.startsAt || ""); const endsAt = String(values.endsAt || "");
    for (const field of ["addressText", "phoneNumber", "volunteerPositions"] as const) {
      if (!String(values[field] ?? "").trim()) values[field] = null;
    }
    const response = await fetch(item ? `/api/opportunities/${item.id}` : "/api/opportunities", {
      method: item ? "PATCH" : "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, startsAt: startsAt ? new Date(startsAt).toISOString() : null, endsAt: endsAt ? new Date(endsAt).toISOString() : null, verifiedAt: new Date(String(values.verifiedAt)).toISOString() }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setMessage(body.error?.message ?? "Unable to save this listing.");
      setFieldErrors(body.error?.fields ?? {});
      setBusy(false); return;
    }
    router.push("/admin"); router.refresh();
  }

  async function remove() {
    if (!item || !window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setBusy(true); setMessage("");
    const response = await fetch(`/api/opportunities/${item.id}`, { method: "DELETE" });
    if (!response.ok) { setMessage("Unable to delete this listing."); setBusy(false); return; }
    router.push("/admin"); router.refresh();
  }

  return <form className="card listing-form" onSubmit={(event) => { event.preventDefault(); void save(event.currentTarget); }}>
    <section className="form-section"><h2>Opportunity basics</h2><p>Give visitors a clear, useful first impression.</p><div className="form-grid">
      <label className="form-label">Listing title <span className="required">Required</span><input required name="title" defaultValue={initial.title} /></label>{errorFor("title")}
      <label className="form-label">Organization <span className="required">Required</span><input required name="organizationName" defaultValue={initial.organizationName} /></label>{errorFor("organizationName")}
      <label className="form-label full">Short summary <span className="required">Required</span><input required name="summary" maxLength={280} defaultValue={initial.summary} /></label>{errorFor("summary")}
      <label className="form-label full">Description <span className="required">Required</span><textarea required name="description" rows={6} defaultValue={initial.description} /></label>{errorFor("description")}
      <label className="form-label">URL slug <span className="required">Required</span><input required name="slug" defaultValue={initial.slug} /></label>{errorFor("slug")}
      <label className="form-label">Category <select name="category" defaultValue={initial.category}>{categories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}</select></label>{errorFor("category")}
    </div></section>
    <section className="form-section"><h2>Location & timing</h2><p>Dates are optional; use the time type to set expectations.</p><div className="form-grid">
      <label className="form-label">Chicago neighborhood or service area <span className="required">Required</span><input required name="neighborhood" defaultValue={initial.neighborhood} /></label>{errorFor("neighborhood")}
      <label className="form-label">Address (optional)<input name="addressText" maxLength={200} defaultValue={initial.addressText} placeholder="Only when the organizer provides one" /></label>{errorFor("addressText")}
      <label className="form-label">Phone (optional)<input type="tel" name="phoneNumber" maxLength={40} defaultValue={initial.phoneNumber} autoComplete="tel" placeholder="Organizer contact number" /></label>{errorFor("phoneNumber")}
      <label className="form-label full">Volunteer positions (optional)<textarea name="volunteerPositions" maxLength={1500} rows={3} defaultValue={initial.volunteerPositions} placeholder="Describe positions confirmed by the organizer" /></label>{errorFor("volunteerPositions")}
      <label className="form-label">Time type <select name="dateType" defaultValue={initial.dateType}><option value="ONGOING">Ongoing</option><option value="DATE_SPECIFIC">Date-specific</option><option value="NEXT_OCCURRENCE">Next occurrence</option></select></label>{errorFor("dateType")}
      <label className="form-label">Start date/time<input type="datetime-local" name="startsAt" defaultValue={initial.startsAt} /></label>{errorFor("startsAt")}
      <label className="form-label">End date/time<input type="datetime-local" name="endsAt" defaultValue={initial.endsAt} /></label>{errorFor("endsAt")}
    </div></section>
    <section className="form-section"><h2>Links & verification</h2><p>Published listings must point to official organizer information and include a verification date.</p><div className="form-grid">
      <label className="form-label full">Listing photo (optional)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" /><small className="form-help">JPEG, PNG, or WebP; up to 3 MB. Upload only photos you may use. Photo uploads require a connected Vercel Blob store; you can save without a photo for now.</small></label>
      {item?.imageUrl && <div className="full current-photo"><p>Current photo</p><Image src={`/api/opportunities/${item.id}/photo`} alt={item.imageAlt ?? "Current listing photo"} width={220} height={150} unoptimized /><label><input type="checkbox" name="removePhoto" /> Remove current photo</label></div>}
      <label className="form-label full">Photo description for screen readers<input name="imageAlt" maxLength={250} defaultValue={initial.imageAlt} placeholder="Describe what the photo shows" /></label>{errorFor("imageAlt")}
      <label className="form-label full">Organizer action URL <span className="required">Required</span><input required type="url" name="organizerUrl" defaultValue={initial.organizerUrl} /></label>{errorFor("organizerUrl")}
      <label className="form-label full">Official source URL <span className="required">Required</span><input required type="url" name="sourceUrl" defaultValue={initial.sourceUrl} /></label>{errorFor("sourceUrl")}
      <label className="form-label">Last verified <span className="required">Required</span><input required type="datetime-local" name="verifiedAt" defaultValue={initial.verifiedAt} /></label>{errorFor("verifiedAt")}
      <label className="form-label">Publication status <select name="status" defaultValue={initial.status}><option value="DRAFT">Draft — admin only</option><option value="PUBLISHED">Published — public</option></select></label>{errorFor("status")}
    </div></section>
    {message && <p className="field-error" role="alert">{message}</p>}
    <div className="form-actions"><button className="button" disabled={busy}>{busy ? "Saving…" : "Save listing"}</button>{item && <button className="delete-button" type="button" disabled={busy} onClick={() => void remove()}>Delete listing</button>}</div>
  </form>;
}
