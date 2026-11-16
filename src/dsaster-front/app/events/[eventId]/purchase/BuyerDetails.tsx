import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { Event } from "@/api/search";
import {
  PurchaseError,
  PurchaseFormField,
  PurchaseSubmitButton,
} from "@/app/events/[eventId]/purchase/components";
import { emailFieldError } from "@/app/events/[eventId]/purchase/hooks/usePurchase";
import { fullNameFieldError } from "@/app/events/[eventId]/purchase/hooks/useTicketPurchase";
import { startCheckout } from "@/app/lib/start-checkout";

interface BuyerDetailsProps {
  readonly event: Event;
  readonly onContinue: () => void;
}

interface FieldErrors {
  readonly fullName?: string;
  readonly email?: string;
}

const validators = {
  fullName: fullNameFieldError,
  email: emailFieldError,
} as const;

export default function BuyerDetails({
  event,
  onContinue,
}: Readonly<BuyerDetailsProps>) {
  const id = useId();
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");
  const isPending = status === "pending";

  async function submit() {
    const fullName = fullNameRef.current;
    const email = emailRef.current;
    if (!fullName || !email || isPending) return;

    fullName.value = fullName.value.trim();
    email.value = email.value.trim();
    const nextErrors = {
      fullName: fullNameFieldError(fullName) || undefined,
      email: emailFieldError(email) || undefined,
    };
    setErrors(nextErrors);

    if (nextErrors.fullName) return fullName.focus();
    if (nextErrors.email) return email.focus();

    setStatus("pending");
    const result = await startCheckout(event.id, {
      fullName: fullName.value,
      email: email.value,
    });
    if (result.status === "success") {
      onContinue();
    } else {
      setStatus("error");
    }
  }

  function revalidate(input: HTMLInputElement) {
    const name = input.name as keyof typeof validators;
    if (errors[name]) {
      setErrors({ ...errors, [name]: validators[name](input) || undefined });
    }
  }

  return (
    <article className="mx-auto max-w-xl px-6 py-12">
      <h1
        id={`${id}-heading`}
        className="font-display text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl"
      >
        Tus datos
      </h1>
      <p className="mt-3 wrap-break-word text-brand-muted">
        Para comprar entradas de {event.name}.
      </p>

      <form
        noValidate
        aria-labelledby={`${id}-heading`}
        aria-busy={isPending}
        className="mt-8 space-y-5"
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          void submit();
        }}
      >
        <PurchaseFormField
          id={id}
          name="fullName"
          label="Nombre completo"
          type="text"
          autoComplete="name"
          inputRef={fullNameRef}
          disabled={isPending}
          error={errors.fullName}
          onChange={(changeEvent) => revalidate(changeEvent.currentTarget)}
        />
        <PurchaseFormField
          id={id}
          name="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          inputRef={emailRef}
          disabled={isPending}
          error={errors.email}
          onChange={(changeEvent) => revalidate(changeEvent.currentTarget)}
        />

        <PurchaseSubmitButton
          isPending={isPending}
          disabled={isPending}
          label="Iniciar compra"
          pendingLabel="Iniciando…"
        />

        <PurchaseError
          hasError={status === "error"}
          message="No se pudo iniciar la compra. Inténtalo de nuevo."
        />

        <Link
          href={`/events/${event.id}`}
          className="block w-full rounded-xl border border-brand-border px-8 py-3 text-center font-display text-base font-semibold text-brand-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-rust"
        >
          Volver al evento
        </Link>
      </form>
    </article>
  );
}
