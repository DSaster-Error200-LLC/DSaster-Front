import { useRef, useState } from "react";
import { purchaseTicket } from "@/app/lib/purchase-ticket";

function fieldError(input: HTMLInputElement): string {
  if (!input.value.trim()) {
    return input.name === "fullName"
      ? "Introduce tu nombre completo."
      : "Introduce tu correo electrónico.";
  }

  return input.validity.typeMismatch
    ? "Introduce un correo electrónico válido."
    : "";
}

export type PurchaseStatus = "idle" | "pending" | "success" | "error";

export function usePurchase(eventId: string) {
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<PurchaseStatus>("idle");
  const [errors, setErrors] = useState({ fullName: "", email: "" });

  async function purchase() {
    const fullName = fullNameRef.current;
    const email = emailRef.current;
    if (!fullName || !email || status === "pending" || status === "success") {
      return;
    }

    fullName.value = fullName.value.trim();
    email.value = email.value.trim();
    const nextErrors = {
      fullName: fieldError(fullName),
      email: fieldError(email),
    };
    setErrors(nextErrors);
    setStatus("idle");

    if (nextErrors.fullName || nextErrors.email) {
      (nextErrors.fullName ? fullName : email).focus();
      return;
    }

    setStatus("pending");
    try {
      const purchased = await purchaseTicket(
        eventId,
        fullName.value,
        email.value,
      );
      setStatus(purchased ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  function handleInputChange(
    name: "fullName" | "email",
    input: HTMLInputElement,
  ) {
    if (errors[name]) {
      const message = fieldError(input);
      setErrors((previous) => ({ ...previous, [name]: message }));
    }
  }

  return {
    fullNameRef,
    emailRef,
    status,
    errors,
    hasError: status === "error",
    purchase,
    handleInputChange,
  };
}
