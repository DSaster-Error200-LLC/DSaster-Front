import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { purchaseTicket as purchaseTicketRequest } from "@/api/booking";
import { purchaseTicket } from "@/app/lib/purchase-ticket";

vi.mock("@/api/booking", () => ({ purchaseTicket: vi.fn() }));

const purchase = vi.mocked(purchaseTicketRequest);

beforeEach(() => {
  purchase.mockReset();
});

describe("purchaseTicket", () => {
  it("sends the idempotency key and returns only the ticket code from the response", async () => {
    purchase.mockResolvedValueOnce({
      ticketId: "ticket-1",
      eventId: "event-1",
      seatNumber: "A-1",
      fullName: "Nombre del backend",
      email: "ada@example.com",
      ticketCode: "TK-123",
    });

    await expect(
      purchaseTicket(
        "event-1",
        "ticket-1",
        "Ada Lovelace",
        "ada@example.com",
        "key-1",
      ),
    ).resolves.toEqual({ status: "success", ticketCode: "TK-123" });
    expect(purchase).toHaveBeenCalledExactlyOnceWith(
      "event-1",
      "ticket-1",
      { fullName: "Ada Lovelace", email: "ada@example.com" },
      { "X-Idempotency-Key": "key-1" },
    );
  });

  it.each([
    [403, "forbidden"],
    [404, "not-found"],
    [409, "conflict"],
    [400, "error"],
    [500, "error"],
  ] as const)("maps HTTP %i to %s", async (httpStatus, status) => {
    purchase.mockRejectedValue(
      Object.assign(new AxiosError("Purchase failed"), {
        response: { status: httpStatus },
      }),
    );

    await expect(
      purchaseTicket("event-1", "ticket-1", "Ada", "ada@example.com", "key-1"),
    ).resolves.toEqual({ status });
  });

  it("maps network failures to a generic error", async () => {
    purchase.mockRejectedValue(new Error("Network failure"));

    await expect(
      purchaseTicket("event-1", "ticket-1", "Ada", "ada@example.com", "key-1"),
    ).resolves.toEqual({ status: "error" });
  });
});
