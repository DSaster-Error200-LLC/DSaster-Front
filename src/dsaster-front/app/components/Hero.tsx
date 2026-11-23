"use client";

import { Button, Icon } from "@dsaster/ui";

interface HeroProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly onSearch: () => void;
}

export default function Hero({
  query,
  onQueryChange,
  onSearch,
}: Readonly<HeroProps>) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="text-display-l uppercase text-ink sm:text-display-xl">
        Ticket DSaster
        <br />
        <span className="text-brand-text">encuentra tus eventos</span>
      </h1>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-(--radius-lg) border border-line-strong bg-surface-100 p-2 transition-colors focus-within:border-brand sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-3 px-3 py-2">
          <Icon name="search" size={18} className="shrink-0 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
            placeholder="Nombre del evento"
            aria-label="Buscar eventos por nombre"
            className="w-full bg-transparent text-body text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </div>

        <Button type="submit" icon="search">
          Buscar
        </Button>
      </form>
    </section>
  );
}
