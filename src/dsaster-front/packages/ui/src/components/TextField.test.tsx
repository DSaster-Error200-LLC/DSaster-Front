import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("links the label and hint to the input", () => {
    render(<TextField label="Promo code" hint="Optional." />);

    const input = screen.getByRole("textbox", { name: "Promo code" });
    expect(input).toHaveAccessibleDescription("Optional.");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("replaces the hint with the error and marks the field invalid", () => {
    render(
      <TextField
        label="Email"
        type="email"
        hint="We send the tickets here."
        error="Enter a full email address"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a full email address");
    expect(
      screen.queryByText("We send the tickets here."),
    ).not.toBeInTheDocument();
  });

  it("forwards the ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField ref={ref} label="Name" />);

    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Name" }));
  });

  it("keeps a caller-provided id and adds the leading icon", () => {
    render(<TextField id="search" label="Search" icon="search" />);

    const input = screen.getByRole("textbox", { name: "Search" });
    expect(input).toHaveAttribute("id", "search");
    expect(input).toHaveClass("has-icon");
  });
});
