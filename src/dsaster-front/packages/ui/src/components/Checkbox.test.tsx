import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("labels the input and toggles it", async () => {
    const onChange = vi.fn();
    render(
      <Checkbox
        label="Add ticket insurance"
        description="€2.50 per ticket"
        onChange={onChange}
      />,
    );

    // The label wraps the description too, so it is part of the accessible name.
    const box = screen.getByRole("checkbox", { name: /Add ticket insurance/ });
    expect(screen.getByText("€2.50 per ticket")).toBeInTheDocument();

    await userEvent.click(box);

    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("marks the whole control disabled", () => {
    const { container } = render(<Checkbox label="Members only" disabled />);

    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(container.firstChild).toHaveClass("is-disabled");
  });
});
