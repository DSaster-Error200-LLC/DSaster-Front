import { postEventsEventIdTickets } from "@/api/booking";

export async function purchaseTicket(
  eventId: string,
  fullName: string,
  email: string,
  idempotencyKey: string,
): Promise<boolean> {
  try {
    await postEventsEventIdTickets(
      eventId,
      { fullName, email, idempotencyKey },
      { "X-Idempotency-Key": idempotencyKey },
    );
    return true;
  } catch (exception) {
    console.log(exception);
    return false;
  }
}
