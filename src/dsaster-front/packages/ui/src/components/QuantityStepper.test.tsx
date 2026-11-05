import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuantityStepper } from "./QuantityStepper";

describe("QuantityStepper", () => {
  it("steps within min and max when uncontrolled", async () => {
    const onChange = vi.fn();
    render(
      <QuantityStepper
        label="Pit tickets"
        min={1}
        max={2}
        onChange={onChange}
      />,
    );

    const group = screen.getByRole("group", { name: "Pit tickets" });
    const minus = screen.getByRole("button", { name: "Remove one" });
    const plus = screen.getByRole("button", { name: "Add one" });

    expect(group).toHaveTextContent("1");
    expect(minus).toBeDisabled();

    await userEvent.click(plus);
    expect(group).toHaveTextContent("2");
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(plus).toBeDisabled();
  });

  it("reports changes without updating itself when controlled", async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={3} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Add one" }));

    expect(onChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole("group")).toHaveTextContent("3");
  });

  it("accepts translated button labels", () => {
    render(
      <QuantityStepper
        decrementLabel="Quitar una"
        incrementLabel="Añadir una"
      />,
    );

    expect(screen.getByRole("button", { name: "Quitar una" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Añadir una" })).toBeEnabled();
  });
});
