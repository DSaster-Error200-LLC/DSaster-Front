import { useRef, useState } from "react";
import { purchaseTicket } from "@/app/lib/purchase-ticket";

function fieldError(input: HTMLInputElement): string {
  return input.value.trim() ? "" : "Introduce tu nombre completo.";
}

export type TicketPurchaseStatus =
  | "idle"
  | "pending"
  | "success"
  | "forbidden"
  | "not-found"
  | "conflict"
  | "error";

export function useTicketPurchase(
  eventId: string,
  ticketId: string,
  email: string,
  onPurchased: (fullName: string, ticketCode: string) => void,
) {
  const fullNameRef = useRef<HTMLInputElement>(null);
  const requestInFlightRef = useRef(false);
  // The key is reused to retry the same purchase (so a lost response replays
  // safely) and replaced when the name changes, since the backend rejects a
  // key reused with different details.
  const attemptRef = useRef<{ fullName: string; key: string } | null>(null);
  const [status, setStatus] = useState<TicketPurchaseStatus>("idle");
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const isPending = status === "pending";
  const isBlocked =
    status === "forbidden" || status === "not-found" || status === "conflict";
  const isLocked = isPending || status === "success" || isBlocked;

  async function purchase() {
    const fullName = fullNameRef.current;
    if (!fullName || isLocked || requestInFlightRef.current) return;

    fullName.value = fullName.value.trim();
    const error = fieldError(fullName);
    setFullNameError(error);

    if (error) {
      fullName.focus();
      return;
    }

    if (attemptRef.current?.fullName !== fullName.value) {
      attemptRef.current = {
        fullName: fullName.value,
        key: crypto.randomUUID(),
      };
    }

    requestInFlightRef.current = true;
    setStatus("pending");
    const result = await purchaseTicket(
      eventId,
      ticketId,
      fullName.value,
      email,
      attemptRef.current.key,
    );
    requestInFlightRef.current = false;
    setStatus(result.status);
    if (result.status === "success") {
      onPurchased(fullName.value, result.ticketCode);
    }
  }

  function handleInputChange(input: HTMLInputElement) {
    if (fullNameError) setFullNameError(fieldError(input));
  }

  return {
    fullNameRef,
    status,
    fullNameError,
    isPending,
    isBlocked,
    isLocked,
    hasError: status !== "idle" && status !== "pending" && status !== "success",
    purchase,
    handleInputChange,
  };
}
