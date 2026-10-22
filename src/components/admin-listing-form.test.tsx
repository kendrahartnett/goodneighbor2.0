// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));

import { AdminListingForm } from "./admin-listing-form";

describe("new opportunity form", () => {
  afterEach(cleanup);

  it("offers the approved optional photo controls during creation", () => {
    render(<AdminListingForm />);
    expect(screen.getByLabelText(/listing photo/i)).toBeTruthy();
    expect(screen.getByLabelText(/photo description/i)).toBeTruthy();
    expect(document.querySelector('input[type="file"]')).toBeTruthy();
  });
});
