import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function EventNotFound() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-brand-rust">
          Error 404
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
          Evento no encontrado
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-brand-muted sm:text-lg">
          El evento que buscas no existe o ya no está disponible.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-xl bg-brand-rust px-8 py-4 font-display text-base font-semibold text-white transition-colors hover:bg-brand-rust-dark"
        >
          Ver todos los eventos
        </Link>
      </section>
    </main>
  );
}
