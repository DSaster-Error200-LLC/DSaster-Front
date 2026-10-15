import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAvailableTickets } from "@/api/booking";
import {
  getSeatAvailability,
  SeatStatus,
} from "@/app/lib/get-seat-availability";

vi.mock("@/api/booking", () => ({ getAvailableTickets: vi.fn() }));

const availableTickets = vi.mocked(getAvailableTickets);

beforeEach(() => {
  availableTickets.mockReset();
});

describe("getSeatAvailability", () => {
  it("maps the documented 200 seats and casts status to the enum", async () => {
    availableTickets.mockResolvedValueOnce([
      { ticketId: "seat-1", seatNumber: "A-1", status: "Available" },
      { ticketId: "seat-2", seatNumber: "B-2", status: "Reserved" },
      { ticketId: "seat-3", seatNumber: "C-3", status: "Sold" },
    ]);
    const { signal } = new AbortController();

    const result = await getSeatAvailability("event-1", signal);

    expect(availableTickets).toHaveBeenCalledWith("event-1", { signal });
    expect(result).toEqual({
      status: "success",
      seats: [
        { ticketId: "seat-1", seatNumber: "A-1", status: SeatStatus.Available },
        { ticketId: "seat-2", seatNumber: "B-2", status: SeatStatus.Reserved },
        { ticketId: "seat-3", seatNumber: "C-3", status: SeatStatus.Sold },
      ],
    });
  });

  it("reports the documented 404 as a missing event", async () => {
    availableTickets.mockRejectedValueOnce(
      Object.assign(new AxiosError("Event was not found"), {
        response: { status: 404 },
      }),
    );

    await expect(
      getSeatAvailability("missing-event", new AbortController().signal),
    ).resolves.toEqual({ status: "missing" });
  });

  it.each([
    new Error("Network failure"),
    Object.assign(new AxiosError("Server failure"), {
      response: { status: 500 },
    }),
  ])("reports any other failure as an error: %s", async (failure) => {
    availableTickets.mockRejectedValueOnce(failure);

    await expect(
      getSeatAvailability("event-1", new AbortController().signal),
    ).resolves.toEqual({ status: "error" });
  });
});
