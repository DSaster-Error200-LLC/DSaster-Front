import { Button, Notice } from "@dsaster/ui";
import type { SeatsState } from "@/app/events/[eventId]/purchase/hooks/useSeats";
import { assertNever } from "@/app/lib/assert-never";
import { SeatStatus, type Seat } from "@/app/lib/get-seat-availability";

interface SeatMapProps {
  readonly state: SeatsState;
  readonly selectedSeat: Seat | null;
  readonly onSelect: (seat: Seat) => void;
  readonly onRetry: () => void;
  readonly disabled: boolean;
}

interface SeatStatusStyle {
  readonly label: string;
  readonly dot: string;
  readonly tile: string;
}

const legendStatuses = [
  SeatStatus.Available,
  SeatStatus.Reserved,
  SeatStatus.Sold,
] as const;

// Status is never colour alone: every tile also carries the status word.
function statusStyle(status: SeatStatus): SeatStatusStyle {
  switch (status) {
    case SeatStatus.Available:
      return {
        label: "Disponible",
        dot: "bg-success",
        tile: "border-success bg-success-soft text-success",
      };
    case SeatStatus.Reserved:
      return {
        label: "Reservado",
        dot: "bg-warning",
        tile: "border-warning bg-warning-soft text-warning",
      };
    case SeatStatus.Sold:
      return {
        label: "Vendido",
        dot: "bg-danger",
        tile: "border-danger bg-danger-soft text-danger",
      };
    default:
      assertNever(status);
  }
}

export function SeatMap({
  state,
  selectedSeat,
  onSelect,
  onRetry,
  disabled,
}: Readonly<SeatMapProps>) {
  return (
    <section
      aria-labelledby="seat-map-heading"
      className="mb-(--space-6) border-b border-line pb-(--space-6)"
    >
      <h2 id="seat-map-heading" className="text-heading-m text-ink">
        Elige tu asiento
      </h2>

      {state.status === "loading" && (
        <Notice tone="info" className="mt-(--space-4)">
          Cargando asientos…
        </Notice>
      )}
      {state.status === "missing" && (
        <Notice tone="danger" className="mt-(--space-4)">
          No encontramos los asientos de este evento.
        </Notice>
      )}
      {state.status === "error" && (
        <Notice
          tone="danger"
          className="mt-(--space-4)"
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              disabled={disabled}
            >
              Reintentar
            </Button>
          }
        >
          No se pudieron cargar los asientos. Inténtalo de nuevo.
        </Notice>
      )}
      {state.status === "success" &&
        (state.seats.length === 0 ? (
          <p className="mt-(--space-4) text-body text-ink-muted">
            No hay asientos para este evento.
          </p>
        ) : (
          <>
            <ul className="mt-(--space-4) flex flex-wrap gap-(--space-4) text-body-s text-ink-muted">
              {legendStatuses.map((status) => {
                const { dot, label } = statusStyle(status);
                return (
                  <li
                    key={status}
                    className="flex items-center gap-(--space-2)"
                  >
                    <span
                      aria-hidden="true"
                      className={`size-2.5 rounded-(--radius-pill) ${dot}`}
                    />
                    {label}
                  </li>
                );
              })}
            </ul>

            <div
              role="radiogroup"
              aria-labelledby="seat-map-heading"
              className="mt-(--space-4) grid grid-cols-4 gap-(--space-3)"
            >
              {state.seats.map((seat) => {
                const style = statusStyle(seat.status);
                const isSelected = seat.ticketId === selectedSeat?.ticketId;
                const isAvailable =
                  !disabled && seat.status === SeatStatus.Available;

                return (
                  <label
                    key={seat.ticketId}
                    className={`flex cursor-pointer flex-col items-center gap-(--space-1) rounded-(--radius-md) border px-(--space-2) py-(--space-2) text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${style.tile} ${
                      isSelected
                        ? "ring-2 ring-brand ring-offset-2 ring-offset-surface-000"
                        : ""
                    } ${isAvailable ? "" : "cursor-not-allowed opacity-70"}`}
                  >
                    <input
                      type="radio"
                      name="seat"
                      value={seat.ticketId}
                      checked={isSelected}
                      disabled={!isAvailable}
                      aria-label={`${seat.seatNumber}, ${style.label}`}
                      onChange={() => onSelect(seat)}
                      className="sr-only"
                    />
                    <span className="text-mono-m">{seat.seatNumber}</span>
                    <span className="text-body-s">{style.label}</span>
                  </label>
                );
              })}
            </div>

            {selectedSeat && (
              <p
                role="status"
                className="mt-(--space-4) text-body font-semibold text-ink"
              >
                Asiento {selectedSeat.seatNumber} seleccionado.
              </p>
            )}
          </>
        ))}
    </section>
  );
}
