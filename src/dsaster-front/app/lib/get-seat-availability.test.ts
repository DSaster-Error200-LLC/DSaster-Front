import { AxiosError } from "axios";
import { exponentialDelay } from "axios-retry";
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

    expect(availableTickets).toHaveBeenCalledWith(
      "event-1",
      expect.objectContaining({ signal }),
    );
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

  describe("timeout & retry", () => {
    /** Helper that extracts the options (second arg) passed to getAvailableTickets. */
    function capturedOptions() {
      const [, opts] = availableTickets.mock.calls[0];
      return opts as Record<string, unknown>;
    }

    it("sets a 1 000 ms timeout on the request", async () => {
      availableTickets.mockResolvedValueOnce([]);

      await getSeatAvailability("event-1", new AbortController().signal);

      expect(capturedOptions()).toMatchObject({ timeout: 1_000 });
    });

    it("configures 3 retries with exponential back-off", async () => {
      availableTickets.mockResolvedValueOnce([]);

      await getSeatAvailability("event-1", new AbortController().signal);

      const retryConfig = capturedOptions()["axios-retry"] as Record<
        string,
        unknown
      >;
      expect(retryConfig).toMatchObject({
        retries: 3,
        retryDelay: exponentialDelay,
      });
    });

    it("does not retry a 404 response", async () => {
      availableTickets.mockResolvedValueOnce([]);

      await getSeatAvailability("event-1", new AbortController().signal);

      const retryConfig = capturedOptions()["axios-retry"] as {
        retryCondition: (error: AxiosError) => boolean;
      };
      const notFoundError = Object.assign(new AxiosError(), {
        response: { status: 404 },
      });
      expect(retryConfig.retryCondition(notFoundError)).toBe(false);
    });

    it("retries on a 500 response", async () => {
      availableTickets.mockResolvedValueOnce([]);

      await getSeatAvailability("event-1", new AbortController().signal);

      const retryConfig = capturedOptions()["axios-retry"] as {
        retryCondition: (error: AxiosError) => boolean;
      };
      const serverError = Object.assign(new AxiosError(), {
        response: { status: 500 },
      });
      expect(retryConfig.retryCondition(serverError)).toBe(true);
    });
  });
});
