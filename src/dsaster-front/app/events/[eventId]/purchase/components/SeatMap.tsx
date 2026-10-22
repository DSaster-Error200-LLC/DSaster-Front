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

function statusStyle(status: SeatStatus): SeatStatusStyle {
  switch (status) {
    case SeatStatus.Available:
      return {
        label: "Disponible",
        dot: "bg-emerald-500",
        tile: "border-emerald-500 bg-emerald-50 text-emerald-700",
      };
    case SeatStatus.Reserved:
      return {
        label: "Reservado",
        dot: "bg-amber-500",
        tile: "border-amber-500 bg-amber-50 text-amber-700",
      };
    case SeatStatus.Sold:
      return {
        label: "Vendido",
        dot: "bg-rose-500",
        tile: "border-rose-500 bg-rose-50 text-rose-700",
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
      className="mb-8 border-b border-brand-border pb-8"
    >
      <h2
        id="seat-map-heading"
        className="font-display text-2xl font-bold text-brand-ink"
      >
        Elige tu asiento
      </h2>

      {state.status === "loading" && (
        <p role="status" className="mt-4 text-brand-muted">
          Cargando asientos…
        </p>
      )}
      {state.status === "missing" && (
        <p role="alert" className="mt-4 text-brand-muted">
          No encontramos los asientos de este evento.
        </p>
      )}
      {state.status === "error" && (
        <div className="mt-4">
          <p role="alert" className="text-brand-maroon">
            No se pudieron cargar los asientos. Inténtalo de nuevo.
          </p>
          <button
            type="button"
            onClick={onRetry}
            disabled={disabled}
            className="mt-4 rounded-xl bg-brand-rust px-6 py-3 font-display font-semibold text-white transition-colors hover:bg-brand-rust-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-rust"
          >
            Reintentar
          </button>
        </div>
      )}
      {state.status === "success" &&
        (state.seats.length === 0 ? (
          <p className="mt-4 text-brand-muted">
            No hay asientos para este evento.
          </p>
        ) : (
          <>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm text-brand-muted">
              {legendStatuses.map((status) => {
                const { dot, label } = statusStyle(status);
                return (
                  <li key={status} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`size-2.5 rounded-full ${dot}`}
                    />
                    {label}
                  </li>
                );
              })}
            </ul>

            <div
              role="radiogroup"
              aria-labelledby="seat-map-heading"
              className="mt-4 grid grid-cols-4 gap-3"
            >
              {state.seats.map((seat) => {
                const style = statusStyle(seat.status);
                const isSelected = seat.ticketId === selectedSeat?.ticketId;
                const isAvailable =
                  !disabled && seat.status === SeatStatus.Available;

                return (
                  <label
                    key={seat.ticketId}
                    className={`flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-rust ${style.tile} ${
                      isSelected ? "ring-2 ring-brand-rust ring-offset-2" : ""
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
                    <span className="font-display text-sm font-bold">
                      {seat.seatNumber}
                    </span>
                    <span className="text-xs">{style.label}</span>
                  </label>
                );
              })}
            </div>

            {selectedSeat && (
              <p
                role="status"
                className="mt-4 text-sm font-medium text-brand-ink"
              >
                Asiento {selectedSeat.seatNumber} seleccionado.
              </p>
            )}
          </>
        ))}
    </section>
  );
}
