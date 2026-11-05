import Link from "next/link";
import { Icon } from "@dsaster/ui";
import { Event } from "@/api/search";
import ButtonLink from "@/app/components/ButtonLink";
import { formatEventDate } from "@/app/lib/date";

interface EventDetailsProps {
  readonly event: Event;
}

export default function EventDetails({ event }: Readonly<EventDetailsProps>) {
  const { day, month, time } = formatEventDate(event.date);

  return (
    <article className="mx-auto max-w-4xl px-(--space-4) py-(--space-6) sm:px-(--space-5) sm:py-(--space-7)">
      <Link
        href="/"
        className="inline-flex items-center gap-(--space-1) rounded-(--radius-sm) text-body-s font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <Icon name="chevron-left" size={16} />
        Volver a eventos
      </Link>

      <header className="mt-(--space-5) border-b border-line pb-(--space-6)">
        <h1 className="wrap-break-word text-display-l text-ink">
          {event.name}
        </h1>
        <p className="mt-(--space-3) text-heading-s text-ink-muted">
          {event.artist}
        </p>
      </header>

      <div className="mt-(--space-6) grid gap-(--space-6) sm:grid-cols-2">
        <section className="grid gap-(--space-5)">
          <div>
            <h2 className="text-label uppercase text-ink-muted">
              Fecha y hora
            </h2>
            <div className="mt-(--space-3) flex items-center gap-(--space-3)">
              <div className="grid min-w-12 justify-items-center rounded-(--radius-md) bg-brand px-(--space-2) py-(--space-1) text-on-brand">
                <span className="text-label uppercase">{month}</span>
                <span className="text-display-numeral">{day}</span>
              </div>
              <span className="text-mono-m text-ink">{time}</span>
            </div>
          </div>

          <div>
            <h2 className="text-label uppercase text-ink-muted">Lugar</h2>
            <p className="mt-(--space-2) text-heading-s text-ink">
              {event.venue.name}
            </p>
            <p className="text-body text-ink-muted">{event.venue.location}</p>
          </div>
        </section>

        <section className="flex items-start sm:justify-end">
          <ButtonLink
            href={`/events/${event.id}/purchase`}
            size="lg"
            block
            iconRight="chevron-right"
            className="sm:max-w-sm"
          >
            Seleccionar Asiento
          </ButtonLink>
        </section>
      </div>
    </article>
  );
}
