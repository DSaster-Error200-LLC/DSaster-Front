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
    <article className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-(--radius-sm) text-body-s font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Icon name="chevron-left" size={16} />
          Volver a eventos
        </Link>
      </div>

      <header className="mb-8 border-b border-line pb-8">
        <h1 className="wrap-break-word text-display-l uppercase text-ink">
          {event.name}
        </h1>
        <p className="mt-3 text-heading-s text-ink-muted">{event.artist}</p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2">
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-label uppercase text-ink-muted">
              Fecha y hora
            </h2>
            <div className="flex items-baseline gap-3">
              <div className="flex flex-col">
                <span className="font-display text-5xl leading-none text-ink">
                  {day}
                </span>
                <span className="text-heading-s uppercase text-brand-text">
                  {month}
                </span>
              </div>
              <span className="text-mono-m text-ink-muted">{time}</span>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-label uppercase text-ink-muted">Lugar</h2>
            <div className="space-y-1">
              <p className="text-heading-s text-ink">{event.venue.name}</p>
              <p className="text-body text-ink-muted">{event.venue.location}</p>
            </div>
          </div>
        </section>

        <section className="flex items-start sm:justify-end">
          <ButtonLink
            href={`/events/${event.id}/purchase`}
            size="lg"
            block
            className="sm:max-w-sm"
          >
            Seleccionar Asiento
          </ButtonLink>
        </section>
      </div>
    </article>
  );
}
