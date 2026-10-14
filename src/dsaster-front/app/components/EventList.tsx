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
      <div className="mb-8 flex items-baseline justify-between border-b border-brand-border pb-4">
        <h2
          id="events-heading"
          className="font-display text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl"
        >
          Próximos Eventos
        </h2>
        <span className="text-sm font-medium text-orange-700">
          {`${events.length} ${events.length === 1 ? "evento" : "eventos"} para la búsqueda "${searchedName}"`}{" "}
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
