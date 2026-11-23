import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceRow } from "./PriceRow";

describe("PriceRow", () => {
  it("prefixes the quantity and formats the amount", () => {
    render(<PriceRow label="General admission" amount={45} quantity={2} />);

    expect(screen.getByText("2 × General admission")).toBeInTheDocument();
    expect(screen.getByText("€45.00")).toBeInTheDocument();
  });

  it("shows discounts as a negative amount and strikes the old price", () => {
    render(
      <PriceRow label="Early bird" amount={10} was={65} kind="discount" />,
    );

    expect(screen.getByText("−€10.00")).toBeInTheDocument();
    expect(screen.getByText("€65.00").tagName).toBe("S");
  });

  it("shows a free label instead of an amount", () => {
    render(<PriceRow label="Delivery" amount={0} free freeLabel="Gratis" />);

    expect(screen.getByText("Gratis")).toBeInTheDocument();
  });

  it("marks the total row", () => {
    const { container } = render(
      <PriceRow label="Total" amount={110} kind="total" />,
    );

    expect(container.firstChild).toHaveClass("ds-price-total");
  });
});
