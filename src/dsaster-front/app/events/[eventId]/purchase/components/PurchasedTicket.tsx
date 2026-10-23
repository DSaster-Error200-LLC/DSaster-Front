import type { Event } from "@/api/search";
import { formatEventDate } from "@/app/lib/date";

interface PurchasedTicketProps {
  readonly event: Event;
  readonly fullName: string;
  readonly ticketCode: string;
}

export function PurchasedTicket({
  event,
  fullName,
  ticketCode,
}: Readonly<PurchasedTicketProps>) {
  const { day, month, time } = formatEventDate(event.date);
  const details = [
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
    { label: "Titular", value: fullName },
  ];

  return (
    <section
      aria-labelledby="purchased-ticket-heading"
      className="mt-6 overflow-hidden rounded-2xl border border-brand-border bg-white"
    >
      <h2
        id="purchased-ticket-heading"
        className="bg-brand-maroon px-6 py-5 font-display text-2xl font-bold text-white"
      >
        Tu ticket
      </h2>

      <dl className="grid gap-4 px-6 py-6 sm:grid-cols-2">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-brand-muted">{label}</dt>
            <dd className="wrap-break-word font-medium text-brand-ink">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-dashed border-brand-border px-6 py-5">
        <p className="text-sm text-brand-muted">Código del ticket</p>
        <p className="break-all font-mono text-lg font-semibold text-brand-ink">
          {ticketCode}
        </p>
      </div>
    </section>
  );
}
