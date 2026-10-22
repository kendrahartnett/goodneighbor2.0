"use client";

import { useRef, useState } from "react";

type FieldErrors = Record<string, string>;

export function SuggestListing() {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(""); setFieldErrors({});
    try {
      const response = await fetch("/api/listing-requests", { method: "POST", body: new FormData(event.currentTarget) });
      const body = await response.json();
      if (!response.ok) {
        setMessage(body.error?.message ?? "We could not receive your request.");
        setFieldErrors(body.error?.fields ?? {});
        return;
      }
      formRef.current?.reset();
      dialogRef.current?.showModal();
      closeRef.current?.focus();
    } catch {
      setMessage("We could not receive your request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function close() { dialogRef.current?.close(); }
  const errorFor = (field: string) => fieldErrors[field] && <small className="field-error" role="alert">{fieldErrors[field]}</small>;

  return <section className="shell section suggest-section" id="suggest" aria-labelledby="suggest-title">
    <div className="suggest-intro"><p className="eyebrow">KNOW A WAY TO HELP?</p><h2 id="suggest-title">Suggest a Chicago opportunity.</h2><p>Tell us about a local volunteer opportunity. We review suggestions against an official organizer source before anything appears in the guide.</p></div>
    <form ref={formRef} className="suggest-form" onSubmit={submit}>
      <div className="form-grid">
        <div className="honeypot-field" aria-hidden="true">
          <label htmlFor="suggest-website">Website</label>
          <input id="suggest-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <label className="form-label">Name <span className="required">Required</span><input name="name" autoComplete="name" required maxLength={120} aria-invalid={!!fieldErrors.name} /></label>{errorFor("name")}
        <label className="form-label">Contact information <span className="required">Required</span><input name="contactInformation" required maxLength={240} placeholder="Phone or preferred contact method" aria-invalid={!!fieldErrors.contactInformation} /></label>{errorFor("contactInformation")}
        <label className="form-label full">Email address <span className="required">Required</span><input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!fieldErrors.email} /></label>{errorFor("email")}
        <label className="form-label full">Opportunity details <span className="required">Required</span><textarea name="description" required minLength={20} maxLength={5000} rows={7} placeholder="Share the organization, location, volunteer work, and official link if you have one." aria-invalid={!!fieldErrors.description} /></label>{errorFor("description")}
      </div>
      {message && <p className="field-error" role="alert">{message}</p>}
      <button ref={triggerRef} className="button" type="submit" disabled={busy}>{busy ? "Sending…" : "Send suggestion"}</button>
      <p className="form-privacy">Your contact information is used only to review and follow up on this listing suggestion. It is not published or shared with volunteer organizations.</p>
    </form>
    <dialog ref={dialogRef} className="success-dialog" aria-labelledby="request-success-title" aria-describedby="request-success-copy" onClose={() => triggerRef.current?.focus()}>
      <div className="dialog-mark" aria-hidden="true">✓</div>
      <h2 id="request-success-title">Request received.</h2>
      <p id="request-success-copy">Thank you for helping us discover more ways to give back in Chicago. We’ll review the details and send you confirmation if the listing is published.</p>
      <button ref={closeRef} className="button" type="button" onClick={close}>Close</button>
    </dialog>
  </section>;
}
