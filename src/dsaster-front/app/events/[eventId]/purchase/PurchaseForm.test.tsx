import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Event } from "@/api/search";
import PurchaseForm from "@/app/events/[eventId]/purchase/PurchaseForm";
import {
  getSeatAvailability,
  SeatStatus,
  type GetSeatAvailabilityResult,
  type Seat,
} from "@/app/lib/get-seat-availability";
import {
  purchaseTicket,
  type PurchaseTicketResult,
} from "@/app/lib/purchase-ticket";
import { reserveSeat, type ReserveSeatResult } from "@/app/lib/reserve-seat";

vi.mock("@/app/lib/reserve-seat", () => ({ reserveSeat: vi.fn() }));
vi.mock("@/app/lib/purchase-ticket", () => ({ purchaseTicket: vi.fn() }));
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
const seats: Seat[] = [
  { ticketId: "ticket-1", seatNumber: "A-1", status: SeatStatus.Available },
  { ticketId: "ticket-2", seatNumber: "A-2", status: SeatStatus.Available },
  { ticketId: "ticket-3", seatNumber: "A-3", status: SeatStatus.Sold },
];
const getSeats = vi.mocked(getSeatAvailability);
const reserve = vi.mocked(reserveSeat);
const purchase = vi.mocked(purchaseTicket);

beforeEach(() => {
  getSeats.mockReset().mockResolvedValue({ status: "success", seats });
  reserve.mockReset();
  purchase.mockReset();
});

async function fillReservation() {
  const user = userEvent.setup();
  render(<PurchaseForm event={event} />);
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
    render(<PurchaseForm event={event} />);
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
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("locks pending requests, prevents duplicate submission, and opens the purchase popup for the reserved ticket", async () => {
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
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await act(async () => {
      pending.resolve({ status: "success", ticketId: "response-ticket-id" });
      await pending.promise;
    });

    expect(
      screen.getByRole("dialog", { name: "Completar compra" }),
    ).toBeInTheDocument();
    const buyerForm = screen.getByRole("form", { name: "Datos del comprador" });
    expect(buyerForm.parentElement).toHaveAttribute("inert");
    expect(
      screen.getByRole("button", { name: "Seleccionar Asiento" }),
    ).toBeDisabled();
    fireEvent.submit(buyerForm);
    expect(reserve).toHaveBeenCalledTimes(1);
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
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(button);
    expect(reserve).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
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
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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

describe("ticket purchase", () => {
  async function openPurchaseDialog() {
    reserve.mockResolvedValueOnce({
      status: "success",
      ticketId: "reserved-ticket",
    });
    const user = await fillReservation();
    await user.click(
      screen.getByRole("button", { name: "Seleccionar Asiento" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Completar compra",
    });
    return { user, dialog, inDialog: within(dialog) };
  }

  it("asks only for a required full name and shows the email from the seat selection", async () => {
    const { user, dialog, inDialog } = await openPurchaseDialog();
    const fullName = inDialog.getByLabelText("Nombre completo");

    expect(fullName).toHaveFocus();
    expect(fullName).toBeRequired();
    expect(within(dialog).getAllByRole("textbox")).toHaveLength(1);
    expect(dialog).toHaveTextContent("ada@example.com");

    for (const value of ["", "   "]) {
      fireEvent.change(fullName, { target: { value } });
      await user.click(
        inDialog.getByRole("button", { name: "Comprar ticket" }),
      );

      expect(dialog).toHaveTextContent("Introduce tu nombre completo.");
      expect(fullName).toHaveAttribute("aria-invalid", "true");
      expect(fullName).toHaveFocus();
      expect(
        inDialog.getByRole("button", { name: "Comprar ticket" }),
      ).toBeEnabled();
      expect(purchase).not.toHaveBeenCalled();
    }
  });

  it("locks while the request is pending and then shows the ticket with local data and the response code", async () => {
    const pending = Promise.withResolvers<PurchaseTicketResult>();
    purchase.mockReturnValueOnce(pending.promise);
    const { user, dialog, inDialog } = await openPurchaseDialog();
    const fullName = inDialog.getByLabelText("Nombre completo");

    await user.type(fullName, " Ada Lovelace ");
    await user.click(inDialog.getByRole("button", { name: "Comprar ticket" }));

    expect(purchase).toHaveBeenCalledExactlyOnceWith(
      "event-1",
      "reserved-ticket",
      "Ada Lovelace",
      "ada@example.com",
      expect.any(String),
    );
    const pendingButton = inDialog.getByRole("button", { name: "Comprando…" });
    expect(pendingButton).toBeDisabled();
    expect(fullName).toBeDisabled();
    expect(inDialog.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(inDialog.getByRole("form")).toHaveAttribute("aria-busy", "true");
    fireEvent.submit(inDialog.getByRole("form"));
    await user.keyboard("{Escape}");
    expect(purchase).toHaveBeenCalledTimes(1);
    expect(dialog).toBeInTheDocument();

    await act(async () => {
      pending.resolve({ status: "success", ticketCode: "TK-ABC123" });
      await pending.promise;
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Tu compra se ha completado.",
    );
    const ticket = within(screen.getByRole("region", { name: "Tu ticket" }));
    expect(ticket.getByText(event.name)).toBeInTheDocument();
    expect(ticket.getByText(event.artist)).toBeInTheDocument();
    expect(ticket.getByText("18 oct, 20:30")).toHaveAttribute(
      "datetime",
      event.date,
    );
    expect(ticket.getByText(event.venue.name)).toBeInTheDocument();
    expect(ticket.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(ticket.getByText("TK-ABC123")).toBeInTheDocument();
  });

  it("retries a generic error with the same idempotency key until the name changes", async () => {
    purchase
      .mockResolvedValueOnce({ status: "error" })
      .mockResolvedValueOnce({ status: "error" })
      .mockResolvedValueOnce({ status: "success", ticketCode: "TK-1" });
    const { user, inDialog } = await openPurchaseDialog();
    const fullName = inDialog.getByLabelText("Nombre completo");
    const submit = inDialog.getByRole("button", { name: "Comprar ticket" });

    await user.type(fullName, "Ada");
    await user.click(submit);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo completar la compra. Inténtalo de nuevo.",
    );
    expect(submit).toBeEnabled();
    expect(fullName).toBeEnabled();

    await user.click(submit);
    await waitFor(() => expect(purchase).toHaveBeenCalledTimes(2));
    const key = purchase.mock.calls[0][4];
    expect(purchase.mock.calls[1][4]).toBe(key);

    await user.type(fullName, " Lovelace");
    await user.click(submit);

    await waitFor(() => expect(purchase).toHaveBeenCalledTimes(3));
    expect(purchase.mock.calls[2][2]).toBe("Ada Lovelace");
    expect(purchase.mock.calls[2][4]).not.toBe(key);
  });

  it.each([
    [
      "forbidden",
      "Tu reserva expiró o ya no es válida. Cierra esta ventana y vuelve a elegir tu asiento.",
    ],
    [
      "not-found",
      "No encontramos el evento o el asiento. Cierra esta ventana e inténtalo de nuevo.",
    ],
    [
      "conflict",
      "El asiento ya no está disponible. Cierra esta ventana y elige otro asiento.",
    ],
  ] as const)(
    "keeps submission disabled after a %s response but lets the buyer close the popup",
    async (status, message) => {
      purchase.mockResolvedValueOnce({ status });
      const { user, inDialog } = await openPurchaseDialog();

      await user.type(inDialog.getByLabelText("Nombre completo"), "Ada");
      await user.click(
        inDialog.getByRole("button", { name: "Comprar ticket" }),
      );

      expect(await screen.findByRole("alert")).toHaveTextContent(message);
      expect(
        inDialog.getByRole("button", { name: "Comprar ticket" }),
      ).toBeDisabled();
      expect(inDialog.getByLabelText("Nombre completo")).toBeDisabled();
      fireEvent.submit(inDialog.getByRole("form"));
      expect(purchase).toHaveBeenCalledTimes(1);

      await user.click(inDialog.getByRole("button", { name: "Cerrar" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );

  it.each(["cancel button", "Escape key", "backdrop"] as const)(
    "closes with the %s, refreshes every seat and lets the buyer choose again",
    async (via) => {
      const { user, dialog, inDialog } = await openPurchaseDialog();
      expect(getSeats).toHaveBeenCalledTimes(1);

      if (via === "cancel button") {
        await user.click(inDialog.getByRole("button", { name: "Cancelar" }));
      } else if (via === "Escape key") {
        await user.keyboard("{Escape}");
      } else {
        await user.click(dialog.previousElementSibling as HTMLElement);
      }

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(purchase).not.toHaveBeenCalled();
      expect(getSeats).toHaveBeenCalledTimes(2);
      expect(getSeats).toHaveBeenLastCalledWith(
        "event-1",
        expect.any(AbortSignal),
      );
      const first = await screen.findByRole("radio", {
        name: "A-1, Disponible",
      });
      expect(first).not.toBeChecked();
      expect(screen.getByLabelText("Correo electrónico")).toHaveValue(
        "ada@example.com",
      );
      const button = screen.getByRole("button", {
        name: "Seleccionar Asiento",
      });
      expect(button).toBeDisabled();
      await user.click(first);
      expect(button).toBeEnabled();
    },
  );
});
