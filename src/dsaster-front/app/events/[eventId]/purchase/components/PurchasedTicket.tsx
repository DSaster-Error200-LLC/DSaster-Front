import type { ReactNode } from "react";
import { Badge } from "@dsaster/ui";
import type { Event } from "@/api/search";
import { formatEventDate } from "@/app/lib/date";

interface PurchasedTicketProps {
  readonly event: Event;
  readonly fullName: string;
  readonly seatNumber: string;
  readonly ticketCode: string;
}

interface TicketDetail {
  readonly label: string;
  readonly value: ReactNode;
  /** Seat and order codes are set in mono, like every other code. */
  readonly mono?: boolean;
}

export function PurchasedTicket({
  event,
  fullName,
  seatNumber,
  ticketCode,
}: Readonly<PurchasedTicketProps>) {
  const { day, month, time } = formatEventDate(event.date);
  const details: readonly TicketDetail[] = [
    { label: "Evento", value: event.name },
    { label: "Artista", value: event.artist },
    {
      label: "Fecha",
      value: (
        <time dateTime={event.date}>
          {day} {month}, {time}
        </time>
      ),
    },
    { label: "Recinto", value: event.venue.name },
    { label: "Asiento", value: seatNumber, mono: true },
    { label: "Titular", value: fullName },
  ];

  return (
    <section
      aria-labelledby="purchased-ticket-heading"
      className="mt-6 overflow-hidden rounded-(--radius-lg) border border-line bg-surface-100"
    >
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <h2 id="purchased-ticket-heading" className="text-heading-s text-ink">
          Tu ticket
        </h2>
        <Badge tone="success" icon="check">
          Confirmado
        </Badge>
      </div>

      <dl className="grid gap-4 border-t border-line px-6 py-6 sm:grid-cols-2">
        {details.map(({ label, value, mono }) => (
          <div key={label}>
            <dt className="text-label uppercase text-ink-muted">{label}</dt>
            <dd
              className={`mt-1 wrap-break-word text-ink ${
                mono ? "text-mono-m" : "text-body"
              }`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {/* The perforation: the stub below is what the buyer shows at the door. */}
      <div className="border-t-2 border-dashed border-line-strong px-6 py-4">
        <p className="text-label uppercase text-ink-muted">Código del ticket</p>
        <p className="mt-1 break-all text-mono-m text-ink">{ticketCode}</p>
      </div>
    </section>
  );
}
