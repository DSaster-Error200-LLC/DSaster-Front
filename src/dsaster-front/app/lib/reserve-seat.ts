import { isAxiosError } from "axios";
import { reserveSeat as reserveSeatRequest } from "@/api/booking";

export type ReserveSeatResult =
  | { readonly status: "success"; readonly ticketId: string }
  | { readonly status: "conflict" | "error" };

export async function reserveSeat(
  eventId: string,
  ticketId: string,
  email: string,
): Promise<ReserveSeatResult> {
  try {
    // TODO: the backend requires a name; remove this placeholder when reservations accept email alone.
    const reservation = await reserveSeatRequest(eventId, ticketId, {
      email,
      fullName: "Pendiente",
    });
    return { status: "success", ticketId: reservation.ticketId };
  } catch (error) {
    return {
      status:
        isAxiosError(error) && error.response?.status === 409
          ? "conflict"
          : "error",
    };
  }
}
