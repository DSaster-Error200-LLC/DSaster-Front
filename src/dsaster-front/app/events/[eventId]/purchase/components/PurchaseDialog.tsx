import { useEffect, useId } from "react";
import { Button } from "@dsaster/ui";
import {
  useTicketPurchase,
  type TicketPurchaseStatus,
} from "@/app/events/[eventId]/purchase/hooks/useTicketPurchase";
import { PurchaseError } from "./PurchaseError";
import { PurchaseFormField } from "./PurchaseFormField";
import { PurchaseSubmitButton } from "./PurchaseSubmitButton";

interface PurchaseDialogProps {
  readonly eventId: string;
  readonly ticketId: string;
  readonly email: string;
  readonly seatNumber: string;
  readonly onClose: () => void;
  readonly onPurchased: (fullName: string, ticketCode: string) => void;
}

const errorMessages: Partial<Record<TicketPurchaseStatus, string>> = {
  forbidden:
    "Tu reserva expiró o ya no es válida. Cierra esta ventana y vuelve a elegir tu asiento.",
  "not-found":
    "No encontramos el evento o el asiento. Cierra esta ventana e inténtalo de nuevo.",
  conflict:
    "El asiento ya no está disponible. Cierra esta ventana y elige otro asiento.",
  error: "No se pudo completar la compra. Inténtalo de nuevo.",
};

export function PurchaseDialog({
  eventId,
  ticketId,
  email,
  seatNumber,
  onClose,
  onPurchased,
}: Readonly<PurchaseDialogProps>) {
  const id = useId();
  const {
    fullNameRef,
    status,
    fullNameError,
    isPending,
    isBlocked,
    hasError,
    purchase,
    handleInputChange,
  } = useTicketPurchase(eventId, ticketId, email, onPurchased);

  useEffect(() => {
    fullNameRef.current?.focus();
  }, [fullNameRef]);

  // Closing mid-request would hide a purchase that may still complete.
  useEffect(() => {
    if (isPending) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isPending, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-(--space-4)">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-surface-000/80"
        onClick={isPending ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-heading`}
        className="relative w-full max-w-md rounded-(--radius-lg) border border-line bg-surface-100 p-(--space-5) shadow-sheet"
      >
        <form
          noValidate
          aria-labelledby={`${id}-heading`}
          aria-busy={isPending}
          className="grid gap-(--space-5)"
          onSubmit={(event) => {
            event.preventDefault();
            void purchase();
          }}
        >
          <h2 id={`${id}-heading`} className="text-heading-m text-ink">
            Completar compra
          </h2>
          <div>
            <p className="text-body font-semibold text-ink">
              Asiento {seatNumber}
            </p>
            <p className="wrap-break-word text-body-s text-ink-muted">
              Reservado para {email}.
            </p>
          </div>

          <PurchaseFormField
            id={id}
            name="fullName"
            label="Nombre completo"
            type="text"
            autoComplete="name"
            inputRef={fullNameRef}
            disabled={isPending || isBlocked}
            error={fullNameError ?? undefined}
            onChange={(event) => handleInputChange(event.currentTarget)}
          />

          <PurchaseSubmitButton
            isPending={isPending}
            disabled={isPending || isBlocked}
            label="Comprar ticket"
            pendingLabel="Comprando…"
          />

          <PurchaseError hasError={hasError} message={errorMessages[status]} />

          <Button
            type="button"
            variant="secondary"
            block
            onClick={onClose}
            disabled={isPending}
          >
            {isBlocked ? "Cerrar" : "Cancelar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
