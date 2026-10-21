import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PurchaseForm from "@/app/events/[eventId]/purchase/PurchaseForm";
import {
  getSeatAvailability,
  SeatStatus,
  type GetSeatAvailabilityResult,
  type Seat,
} from "@/app/lib/get-seat-availability";
import { reserveSeat, type ReserveSeatResult } from "@/app/lib/reserve-seat";

vi.mock("@/app/lib/reserve-seat", () => ({ reserveSeat: vi.fn() }));
vi.mock("@/app/lib/get-seat-availability", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/app/lib/get-seat-availability")>()),
  getSeatAvailability: vi.fn(),
}));

const seats: Seat[] = [
  { ticketId: "ticket-1", seatNumber: "A-1", status: SeatStatus.Available },
  { ticketId: "ticket-2", seatNumber: "A-2", status: SeatStatus.Available },
  { ticketId: "ticket-3", seatNumber: "A-3", status: SeatStatus.Sold },
];
const getSeats = vi.mocked(getSeatAvailability);
const reserve = vi.mocked(reserveSeat);
const showAlert = vi.fn();

beforeEach(() => {
  getSeats.mockReset().mockResolvedValue({ status: "success", seats });
  reserve.mockReset();
  showAlert.mockReset();
  vi.spyOn(window, "alert").mockImplementation(showAlert);
});

afterEach(() => vi.restoreAllMocks());

async function fillReservation() {
  const user = userEvent.setup();
  render(<PurchaseForm eventId="event-1" />);
  await user.click(
    await screen.findByRole("radio", { name: "A-1, Disponible" }),
  );
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "ada@example.com",
  );
  return user;
}

describe("seat reservation", () => {
  it("requires an available seat and a valid email before enabling submission", async () => {
    const user = userEvent.setup();
    render(<PurchaseForm eventId="event-1" />);
    const email = screen.getByLabelText("Correo electrónico");
    const button = screen.getByRole("button", { name: "Seleccionar Asiento" });
    const form = screen.getByRole("form");

    expect(screen.queryByLabelText("Nombre completo")).not.toBeInTheDocument();
    expect(email).toHaveAttribute("maxlength", "254");
    expect(button).toBeDisabled();
    await user.type(email, "ada@example.com");
    expect(button).toBeDisabled();
    fireEvent.submit(form);
    expect(reserve).not.toHaveBeenCalled();

    await user.click(
      await screen.findByRole("radio", { name: "A-1, Disponible" }),
    );
    expect(button).toBeEnabled();
    expect(screen.getByRole("radio", { name: "A-3, Vendido" })).toBeDisabled();

    for (const value of [
      "",
      "   ",
      "invalid",
      `${"a".repeat(250)}@example.com`,
    ]) {
      fireEvent.change(email, { target: { value } });
      expect(button).toBeDisabled();
      fireEvent.submit(form);
      expect(reserve).not.toHaveBeenCalled();
    }
  });

  it("locks pending requests, prevents duplicate submission, and alerts the returned ticket ID", async () => {
    const pending = Promise.withResolvers<ReserveSeatResult>();
    reserve.mockReturnValueOnce(pending.promise);
    const user = await fillReservation();
    const email = screen.getByLabelText("Correo electrónico");
    fireEvent.change(email, { target: { value: " ada@example.com " } });

    await user.click(
      screen.getByRole("button", { name: "Seleccionar Asiento" }),
    );
    const pendingButton = screen.getByRole("button", { name: "Reservando…" });
    expect(pendingButton).toBeDisabled();
    expect(email).toBeDisabled();
    expect(screen.getByRole("form")).toHaveAttribute("aria-busy", "true");
    for (const seat of screen.getAllByRole("radio"))
      expect(seat).toBeDisabled();
    fireEvent.submit(screen.getByRole("form"));
    await user.click(pendingButton);
    expect(reserve).toHaveBeenCalledExactlyOnceWith(
      "event-1",
      "ticket-1",
      "ada@example.com",
    );
    expect(showAlert).not.toHaveBeenCalled();

    await act(async () => {
      pending.resolve({ status: "success", ticketId: "response-ticket-id" });
      await pending.promise;
    });

    expect(showAlert).toHaveBeenCalledExactlyOnceWith(
      "Asiento reservado. Ticket ID: response-ticket-id",
    );
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Seleccionar Asiento" }),
    ).toBeDisabled();
    fireEvent.submit(screen.getByRole("form"));
    expect(reserve).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText("Tu compra se ha completado."),
    ).not.toBeInTheDocument();
  });

  it("shows a generic error below the button and allows a manual retry", async () => {
    reserve
      .mockResolvedValueOnce({ status: "error" })
      .mockResolvedValueOnce({ status: "success", ticketId: "ticket-1" });
    const user = await fillReservation();
    const button = screen.getByRole("button", { name: "Seleccionar Asiento" });
    await user.click(button);

    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent(
      "No se pudo reservar el asiento. Inténtalo de nuevo.",
    );
    expect(button.nextElementSibling).toBe(error);
    expect(button).toBeEnabled();
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue(
      "ada@example.com",
    );
    expect(
      screen.getByRole("radio", { name: "A-1, Disponible" }),
    ).toBeChecked();
    expect(reserve).toHaveBeenCalledTimes(1);
    expect(getSeats).toHaveBeenCalledTimes(1);

    await user.click(button);
    expect(reserve).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears selection on conflict and refreshes the entire seat list while preserving email", async () => {
    const refresh = Promise.withResolvers<GetSeatAvailabilityResult>();
    getSeats
      .mockResolvedValueOnce({ status: "success", seats })
      .mockReturnValueOnce(refresh.promise);
    reserve.mockResolvedValueOnce({ status: "conflict" });
    const user = await fillReservation();
    const button = screen.getByRole("button", { name: "Seleccionar Asiento" });
    await user.click(button);

    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent(
      "El asiento fue ocupado mientras hacías tu selección. Elige otro asiento.",
    );
    expect(button.nextElementSibling).toBe(error);
    expect(screen.getByText("Cargando asientos…")).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue(
      "ada@example.com",
    );
    expect(getSeats).toHaveBeenCalledTimes(2);
    expect(getSeats).toHaveBeenLastCalledWith(
      "event-1",
      expect.any(AbortSignal),
    );

    await act(async () => {
      refresh.resolve({
        status: "success",
        seats: [
          { ...seats[0], status: SeatStatus.Reserved },
          { ...seats[1], status: SeatStatus.Sold },
          { ...seats[2], status: SeatStatus.Available },
        ],
      });
      await refresh.promise;
    });

    expect(
      screen.getByRole("radio", { name: "A-1, Reservado" }),
    ).toBeDisabled();
    expect(screen.getByRole("radio", { name: "A-2, Vendido" })).toBeDisabled();
    for (const seat of screen.getAllByRole("radio"))
      expect(seat).not.toBeChecked();
    expect(button).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: "A-3, Disponible" }));
    expect(button).toBeEnabled();
    expect(reserve).toHaveBeenCalledTimes(1);
  });

  it("keeps submission disabled when conflict refresh fails and supports manual availability retry", async () => {
    getSeats
      .mockResolvedValueOnce({ status: "success", seats })
      .mockResolvedValueOnce({ status: "error" })
      .mockResolvedValueOnce({ status: "success", seats });
    reserve.mockResolvedValueOnce({ status: "conflict" });
    const user = await fillReservation();
    const button = screen.getByRole("button", { name: "Seleccionar Asiento" });
    await user.click(button);

    expect(
      await screen.findByText(
        "No se pudieron cargar los asientos. Inténtalo de nuevo.",
      ),
    ).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(getSeats).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    await waitFor(() => expect(getSeats).toHaveBeenCalledTimes(3));
    await user.click(
      await screen.findByRole("radio", { name: "A-2, Disponible" }),
    );
    expect(button).toBeEnabled();
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue(
      "ada@example.com",
    );
    expect(reserve).toHaveBeenCalledTimes(1);
  });
});
