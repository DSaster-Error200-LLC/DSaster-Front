import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import Hero from "./components/Hero";

describe("Hero", () => {
  const renderHero = (overrides = {}) =>
    render(
      createElement(Hero, {
        query: "",
        onQueryChange: vi.fn(),
        onSearch: vi.fn(),
        ...overrides,
      }),
    );

  it("renders the main title", () => {
    renderHero();

    expect(
      screen.getByRole("heading", {
        name: /tus entradas favoritas, sin dramas ni desastres/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderHero();

    expect(
      screen.getByText(
        /descubre los mejores conciertos, festivales, teatro y deportes/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the search input", () => {
    renderHero();

    expect(
      screen.getByPlaceholderText("Nombre del evento"),
    ).toBeInTheDocument();
  });

  it("renders the search button", () => {
    renderHero();

    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
  });

  it("notifies when the query changes and submits", () => {
    const onQueryChange = vi.fn();
    const onSearch = vi.fn();

    renderHero({ onQueryChange, onSearch });

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Buscar eventos por nombre" }),
      { target: { value: "Concierto" } },
    );
    fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

    expect(onQueryChange).toHaveBeenCalledWith("Concierto");
    expect(onSearch).toHaveBeenCalledOnce();
  });
});
