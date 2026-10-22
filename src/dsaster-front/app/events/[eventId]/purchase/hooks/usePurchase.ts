import { useRef, useState } from "react";
import { SeatStatus, type Seat } from "@/app/lib/get-seat-availability";
import { reserveSeat } from "@/app/lib/reserve-seat";

function fieldError(input: HTMLInputElement): string {
  if (!input.value.trim()) {
    return "Introduce tu correo electrónico.";
  }

  return !input.validity.valid || input.value.trim().length > 254
    ? "Introduce un correo electrónico válido."
    : "";
}

export type PurchaseStatus =
  "idle" | "pending" | "success" | "conflict" | "error";

export function usePurchase(
  eventId: string,
  selectedSeat: Seat | null,
  onConflict: () => void,
  onSuccess: (ticketId: string) => void,
) {
  const emailRef = useRef<HTMLInputElement>(null);
  const requestInFlightRef = useRef(false);
  const [status, setStatus] = useState<PurchaseStatus>("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const isLocked = status === "pending" || status === "success";
  const canReserve =
    !isLocked &&
    selectedSeat?.status === SeatStatus.Available &&
    emailError === "";

  async function reserve() {
    const email = emailRef.current;
    if (
      !email ||
      isLocked ||
      requestInFlightRef.current ||
      selectedSeat?.status !== SeatStatus.Available
    ) {
      return;
    }

    email.value = email.value.trim();
    const error = fieldError(email);
    setEmailError(error);

    if (error) {
      email.focus();
      return;
    }

    requestInFlightRef.current = true;
    setStatus("pending");
    const result = await reserveSeat(
      eventId,
      selectedSeat.ticketId,
      email.value,
    );
    requestInFlightRef.current = false;
    setStatus(result.status);
    if (result.status === "conflict") {
      onConflict();
    } else if (result.status === "success") {
      onSuccess(result.ticketId);
    }
  }

  function handleInputChange(input: HTMLInputElement) {
    setEmailError(fieldError(input));
  }

  return {
    emailRef,
    status,
    emailError,
    isLocked,
    canReserve,
    hasError: status === "error" || status === "conflict",
    reserve,
    handleInputChange,
  };
}
