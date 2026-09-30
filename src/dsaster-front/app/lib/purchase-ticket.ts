import { postEventsEventIdTickets } from "@/api/booking";

export async function purchaseTicket(
  eventId: string,
  fullName: string,
  email: string,
): Promise<boolean> {
  try {
    await postEventsEventIdTickets(eventId, { eventId, fullName, email });
    return true;
  } catch {
    return false;
  }
}
