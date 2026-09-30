"use client";

import { useId, useRef, useState } from "react";
import { postEventsEventIdTickets } from "@/api/booking";

interface PurchaseFormProps {
  readonly eventId: string;
}

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

const buttonClassName =
  "w-full rounded-xl bg-brand-rust px-8 py-4 font-display text-base font-semibold text-white transition-colors hover:bg-brand-rust-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-rust disabled:cursor-wait disabled:opacity-60";

export default function PurchaseForm({ eventId }: Readonly<PurchaseFormProps>) {
  const id = useId();
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
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
      const baseURL = process.env.NEXT_PUBLIC_BOOKING_API_URL?.trim();
      if (!baseURL) throw new Error("BookingService URL is not configured.");

      await postEventsEventIdTickets(
        eventId,
        { eventId, fullName: fullName.value, email: email.value },
        { baseURL },
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const fields = [
    {
      name: "fullName",
      label: "Nombre completo",
      type: "text",
      autoComplete: "name",
      ref: fullNameRef,
    },
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      autoComplete: "email",
      ref: emailRef,
    },
  ] as const;

  return (
    <div lang="es" className="w-full">
      {status !== "success" && (
        <form
          noValidate
          aria-labelledby={`${id}-heading`}
          aria-busy={status === "pending"}
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void purchase();
          }}
        >
          <h2
            id={`${id}-heading`}
            className="font-display text-2xl font-bold text-brand-ink"
          >
            Datos del comprador
          </h2>

          {fields.map(({ name, label, type, autoComplete, ref }) => (
            <div key={name}>
              <label
                htmlFor={`${id}-${name}`}
                className="mb-2 block text-sm font-medium text-brand-ink"
              >
                {label}
              </label>
              <input
                ref={ref}
                id={`${id}-${name}`}
                name={name}
                type={type}
                autoComplete={autoComplete}
                required
                disabled={status === "pending"}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={
                  errors[name] ? `${id}-${name}-error` : undefined
                }
                className="w-full rounded-lg border border-brand-muted bg-white px-4 py-3 text-brand-ink outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand-rust disabled:opacity-60 aria-invalid:border-brand-maroon"
                onChange={(event) => {
                  if (errors[name]) {
                    const message = fieldError(event.currentTarget);
                    setErrors((previous) => ({ ...previous, [name]: message }));
                  }
                }}
              />
              {errors[name] && (
                <p
                  id={`${id}-${name}-error`}
                  className="mt-2 text-sm text-brand-maroon"
                  aria-live="polite"
                >
                  {errors[name]}
                </p>
              )}
            </div>
          ))}

          {status === "error" && (
            <p role="alert" className="text-sm text-brand-maroon">
              No se pudo completar la compra. Inténtalo de nuevo.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "pending"}
            className={buttonClassName}
          >
            {status === "pending" ? "Comprando…" : "Comprar Ticket"}
          </button>
        </form>
      )}

      <p
        role="status"
        className="font-display text-lg font-semibold text-brand-ink"
      >
        {status === "success" ? "Tu compra se ha completado." : ""}
      </p>
    </div>
  );
}
