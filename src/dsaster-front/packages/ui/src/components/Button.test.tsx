import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a primary medium button by default", () => {
    render(<Button>Get tickets</Button>);

    const button = screen.getByRole("button", { name: "Get tickets" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("ds-btn", "ds-btn-primary", "ds-btn-md");
  });

  it("applies variant, size, block and extra classes", () => {
    render(
      <Button variant="danger" size="lg" block className="extra">
        Release tickets
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveClass(
      "ds-btn-danger",
      "ds-btn-lg",
      "ds-btn-block",
      "extra",
    );
  });

  it("renders decorative icons and passes attributes through", async () => {
    const onClick = vi.fn();
    render(
      <Button icon="ticket" iconRight="chevron-right" onClick={onClick}>
        Continue
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(2);
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports submit buttons and disabled state", () => {
    render(
      <Button type="submit" disabled>
        Sold out
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Sold out" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });
});
