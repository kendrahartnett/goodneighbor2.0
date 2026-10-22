// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { SuggestListing } from "./suggest-listing";

describe("listing suggestion confirmation", () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); this.focus(); };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); };
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it("includes an inaccessible honeypot and explains how contact details are used", () => {
    render(<SuggestListing />);
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]');
    expect(honeypot?.tabIndex).toBe(-1);
    expect(honeypot?.closest("[aria-hidden='true']")).toBeTruthy();
    expect(screen.getByText(/not published or shared with volunteer organizations/i)).toBeTruthy();
  });

  it("opens a named modal after the request is received and returns focus on close", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: "request-1" }) }));
    render(<SuggestListing />);
    expect(screen.queryByLabelText(/photo/i)).toBeNull();
    fireEvent.submit(screen.getByRole("button", { name: "Send suggestion" }).closest("form")!);
    const dialog = await screen.findByRole("dialog");
    expect(dialog.getAttribute("aria-labelledby")).toBe("request-success-title");
    expect(screen.getByText(/send you confirmation if the listing is published/i)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Send suggestion" })).toBe(document.activeElement));
  });

  it("keeps the form available when the server rejects a field", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { message: "Fix the highlighted fields.", fields: { email: "Enter a valid email address." } } }) }));
    render(<SuggestListing />);
    fireEvent.submit(screen.getByRole("button", { name: "Send suggestion" }).closest("form")!);
    expect(await screen.findByText("Enter a valid email address.")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
