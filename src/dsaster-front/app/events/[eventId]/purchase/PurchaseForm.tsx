import { useState } from "react";
import { Button, PriceRow, formatMoney } from "@dsaster/ui";
import type { Event } from "@/api/search";
import { SeatMap } from "@/app/events/[eventId]/purchase/components";
import { useSeats } from "@/app/events/[eventId]/purchase/hooks/useSeats";
import type { Seat } from "@/app/lib/get-seat-availability";
import type { Buyer } from "@/app/lib/start-checkout";

interface PurchaseFormProps {
  readonly event: Event;
  readonly buyer: Buyer;
  readonly onContinue: () => void;
}

function seatsTotal(seats: readonly Seat[]): number {
  return seats.reduce((total, seat) => total + seat.price, 0);
}

function selectionLabel(count: number): string {
  if (count === 0) return "Ningún asiento seleccionado";
  return count === 1
    ? "1 asiento seleccionado"
    : `${count} asientos seleccionados`;
}

function totalLabel(count: number): string {
  return count === 1 ? "Total (1 asiento)" : `Total (${count} asientos)`;
}

export default function PurchaseForm({
  event,
  buyer,
  onContinue,
}: Readonly<PurchaseFormProps>) {
  const seats = useSeats(event.id);
  const [reservedSeats, setReservedSeats] = useState<readonly Seat[] | null>(
    null,
  );

  const isReserved = reservedSeats !== null;
  const selectedTotal = seatsTotal(seats.selectedSeats);
  const reservedTotal = reservedSeats ? seatsTotal(reservedSeats) : 0;

  function reserveSeats() {
    if (seats.selectedSeats.length === 0) return;

    const seatValues = seats.selectedSeats.map(
      ({ ticketId, seatNumber, price }) => ({ ticketId, seatNumber, price }),
    );
    // TODO: call the reserve endpoint once its contract supports reserving
    // several seats for the buyer collected in the previous step.
    console.info("[reserve-seats] valores que se enviarían:", {
      eventId: event.id,
      buyer,
      seats: seatValues,
      total: selectedTotal,
    });

    setReservedSeats(seats.selectedSeats);
  }

  if (isReserved) {
    return (
      <div lang="es" className="w-full">
        <SeatMap
          state={seats.state}
          selectedSeats={seats.selectedSeats}
          onToggle={seats.toggleSeat}
          onRetry={seats.retry}
          disabled
        />

        <section
          aria-labelledby="reserved-seats-heading"
          className="rounded-(--radius-lg) border border-line bg-surface-100 p-(--space-4)"
        >
          <h2 id="reserved-seats-heading" className="text-heading-s text-ink">
            Asientos reservados
          </h2>
          <p className="mt-(--space-1) text-body-s text-ink-muted">
            Reserva simulada: todavía no se envía a la API.
          </p>

          <div className="mt-(--space-4) grid gap-(--space-2)">
            {reservedSeats.map((seat) => (
              <PriceRow
                key={seat.ticketId}
                label={`Asiento ${seat.seatNumber}`}
                amount={seat.price}
              />
            ))}
            <PriceRow
              kind="total"
              label={totalLabel(reservedSeats.length)}
              amount={reservedTotal}
            />
          </div>

          <div className="mt-(--space-5) grid gap-(--space-3) sm:grid-cols-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setReservedSeats(null)}
            >
              Cambiar asientos
            </Button>
            <Button size="lg" iconRight="chevron-right" onClick={onContinue}>
              Continuar al pago
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div lang="es" className="w-full">
      <SeatMap
        state={seats.state}
        selectedSeats={seats.selectedSeats}
        onToggle={seats.toggleSeat}
        onRetry={seats.retry}
        disabled={false}
      />

      <form
        noValidate
        aria-label="Selección de asientos"
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          reserveSeats();
        }}
      >
        <div className="flex items-center justify-between gap-(--space-3) border-t border-line pt-(--space-4)">
          <p className="text-body text-ink-muted">
            {selectionLabel(seats.selectedSeats.length)}
          </p>
          <p className="text-mono-m text-ink">{formatMoney(selectedTotal)}</p>
        </div>

        <Button
          type="submit"
          size="lg"
          block
          className="mt-(--space-4)"
          iconRight="chevron-right"
          disabled={seats.selectedSeats.length === 0}
        >
          Reservar asientos
        </Button>
      </form>
    </div>
  );
}
