// import { postEventsEventIdTickets } from "@/api/booking";

export function purchaseTicket(
  eventId: string,
  fullName: string,
  email: string,
  idempotencyKey: string,
): Promise<boolean> {
  // TODO(BookingService): the v0.0.0-beta spec removed
  // POST /events/{eventId}/tickets, splitting it into the seat-scoped
  // POST /events/{eventId}/tickets/{ticketId}/reserve and .../purchase.
  // The generated call below no longer exists, so purchases stay disabled
  // until this is rewired with the selected seat's ticketId.
  // try {
  //   await postEventsEventIdTickets(
  //     eventId,
  //     { fullName, email, idempotencyKey },
  //     { "X-Idempotency-Key": idempotencyKey },
  //   );
  //   return true;
  // } catch (exception) {
  //   console.log(exception);
  //   return false;
  // }
  console.debug(
    `Purchase for event ${eventId} is disabled until the seat-scoped booking endpoints are wired (idempotency key ${idempotencyKey}).`,
  );
  return Promise.resolve(false);
}
