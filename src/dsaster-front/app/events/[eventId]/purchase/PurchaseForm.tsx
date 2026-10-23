import { useId, useState } from "react";
import type { Event } from "@/api/search";
import {
  PurchasedTicket,
  PurchaseDialog,
  PurchaseError,
  PurchaseFormField,
  PurchaseSubmitButton,
  PurchaseSuccess,
  SeatMap,
} from "./components";
import { usePurchase } from "./hooks/usePurchase";
import { useSeats } from "./hooks/useSeats";

interface PurchaseFormProps {
  readonly event: Event;
}

interface Reservation {
  readonly ticketId: string;
  readonly email: string;
}

interface Purchase {
  readonly fullName: string;
  readonly ticketCode: string;
}

export default function PurchaseForm({ event }: Readonly<PurchaseFormProps>) {
  const id = useId();
  const seats = useSeats(event.id);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const {
    emailRef,
    status,
    emailError,
    isLocked,
    canReserve,
    hasError,
    reserve,
    handleInputChange,
    reset,
  } = usePurchase(
    event.id,
    seats.selectedSeat,
    seats.retry,
    (ticketId, email) => setReservation({ ticketId, email }),
  );

  function closeDialog() {
    setReservation(null);
    reset();
    seats.retry();
  }

  if (purchase) {
    return (
      <div lang="es" className="w-full">
        <PurchaseSuccess isSuccess />
        <PurchasedTicket
          event={event}
          fullName={purchase.fullName}
          ticketCode={purchase.ticketCode}
        />
      </div>
    );
  }

  return (
    <div lang="es" className="w-full">
      <div inert={reservation !== null}>
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
          onSubmit={(submitEvent) => {
            submitEvent.preventDefault();
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
            onChange={(changeEvent) =>
              handleInputChange(changeEvent.currentTarget)
            }
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

      {reservation && (
        <PurchaseDialog
          eventId={event.id}
          ticketId={reservation.ticketId}
          email={reservation.email}
          onClose={closeDialog}
          onPurchased={(fullName, ticketCode) => {
            setReservation(null);
            setPurchase({ fullName, ticketCode });
          }}
        />
      )}
    </div>
  );
}
