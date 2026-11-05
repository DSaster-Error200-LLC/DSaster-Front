import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepIndicator } from "./StepIndicator";

describe("StepIndicator", () => {
  it("marks done, current and upcoming steps", () => {
    render(
      <StepIndicator
        steps={["Tickets", "Details", "Payment", "Done"]}
        current={1}
      />,
    );

    const list = screen.getByRole("list", { name: "Checkout progress" });
    const items = within(list).getAllByRole("listitem");

    expect(items[0]).toHaveClass("is-done");
    expect(items[0]).toHaveTextContent("(completed)");
    expect(items[1]).toHaveClass("is-current");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[2]).toHaveClass("is-todo");
    expect(items[2]).toHaveTextContent("3");
  });
});
