"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestActions({ id, archived, detail = false }: { id: string; archived: boolean; detail?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function updateArchive() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/listing-requests/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archived: !archived }),
      });
      if (!response.ok) throw new Error("Could not update this request.");
      if (detail) router.push(archived ? "/admin/requests" : "/admin/requests?view=archived");
      router.refresh();
    } catch { setError("Could not update this request. Please try again."); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm("Delete this listing request permanently? This cannot be undone.")) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/listing-requests/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete this request.");
      if (detail) router.push(archived ? "/admin/requests?view=archived" : "/admin/requests");
      router.refresh();
    } catch { setError("Could not delete this request. Please try again."); }
    finally { setBusy(false); }
  }

  return <div className="request-actions">
    <button className="button-quiet" type="button" disabled={busy} onClick={() => void updateArchive()}>{archived ? "Restore" : "Archive"}</button>
    <button className="delete-button" type="button" disabled={busy} onClick={() => void remove()}>Delete</button>
    {error && <span className="field-error" role="alert">{error}</span>}
  </div>;
}
