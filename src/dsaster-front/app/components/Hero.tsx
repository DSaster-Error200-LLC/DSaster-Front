"use client";

import Image from "next/image";

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
      <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-brand-ink sm:text-5xl">
        TicketDsaster
        <br />
        <span className="text-brand-rust">encuentra tus eventos</span>
      </h1>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-full border border-brand-border bg-white p-2 shadow-[0_20px_45px_-25px_rgba(27,27,42,0.35)] transition-shadow focus-within:shadow-[0_20px_45px_-20px_rgba(27,27,42,0.45)] sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-3 px-3 py-2">
          <Image
            src="/search.svg"
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
            placeholder="Nombre del evento"
            aria-label="Buscar eventos por nombre"
            className="w-full bg-transparent text-base text-brand-ink placeholder:text-brand-muted focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-full bg-brand-rust px-7 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-rust-dark"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Buscar
        </button>
      </form>
    </section>
  );
}
