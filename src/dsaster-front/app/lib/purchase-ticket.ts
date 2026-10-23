import { isAxiosError } from "axios";
import { purchaseTicket as purchaseTicketRequest } from "@/api/booking";

export type PurchaseTicketResult =
  | { readonly status: "success"; readonly ticketCode: string }
  | {
      readonly status: "forbidden" | "not-found" | "conflict" | "error";
    };

const failureStatuses = {
  403: "forbidden",
  404: "not-found",
  409: "conflict",
} as const;

export async function purchaseTicket(
  eventId: string,
  ticketId: string,
  fullName: string,
  email: string,
  idempotencyKey: string,
): Promise<PurchaseTicketResult> {
  try {
    const ticket = await purchaseTicketRequest(
      eventId,
      ticketId,
      { fullName, email },
      { "X-Idempotency-Key": idempotencyKey },
    );
    return { status: "success", ticketCode: ticket.ticketCode };
  } catch (error) {
    const httpStatus = isAxiosError(error) ? error.response?.status : undefined;
    return {
      status:
        failureStatuses[httpStatus as keyof typeof failureStatuses] ?? "error",
    };
  }
}
