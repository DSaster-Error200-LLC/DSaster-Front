import { isAxiosError } from "axios";
import { getAvailableTickets, type SeatAvailabilityDto } from "@/api/booking";

/**
 * The BookingService OpenAPI spec (v0.0.0-beta) documents `status` as a plain
 * nullable string whose values are 'Available', 'Reserved' or 'Sold', so Orval
 * cannot generate a union for it.
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
  readonly status: SeatStatus | null;
}

export type GetSeatAvailabilityResult =
  | { readonly status: "missing" | "error" }
  | { readonly status: "success"; readonly seats: Seat[] };

/**
 * Fetches the seat availability (GET /events/{eventId}/tickets) for an event,
 * mapping the documented responses: 200 with the seat list, 404 when the event
 * is unknown to the BookingService, anything else as a generic failure.
 */
export async function getSeatAvailability(
  eventId: string,
  signal: AbortSignal,
): Promise<GetSeatAvailabilityResult> {
  try {
    const seats = await getAvailableTickets(eventId, { signal });
    return { status: "success", seats: seats.map(toSeat) };
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    return { status: status === 404 ? "missing" : "error" };
  }
}

function toSeat(seat: SeatAvailabilityDto): Seat {
  return {
    ticketId: seat.ticketId ?? "",
    seatNumber: seat.seatNumber ?? "",
    // `status` is an untyped string in the spec; cast it to the enum. Null or
    // unexpected values are rendered as unknown and cannot be selected.
    status: (seat.status ?? null) as SeatStatus | null,
  };
}
