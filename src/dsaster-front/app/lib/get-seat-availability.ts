import { isAxiosError } from "axios";
import { exponentialDelay } from "axios-retry";
import { getAvailableTickets, type SeatAvailabilityDto } from "@/api/booking";

/**
 * BookingService documents `status` as a plain string whose values are
 * 'Available', 'Reserved' or 'Sold', so Orval cannot generate a union for it.
 * TODO(BookingService): drop the cast below once the spec declares `status`
 * as an enum and Orval generates the type for us.
 */
export enum SeatStatus {
  Available = "Available",
  Reserved = "Reserved",
  Sold = "Sold",
}

export interface Seat {
  readonly ticketId: string;
  readonly seatNumber: string;
  readonly status: SeatStatus;
}

export type GetSeatAvailabilityResult =
  | { readonly status: "missing" | "error" }
  | { readonly status: "success"; readonly seats: Seat[] };

/** Timeout applied to each attempt of GET /events/{eventId}/tickets. */
const SEAT_TIMEOUT_MS = 1_000;

/** Maximum number of automatic retries before giving up. */
const SEAT_MAX_RETRIES = 3;

/**
 * Fetches the seat availability (GET /events/{eventId}/tickets) for an event,
 * mapping the documented responses: 200 with the seat list, 404 when the event
 * is unknown to the BookingService, anything else as a generic failure.
 *
 * The request is configured with a 1 s timeout and up to 3 retries using
 * exponential back-off.  404 responses are **not** retried because they
 * represent a valid "event not found" answer from the BookingService.
 */
export async function getSeatAvailability(
  eventId: string,
  signal: AbortSignal,
): Promise<GetSeatAvailabilityResult> {
  try {
    const seats = await getAvailableTickets(eventId, {
      signal,
      timeout: SEAT_TIMEOUT_MS,
      "axios-retry": {
        retries: SEAT_MAX_RETRIES,
        retryDelay: exponentialDelay,
        retryCondition: (error) => error.response?.status !== 404,
      },
    });
    return { status: "success", seats: seats.map(toSeat) };
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    return { status: status === 404 ? "missing" : "error" };
  }
}

function toSeat(seat: SeatAvailabilityDto): Seat {
  return {
    ticketId: seat.ticketId,
    seatNumber: seat.seatNumber,
    // The spec types `status` as a plain string; cast it to the documented
    // enum values.
    status: seat.status as SeatStatus,
  };
}
