import Link from "next/link";
import { Event } from "@/api/search";
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
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-ink"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Volver a eventos
        </Link>
      </div>

      <header className="mb-8 border-b border-brand-border pb-8">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
          {event.name}
        </h1>
        <p className="mt-3 text-xl text-brand-muted">{event.artist}</p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2">
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-muted">
              Fecha y hora
            </h2>
            <div className="flex items-baseline gap-3">
              <div className="flex flex-col">
                <span className="font-display text-5xl font-extrabold leading-none text-brand-ink">
                  {day}
                </span>
                <span className="font-display text-lg font-bold uppercase tracking-wider text-brand-rust">
                  {month}
                </span>
              </div>
              <span className="text-lg text-brand-muted">{time}</span>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-brand-muted">
              Lugar
            </h2>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-brand-ink">
                {event.venue.name}
              </p>
              <p className="text-base text-brand-muted">
                {event.venue.location}
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-start sm:justify-end">
          <button
            type="button"
            className="w-full rounded-xl bg-brand-rust px-8 py-4 font-display text-base font-semibold text-white transition-colors hover:bg-brand-rust-dark sm:w-auto"
            disabled
          >
            Comprar Ticket
          </button>
        </section>
      </div>
    </article>
  );
}
