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
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void getSeatAvailability(eventId, controller.signal).then((result) => {
      if (!controller.signal.aborted) setState(result);
    });

    return () => controller.abort();
  }, [eventId, attempt]);

  const seats = state.status === "success" ? state.seats : [];
  const selectedSeat =
    seats.find((seat) => seat.ticketId === selectedTicketId) ?? null;

  function selectSeat(seat: Seat) {
    if (seat.status === SeatStatus.Available) {
      setSelectedTicketId(seat.ticketId);
    }
  }

  function retry() {
    setState({ status: "loading" });
    setSelectedTicketId(null);
    setAttempt((previous) => previous + 1);
  }

  return { state, selectedSeat, selectSeat, retry };
}
