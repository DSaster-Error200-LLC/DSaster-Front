"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-brand-ink sm:text-5xl">
        Tus entradas favoritas,
        <br />
        <span className="text-brand-rust">sin dramas ni desastres.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-base text-brand-muted sm:text-lg">
        Descubre los mejores conciertos, festivales, teatro y deportes con
        compra protegida, precios transparentes y acceso inmediato en tu móvil.
      </p>

      <form className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-[0_20px_45px_-25px_rgba(27,27,42,0.35)] sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 px-3 py-2">
          <Image
            src="/search.svg"
            alt="Search Icon"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <input
            type="text"
            placeholder="Artista, festival, obra o recinto"
            className="w-full bg-transparent text-sm text-brand-ink placeholder:text-brand-muted focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-rust px-6 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-rust-dark"
          onClick={(e) => {
            e.preventDefault();
            alert("¡Función de búsqueda por implementar!");
          }}
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
