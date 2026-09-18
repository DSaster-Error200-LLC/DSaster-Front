import { Event } from "@/app/types/event";

interface EventRowProps {
  readonly event: Event;
}

export default function EventRow({ event }: Readonly<EventRowProps>) {
  const day = event.date.toLocaleDateString("es-ES", {
    day: "2-digit",
    timeZone: "UTC",
  });
  const month = event.date
    .toLocaleDateString("es-ES", { month: "short", timeZone: "UTC" })
    .replace(".", "");
  const time = event.date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });

  return (
    <article className="group relative flex flex-col items-start gap-4 py-6 transition-colors hover:bg-brand-rust/5 sm:flex-row sm:items-center sm:gap-8 sm:rounded-xl sm:px-4 sm:py-8">
      {/* Date block */}
      <div className="flex shrink-0 items-baseline gap-2 sm:w-28 sm:flex-col sm:items-start sm:gap-0">
        <span className="font-display text-3xl font-extrabold leading-none text-brand-ink sm:text-4xl">
          {day}
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-wider text-brand-rust">
          {month}
        </span>
        <span className="text-xs text-brand-muted sm:mt-1">{time}</span>
      </div>

      {/* Event Details */}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-bold tracking-tight text-brand-ink transition-colors group-hover:text-brand-rust sm:text-2xl">
          {event.name}
        </h3>
        <p className="mt-0.5 text-base text-brand-muted">{event.artist}</p>
      </div>

      {/* Venue & Action */}
      <div className="flex w-full shrink-0 items-center justify-between gap-4 pt-2 sm:w-auto sm:flex-col sm:items-end sm:pt-0">
        <span className="text-sm font-medium text-brand-ink/90 sm:text-right">
          {event.venue}
        </span>
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-rust opacity-0 transition-opacity group-hover:opacity-100 sm:mt-1"
        >
          Entradas
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}
