import { AxiosError } from "axios";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { eventsControllerGetDetails, type Event } from "@/api/search";
import EventContent from "@/app/events/[eventId]/EventContent";
import EventPage from "@/app/events/[eventId]/page";
import PurchasePage from "@/app/events/[eventId]/purchase/page";
import {
  getSeatAvailability,
  SeatStatus,
  type Seat,
} from "@/app/lib/get-seat-availability";
import { purchaseTicket } from "@/app/lib/purchase-ticket";

vi.mock("@/api/search", () => ({ eventsControllerGetDetails: vi.fn() }));
vi.mock("@/app/lib/purchase-ticket", () => ({ purchaseTicket: vi.fn() }));
vi.mock("@/app/lib/get-seat-availability", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/app/lib/get-seat-availability")>()),
  getSeatAvailability: vi.fn(),
}));

const event: Event = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "Evento del backend",
  artist: "Artista del backend",
  date: "2026-10-18T20:30:00Z",
  venue: { name: "Recinto del backend", location: "Ciudad del backend" },
};
const getDetails = vi.mocked(eventsControllerGetDetails);
const getSeats = vi.mocked(getSeatAvailability);

beforeEach(() => {
  getDetails.mockReset();
  vi.mocked(purchaseTicket).mockReset();
  getSeats.mockReset().mockResolvedValue({ status: "success", seats: [] });
});

describe("EventContent", () => {
  it.each(["details", "purchase"] as const)(
    "shows loading without details or form in %s view",
    (view) => {
      getDetails.mockReturnValueOnce(Promise.withResolvers<Event>().promise);

      render(<EventContent eventId={event.id} view={view} />);

      expect(screen.getByRole("status")).toHaveTextContent("Cargando evento…");
      expect(screen.queryByText(event.name)).not.toBeInTheDocument();
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Comprar Ticket" }),
      ).not.toBeInTheDocument();
      const signal = getDetails.mock.calls[0][1]?.signal;
      expect(signal).toBeInstanceOf(AbortSignal);
      expect(getDetails).toHaveBeenCalledWith(event.id, { signal });
    },
  );

  it("renders backend details and links using the returned event ID", async () => {
    getDetails.mockResolvedValueOnce(event);
    const requestedId = "33333333-3333-4333-8333-333333333333";

    render(
      await EventPage({ params: Promise.resolve({ eventId: requestedId }) }),
    );

    expect(
      await screen.findByRole("heading", { name: event.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(event.artist)).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("oct")).toBeInTheDocument();
    expect(screen.getByText("20:30")).toBeInTheDocument();
    expect(screen.getByText(event.venue.name)).toBeInTheDocument();
    expect(screen.getByText(event.venue.location)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Comprar Ticket" }),
    ).toHaveAttribute("href", `/events/${event.id}/purchase`);
    expect(
      screen.getByRole("link", { name: "Volver a eventos" }),
    ).toHaveAttribute("href", "/");
    expect(getDetails).toHaveBeenCalledWith(requestedId, expect.any(Object));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("renders direct purchase summary and submits the returned event ID", async () => {
    const user = userEvent.setup();
    getDetails.mockResolvedValueOnce(event);
    vi.mocked(purchaseTicket).mockResolvedValueOnce(true);
    const requestedId = "33333333-3333-4333-8333-333333333333";

    render(
      await PurchasePage({ params: Promise.resolve({ eventId: requestedId }) }),
    );

    expect(
      await screen.findByRole("heading", { name: event.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(event.artist)).toBeInTheDocument();
    expect(screen.getByText("18 oct, 20:30")).toHaveAttribute(
      "datetime",
      event.date,
    );
    expect(screen.getByText(event.venue.name)).toBeInTheDocument();
    expect(screen.getByText(event.venue.location)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Volver al evento" }),
    ).toHaveAttribute("href", `/events/${event.id}`);
    expect(
      screen.getByRole("form", { name: "Datos del comprador" }),
    ).toBeInTheDocument();
    expect(getDetails).toHaveBeenCalledWith(requestedId, expect.any(Object));

    await user.type(screen.getByLabelText("Nombre completo"), "Ada Lovelace");
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "ada@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Comprar Ticket" }));

    expect(purchaseTicket).toHaveBeenCalledWith(
      event.id,
      "Ada Lovelace",
      "ada@example.com",
      expect.any(String),
    );
  });

  it.each([
    [400, "details"],
    [404, "details"],
    [400, "purchase"],
    [404, "purchase"],
  ] as const)(
    "shows missing event for HTTP %i in %s view",
    async (status, view) => {
      getDetails.mockRejectedValueOnce(
        Object.assign(new AxiosError("Event unavailable"), {
          response: { status },
        }),
      );

      render(<EventContent eventId="invalid-or-missing" view={view} />);

      expect(
        await screen.findByRole("heading", { name: "Evento no encontrado" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Ver todos los eventos" }),
      ).toHaveAttribute("href", "/");
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Reintentar" }),
      ).not.toBeInTheDocument();
    },
  );

  it.each([
    new Error("Network failure"),
    Object.assign(new AxiosError("Server failure"), {
      response: { status: 500 },
    }),
  ])(
    "clears failure and starts a fresh request on retry: %s",
    async (error) => {
      const user = userEvent.setup();
      const retry = Promise.withResolvers<Event>();
      getDetails
        .mockRejectedValueOnce(error)
        .mockReturnValueOnce(retry.promise);

      render(<EventContent eventId={event.id} view="purchase" />);

      expect(await screen.findByRole("alert")).toHaveTextContent(
        "No se pudo cargar el evento. Inténtalo de nuevo.",
      );
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      const firstSignal = getDetails.mock.calls[0][1]?.signal;

      await user.click(screen.getByRole("button", { name: "Reintentar" }));

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent("Cargando evento…");
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      expect(getDetails).toHaveBeenCalledTimes(2);
      expect(firstSignal?.aborted).toBe(true);
      expect(getDetails.mock.calls[1][1]?.signal).not.toBe(firstSignal);

      await act(async () => {
        retry.resolve(event);
        await retry.promise;
      });

      expect(
        screen.getByRole("heading", { name: event.name }),
      ).toBeInTheDocument();
      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    },
  );

  it.each(["resolve", "reject"] as const)(
    "aborts on navigation and ignores late %s results",
    async (completion) => {
      const previous = Promise.withResolvers<Event>();
      getDetails
        .mockReturnValueOnce(previous.promise)
        .mockResolvedValueOnce(event);
      const { rerender } = render(
        <EventContent eventId="previous-event" view="details" />,
      );
      const signal = getDetails.mock.calls[0][1]?.signal;

      rerender(<EventContent eventId={event.id} view="details" />);
      await screen.findByRole("heading", { name: event.name });

      expect(signal?.aborted).toBe(true);
      await act(async () => {
        if (completion === "resolve") {
          previous.resolve({ ...event, name: "Stale event" });
        } else {
          previous.reject(new Error("Late failure"));
        }
        await previous.promise.catch(() => undefined);
      });

      expect(
        screen.getByRole("heading", { name: event.name }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Stale event")).not.toBeInTheDocument();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    },
  );

  it("aborts on unmount and ignores cancellation rejection", async () => {
    const pending = Promise.withResolvers<Event>();
    getDetails.mockReturnValueOnce(pending.promise);
    const { unmount } = render(
      <EventContent eventId={event.id} view="details" />,
    );
    const signal = getDetails.mock.calls[0][1]?.signal;

    unmount();

    expect(signal?.aborted).toBe(true);
    await act(async () => {
      pending.reject(new DOMException("Aborted", "AbortError"));
      await pending.promise.catch(() => undefined);
    });
  });
});

describe("seat availability", () => {
  const seats: Seat[] = [
    {
      ticketId: "aaaaaaaa-1111-4111-8111-111111111111",
      seatNumber: "A-1",
      status: SeatStatus.Available,
    },
    {
      ticketId: "aaaaaaaa-2222-4222-8222-222222222222",
      seatNumber: "A-2",
      status: SeatStatus.Available,
    },
    {
      ticketId: "bbbbbbbb-3333-4333-8333-333333333333",
      seatNumber: "B-1",
      status: SeatStatus.Reserved,
    },
    {
      ticketId: "cccccccc-4444-4444-8444-444444444444",
      seatNumber: "C-1",
      status: SeatStatus.Sold,
    },
  ];

  async function renderPurchase() {
    getDetails.mockResolvedValueOnce(event);
    render(
      await PurchasePage({ params: Promise.resolve({ eventId: event.id }) }),
    );
  }

  it("renders each seat with its number and status color", async () => {
    getSeats.mockResolvedValueOnce({ status: "success", seats });
    await renderPurchase();

    expect(
      await screen.findByRole("radiogroup", { name: "Elige tu asiento" }),
    ).toBeInTheDocument();
    const available = screen.getByRole("radio", { name: "A-1, Disponible" });
    expect(available).toBeEnabled();
    expect(available.closest("label")).toHaveClass("border-emerald-500");
    expect(
      screen.getByText("A-1", { selector: "label span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "B-1, Reservado" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("radio", { name: "B-1, Reservado" }).closest("label"),
    ).toHaveClass("border-amber-500");
    expect(screen.getByRole("radio", { name: "C-1, Vendido" })).toBeDisabled();
    expect(
      screen.getByRole("radio", { name: "C-1, Vendido" }).closest("label"),
    ).toHaveClass("border-rose-500");
  });

  it("keeps a single seat selected when the buyer picks another", async () => {
    const user = userEvent.setup();
    getSeats.mockResolvedValueOnce({ status: "success", seats });
    await renderPurchase();

    const first = await screen.findByRole("radio", {
      name: "A-1, Disponible",
    });
    const second = screen.getByRole("radio", { name: "A-2, Disponible" });

    await user.click(first);
    expect(first).toBeChecked();
    expect(screen.getByText("Asiento A-1 seleccionado.")).toBeInTheDocument();

    await user.click(second);
    expect(first).not.toBeChecked();
    expect(second).toBeChecked();
    expect(screen.getByText("Asiento A-2 seleccionado.")).toBeInTheDocument();
  });

  it("informs when the booking service does not know the event", async () => {
    getSeats.mockResolvedValueOnce({ status: "missing" });
    await renderPurchase();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No encontramos los asientos de este evento.",
    );
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(
      screen.getByRole("form", { name: "Datos del comprador" }),
    ).toBeInTheDocument();
  });

  it("retries the seat request when loading fails", async () => {
    const user = userEvent.setup();
    getSeats
      .mockResolvedValueOnce({ status: "error" })
      .mockResolvedValueOnce({ status: "success", seats });
    await renderPurchase();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudieron cargar los asientos.",
    );
    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(getSeats).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByRole("radio", { name: "A-1, Disponible" }),
    ).toBeEnabled();
  });
});
