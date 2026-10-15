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
      className="mx-auto max-w-4xl px-6 py-12 sm:py-16"
    >
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <h2
            id="events-heading"
            className="font-display text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl"
          >
            Próximos Eventos
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Resultados para «{searchedName}»
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium text-brand-muted">
          {events.length} {events.length === 1 ? "evento" : "eventos"}
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-lg text-brand-muted">
          No se encontraron eventos para mostrar.
        </p>
      ) : (
        <ul className="divide-y divide-brand-border">
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
