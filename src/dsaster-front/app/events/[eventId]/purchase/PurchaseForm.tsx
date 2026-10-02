"use client";

import { useId } from "react";
import {
  PurchaseError,
  PurchaseFormField,
  PurchaseSubmitButton,
  PurchaseSuccess,
} from "./components";
import { usePurchase } from "./hooks/usePurchase";

interface PurchaseFormProps {
  readonly eventId: string;
}

export default function PurchaseForm({ eventId }: Readonly<PurchaseFormProps>) {
  const id = useId();
  const {
    fullNameRef,
    emailRef,
    status,
    errors,
    hasError,
    purchase,
    handleInputChange,
  } = usePurchase(eventId);

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
            <PurchaseFormField
              key={name}
              id={id}
              name={name}
              label={label}
              type={type}
              autoComplete={autoComplete}
              inputRef={ref}
              disabled={status === "pending"}
              error={errors[name]}
              onChange={(event) => handleInputChange(name, event.currentTarget)}
            />
          ))}

          <PurchaseError hasError={hasError} />

          <PurchaseSubmitButton isPending={status === "pending"} />
        </form>
      )}

      <PurchaseSuccess isSuccess={status === "success"} />
    </div>
  );
}
