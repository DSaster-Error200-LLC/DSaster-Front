import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventCard } from "./EventCard";

const base = {
  title: "Riot Hymns: Arena Tour 2027",
  month: "Mar",
  day: 12,
  when: "Fri 12 Mar · 20:00",
  venue: "Palau Sant Jordi, Barcelona",
};

describe("EventCard", () => {
  it("shows the facts, the status badge and a formatted from-price", () => {
    render(<EventCard {...base} category="Rock" priceFrom={55} status="low" />);

    expect(screen.getByRole("article")).toHaveTextContent(base.title);
    expect(screen.getByText("Few left")).toBeInTheDocument();
    expect(screen.getByText(base.when)).toBeInTheDocument();
    expect(screen.getByText(base.venue)).toBeInTheDocument();
    expect(screen.getByText("€55.00")).toBeInTheDocument();
    expect(screen.getByText("from")).toBeInTheDocument();
  });

  it("links the title when given an href", () => {
    render(<EventCard {...base} href="/events/42" />);

    expect(screen.getByRole("link", { name: base.title })).toHaveAttribute(
      "href",
      "/events/42",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows a tickets button for onSelect and hides it when sold out", async () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <EventCard {...base} onSelect={onSelect} cta="Entradas" />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Entradas" }));
    expect(onSelect).toHaveBeenCalledOnce();

    rerender(<EventCard {...base} onSelect={onSelect} status="soldout" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveClass("is-soldout");
  });

  it("formats the price per market and accepts translated labels", () => {
    render(
      <EventCard
        {...base}
        priceFrom={45}
        locale="es-ES"
        statusLabel="A la venta"
        fromLabel="desde"
      />,
    );

    expect(screen.getByText("A la venta")).toBeInTheDocument();
    expect(screen.getByText("desde")).toBeInTheDocument();
    expect(screen.getByText(/45,00/)).toBeInTheDocument();
  });
});
