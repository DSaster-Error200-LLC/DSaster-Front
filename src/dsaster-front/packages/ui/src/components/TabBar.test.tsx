import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TabBar, type TabBarItem } from "./TabBar";

const items: readonly TabBarItem[] = [
  { id: "discover", label: "Discover", icon: "house" },
  { id: "search", label: "Search", icon: "search" },
  { id: "tickets", label: "Tickets", icon: "ticket", badge: 2 },
];

describe("TabBar", () => {
  it("activates the first item by default and switches on click", async () => {
    const onChange = vi.fn();
    render(<TabBar items={items} onChange={onChange} />);

    expect(screen.getByRole("button", { name: /Discover/ })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await userEvent.click(screen.getByRole("button", { name: /Tickets/ }));

    expect(onChange).toHaveBeenCalledWith("tickets");
    expect(screen.getByRole("button", { name: /Tickets/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("2")).toHaveClass("ds-tab-badge");
  });

  it("follows the controlled value", () => {
    render(<TabBar items={items} value="search" label="Principal" />);

    expect(
      screen.getByRole("navigation", { name: "Principal" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/ })).toHaveClass(
      "is-active",
    );
  });
});
