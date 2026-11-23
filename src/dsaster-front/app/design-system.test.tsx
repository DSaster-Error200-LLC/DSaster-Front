import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, Button, formatMoney, Wordmark } from "@dsaster/ui";

// Smoke test: the app resolves the design-system workspace package.
describe("@dsaster/ui from the app", () => {
  it("renders components from the package", () => {
    render(
      <>
        <Wordmark size="sm" />
        <Badge tone="success" icon="check">
          On sale
        </Badge>
        <Button>Pay {formatMoney(110)}</Button>
      </>,
    );

    expect(screen.getByText("Ticket DSaster")).toHaveClass("ds-wordmark-sm");
    expect(screen.getByText("On sale")).toHaveClass("ds-badge-success");
    expect(
      screen.getByRole("button", { name: "Pay €110.00" }),
    ).toBeInTheDocument();
  });
});
