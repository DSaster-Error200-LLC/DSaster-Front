import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import Hero from "./components/Hero";

describe("Hero", () => {
  it("renders the main title", () => {
    render(createElement(Hero));

    expect(
      screen.getByRole("heading", {
        name: /tus entradas favoritas, sin dramas ni desastres/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(createElement(Hero));

    expect(
      screen.getByText(
        /descubre los mejores conciertos, festivales, teatro y deportes/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the search input", () => {
    render(createElement(Hero));

    expect(
      screen.getByPlaceholderText("Artista, festival, obra o recinto"),
    ).toBeInTheDocument();
  });

  it("renders the search button", () => {
    render(createElement(Hero));

    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
  });

  it("shows an alert when the search button is clicked", async () => {
    const user = userEvent.setup();
    const alertMock = vi
      .spyOn(window, "alert")
      .mockImplementation(() => undefined);

    render(createElement(Hero));

    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(alertMock).toHaveBeenCalledWith(
      "¡Función de búsqueda por implementar!",
    );

    alertMock.mockRestore();
  });
});
