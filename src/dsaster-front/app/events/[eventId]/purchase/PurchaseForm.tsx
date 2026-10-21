"use client";

import { useId } from "react";
import {
  PurchaseError,
  PurchaseFormField,
  PurchaseSubmitButton,
  SeatMap,
} from "./components";
import { usePurchase } from "./hooks/usePurchase";
import { useSeats } from "./hooks/useSeats";

interface PurchaseFormProps {
  readonly eventId: string;
}

export default function PurchaseForm({ eventId }: Readonly<PurchaseFormProps>) {
  const id = useId();
  const seats = useSeats(eventId);
  const {
    emailRef,
    status,
    emailError,
    isLocked,
    canReserve,
    hasError,
    reserve,
    handleInputChange,
  } = usePurchase(eventId, seats.selectedSeat, seats.retry);

  return (
    <div lang="es" className="w-full">
      <SeatMap
        state={seats.state}
        selectedSeat={seats.selectedSeat}
        onSelect={seats.selectSeat}
        onRetry={seats.retry}
        disabled={isLocked}
      />

      <form
        noValidate
        aria-labelledby={`${id}-heading`}
        aria-busy={status === "pending"}
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void reserve();
        }}
      >
        <h2
          id={`${id}-heading`}
          className="font-display text-2xl font-bold text-brand-ink"
        >
          Datos del comprador
        </h2>

        <PurchaseFormField
          id={id}
          name="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          inputRef={emailRef}
          disabled={isLocked}
          error={emailError ?? undefined}
          onChange={(event) => handleInputChange(event.currentTarget)}
        />

        <PurchaseSubmitButton
          isPending={status === "pending"}
          disabled={!canReserve}
        />

        <PurchaseError
          hasError={hasError}
          message={
            status === "conflict"
              ? "El asiento fue ocupado mientras hacías tu selección. Elige otro asiento."
              : "No se pudo reservar el asiento. Inténtalo de nuevo."
          }
        />
      </form>
    </div>
  );
}
