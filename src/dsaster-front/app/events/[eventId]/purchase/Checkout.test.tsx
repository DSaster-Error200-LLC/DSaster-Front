import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Event } from "@/api/search";
import Checkout from "@/app/events/[eventId]/purchase/Checkout";
import { getSeatAvailability } from "@/app/lib/get-seat-availability";
import { startCheckout } from "@/app/lib/start-checkout";

vi.mock("@/app/lib/start-checkout", () => ({ startCheckout: vi.fn() }));
vi.mock("@/app/lib/get-seat-availability", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/app/lib/get-seat-availability")>()),
  getSeatAvailability: vi.fn(),
}));

const event: Event = {
  id: "event-1",
  name: "Evento del backend",
  artist: "Artista del backend",
  date: "2026-10-18T20:30:00Z",
  venue: { name: "Recinto del backend", location: "Ciudad del backend" },
};
const start = vi.mocked(startCheckout);

beforeEach(() => {
  start.mockReset().mockResolvedValue({ status: "success" });
  vi.mocked(getSeatAvailability)
    .mockReset()
    .mockResolvedValue({ status: "success", seats: [] });
});

function currentStep() {
  return screen
    .getByRole("list", { name: "Pasos de compra" })
    .querySelector('[aria-current="step"]');
}

describe("Checkout", () => {
  it("shows every step and starts on buyer details", () => {
    render(<Checkout event={event} />);

    for (const label of ["Datos", "Asientos", "Pago", "Listo"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(currentStep()).toHaveTextContent("Datos");
    expect(
      screen.getByRole("link", { name: "Volver al evento" }),
    ).toHaveAttribute("href", `/events/${event.id}`);
  });

  it("blocks invalid details without calling the API", async () => {
    const user = userEvent.setup();
    render(<Checkout event={event} />);

    await user.type(screen.getByLabelText("Correo electrónico"), "not-email");
    await user.click(screen.getByRole("button", { name: "Iniciar compra" }));

    expect(
      screen.getByText("Introduce tu nombre completo."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Introduce un correo electrónico válido."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).toHaveFocus();
    expect(start).not.toHaveBeenCalled();
    expect(currentStep()).toHaveTextContent("Datos");
  });

  it("sends trimmed details and moves to seats", async () => {
    const user = userEvent.setup();
    render(<Checkout event={event} />);

    await user.type(screen.getByLabelText("Nombre completo"), "  Ada  ");
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "ada@example.com ",
    );
    await user.click(screen.getByRole("button", { name: "Iniciar compra" }));

    expect(
      await screen.findByRole("heading", { name: "Seleccionar Asiento" }),
    ).toBeInTheDocument();
    expect(start).toHaveBeenCalledExactlyOnceWith(event.id, {
      fullName: "Ada",
      email: "ada@example.com",
    });
    expect(currentStep()).toHaveTextContent("Asientos");
  });

  it("stays on details when the API fails", async () => {
    const user = userEvent.setup();
    start.mockResolvedValueOnce({ status: "error" });
    render(<Checkout event={event} />);

    await user.type(screen.getByLabelText("Nombre completo"), "Ada");
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "ada@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Iniciar compra" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo iniciar la compra. Inténtalo de nuevo.",
    );
    expect(currentStep()).toHaveTextContent("Datos");
    expect(
      screen.getByRole("button", { name: "Iniciar compra" }),
    ).toBeEnabled();
  });
});
