"use client";

import { Button, TextField } from "@dsaster/ui";

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
    <section className="mx-auto max-w-4xl px-(--space-4) py-(--space-8) text-center sm:px-(--space-5)">
      <h1 className="text-display-l uppercase text-ink sm:text-display-xl">
        Encuentra tus eventos
      </h1>
      <p className="mx-auto mt-(--space-4) max-w-xl text-body text-ink-muted">
        Conciertos, festivales, teatro y deportes. Busca por nombre y consigue
        tus entradas sin dramas ni desastres.
      </p>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="mx-auto mt-(--space-6) flex max-w-2xl flex-col gap-(--space-3) text-left sm:flex-row sm:items-end"
      >
        <TextField
          className="flex-1"
          type="search"
          icon="search"
          label="Nombre del evento"
          placeholder="Ej. Gira Mundial 2026"
          autoComplete="off"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
        <Button type="submit" icon="search" className="w-full sm:w-auto">
          Buscar
        </Button>
      </form>
    </section>
  );
}
