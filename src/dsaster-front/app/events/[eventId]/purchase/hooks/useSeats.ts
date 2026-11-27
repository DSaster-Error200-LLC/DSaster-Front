import { useEffect, useState } from "react";
import {
  getSeatAvailability,
  SeatStatus,
  type GetSeatAvailabilityResult,
  type Seat,
} from "@/app/lib/get-seat-availability";

export type SeatsState =
  { readonly status: "loading" } | GetSeatAvailabilityResult;

export function useSeats(eventId: string) {
  const [state, setState] = useState<SeatsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [selectedTicketIds, setSelectedTicketIds] = useState<
    ReadonlySet<string>
  >(() => new Set());

  useEffect(() => {
    const controller = new AbortController();

    void getSeatAvailability(eventId, controller.signal).then((result) => {
      if (!controller.signal.aborted) setState(result);
    });

    return () => controller.abort();
  }, [eventId, attempt]);

  const seats = state.status === "success" ? state.seats : [];
  const selectedSeats = seats.filter((seat) =>
    selectedTicketIds.has(seat.ticketId),
  );

  function toggleSeat(seat: Seat) {
    if (seat.status !== SeatStatus.Available) return;

    setSelectedTicketIds((previous) => {
      const next = new Set(previous);
      if (next.has(seat.ticketId)) {
        next.delete(seat.ticketId);
      } else {
        next.add(seat.ticketId);
      }
      return next;
    });
  }

  function retry() {
    setState({ status: "loading" });
    setSelectedTicketIds(new Set());
    setAttempt((previous) => previous + 1);
  }

  return { state, selectedSeats, toggleSeat, retry };
}
