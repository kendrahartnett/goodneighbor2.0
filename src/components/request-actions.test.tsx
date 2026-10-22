// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const { refresh, push } = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh, push }) }));

import { RequestActions } from "./request-actions";

describe("request inbox actions", () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.clearAllMocks(); });

  it("archives through the private route and refreshes the inbox", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetch);
    render(<RequestActions id="request-1" archived={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(fetch.mock.calls[0][0]).toBe("/api/listing-requests/request-1");
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: "PATCH", body: JSON.stringify({ archived: true }) });
  });

  it("does not delete until the admin confirms", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));
    render(<RequestActions id="request-1" archived={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(fetch).not.toHaveBeenCalled();
  });
});
