import { EventPreview } from "@/api/search";
import EventRow from "@/app/components/EventRow";

interface EventListProps {
  readonly events: readonly EventPreview[];
  readonly searchedName: string;
}

export default function EventList({
  events,
  searchedName,
}: Readonly<EventListProps>) {
  return (
    <section
      aria-labelledby="events-heading"
      className="mx-auto max-w-4xl px-(--space-4) py-(--space-6) sm:px-(--space-5) sm:py-(--space-7)"
    >
      <div className="mb-(--space-5) flex items-baseline justify-between gap-(--space-4) border-b border-line pb-(--space-4)">
        <div>
          <h2 id="events-heading" className="text-heading-m text-ink">
            Próximos Eventos
          </h2>
          <p className="mt-(--space-1) text-body-s text-ink-muted">
            Resultados para «{searchedName}»
          </p>
        </div>
        <span className="shrink-0 text-mono-s text-ink-muted">
          {events.length} {events.length === 1 ? "evento" : "eventos"}
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-body text-ink-muted">
          No se encontraron eventos para mostrar.
        </p>
      ) : (
        <ul className="grid gap-(--space-5)">
          {events.map((event) => (
            <li key={event.id}>
              <EventRow event={event} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
