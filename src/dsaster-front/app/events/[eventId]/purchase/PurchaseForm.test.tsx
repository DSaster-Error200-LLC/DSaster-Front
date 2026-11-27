import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Event } from "@/api/search";
import PurchaseForm from "@/app/events/[eventId]/purchase/PurchaseForm";
import {
  getSeatAvailability,
  SeatStatus,
  type Seat,
} from "@/app/lib/get-seat-availability";
import type { Buyer } from "@/app/lib/start-checkout";

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
const buyer: Buyer = { fullName: "Ada Lovelace", email: "ada@example.com" };
const seats: Seat[] = [
  {
    ticketId: "ticket-1",
    seatNumber: "A-1",
    status: SeatStatus.Available,
    price: 45,
  },
  {
    ticketId: "ticket-2",
    seatNumber: "A-2",
    status: SeatStatus.Available,
    price: 35,
  },
  {
    ticketId: "ticket-3",
    seatNumber: "A-3",
    status: SeatStatus.Sold,
    price: 60,
  },
];
const getSeats = vi.mocked(getSeatAvailability);

beforeEach(() => {
  getSeats.mockReset().mockResolvedValue({ status: "success", seats });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderForm() {
  const onContinue = vi.fn();
  render(<PurchaseForm event={event} buyer={buyer} onContinue={onContinue} />);
  return { onContinue };
}

async function selectTwoSeats() {
  const user = userEvent.setup();
  await user.click(
    await screen.findByRole("checkbox", { name: /A-1, Disponible/ }),
  );
  await user.click(screen.getByRole("checkbox", { name: /A-2, Disponible/ }));
  return user;
}

describe("seat selection", () => {
  it("lets the buyer pick several available seats without asking for buyer data", async () => {
    renderForm();
    const group = await screen.findByRole("group", {
      name: "Elige tus asientos",
    });

    expect(
      screen.queryByLabelText("Correo electrónico"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Nombre completo")).not.toBeInTheDocument();
    expect(
      within(group).getByRole("checkbox", { name: /A-3, Vendido/ }),
    ).toBeDisabled();

    const user = await selectTwoSeats();

    expect(
      screen.getByRole("checkbox", { name: /A-1, Disponible/ }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /A-2, Disponible/ }),
    ).toBeChecked();
    expect(screen.getByText("2 asientos seleccionados.")).toBeInTheDocument();
    expect(screen.getByText("€80.00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reservar asientos" }),
    ).toBeEnabled();

    await user.click(screen.getByRole("checkbox", { name: /A-2, Disponible/ }));
    expect(
      screen.getByRole("checkbox", { name: /A-2, Disponible/ }),
    ).not.toBeChecked();
    expect(screen.getByText("1 asiento seleccionado")).toBeInTheDocument();
  });

  it("logs the reservation values and shows each seat price plus the total", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const { onContinue } = renderForm();
    const user = await selectTwoSeats();

    await user.click(screen.getByRole("button", { name: "Reservar asientos" }));

    expect(info).toHaveBeenCalledExactlyOnceWith(
      "[reserve-seats] valores que se enviarían:",
      {
        eventId: event.id,
        buyer,
        seats: [
          { ticketId: "ticket-1", seatNumber: "A-1", price: 45 },
          { ticketId: "ticket-2", seatNumber: "A-2", price: 35 },
        ],
        total: 80,
      },
    );

    const summary = within(
      screen.getByRole("region", { name: "Asientos reservados" }),
    );
    expect(summary.getByText("Asiento A-1")).toBeInTheDocument();
    expect(summary.getByText("€45.00")).toBeInTheDocument();
    expect(summary.getByText("Asiento A-2")).toBeInTheDocument();
    expect(summary.getByText("€35.00")).toBeInTheDocument();
    expect(summary.getByText("Total (2 asientos)")).toBeInTheDocument();
    expect(summary.getByText("€80.00")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /A-1, Disponible/ }),
    ).toBeDisabled();

    await user.click(
      summary.getByRole("button", { name: "Continuar al pago" }),
    );
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("lets the buyer repick seats after reserving them", async () => {
    renderForm();
    const user = await selectTwoSeats();
    await user.click(screen.getByRole("button", { name: "Reservar asientos" }));

    await user.click(screen.getByRole("button", { name: "Cambiar asientos" }));

    expect(
      screen.queryByRole("region", { name: "Asientos reservados" }),
    ).not.toBeInTheDocument();
    const first = screen.getByRole("checkbox", { name: /A-1, Disponible/ });
    expect(first).toBeEnabled();
    expect(first).toBeChecked();

    await user.click(first);
    await user.click(screen.getByRole("checkbox", { name: /A-3, Vendido/ }));
    expect(first).not.toBeChecked();
    expect(screen.getByText("1 asiento seleccionado")).toBeInTheDocument();
  });
});
