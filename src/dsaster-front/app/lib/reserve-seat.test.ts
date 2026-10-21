import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { reserveSeat as reserveSeatRequest } from "@/api/booking";
import { reserveSeat } from "@/app/lib/reserve-seat";

vi.mock("@/api/booking", () => ({ reserveSeat: vi.fn() }));

const reserve = vi.mocked(reserveSeatRequest);

beforeEach(() => {
  reserve.mockReset();
});

describe("reserveSeat", () => {
  it("sends the approved placeholder and returns the response ticket ID", async () => {
    reserve.mockResolvedValueOnce({
      eventId: "event-1",
      ticketId: "reserved-ticket",
      seatNumber: "A-1",
      email: "ada@example.com",
      expiresAtUtc: "2026-10-20T20:10:00Z",
    });

    await expect(
      reserveSeat("event-1", "selected-ticket", "ada@example.com"),
    ).resolves.toEqual({ status: "success", ticketId: "reserved-ticket" });
    expect(reserve).toHaveBeenCalledExactlyOnceWith(
      "event-1",
      "selected-ticket",
      { email: "ada@example.com", fullName: "Pendiente" },
    );
  });

  it("maps HTTP 409 to a conflict", async () => {
    reserve.mockRejectedValue(
      Object.assign(new AxiosError("Seat taken"), {
        response: { status: 409 },
      }),
    );

    await expect(
      reserveSeat("event-1", "ticket-1", "ada@example.com"),
    ).resolves.toEqual({ status: "conflict" });
  });

  it.each([
    new Error("Network failure"),
    ...[400, 404, 500].map((status) =>
      Object.assign(new AxiosError("Reservation failed"), {
        response: { status },
      }),
    ),
  ])("maps other failures to a generic error: %s", async (error) => {
    reserve.mockRejectedValue(error);

    await expect(
      reserveSeat("event-1", "ticket-1", "ada@example.com"),
    ).resolves.toEqual({ status: "error" });
  });
});
