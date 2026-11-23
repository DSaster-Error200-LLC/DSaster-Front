import Navbar from "@/app/components/Navbar";
import ButtonLink from "@/app/components/ButtonLink";

export default function EventNotFound() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-label uppercase text-brand-text">Error 404</p>
        <h1 className="mt-3 text-display-l uppercase text-ink">
          Evento no encontrado
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-body text-ink-muted">
          El evento que buscas no existe o ya no está disponible.
        </p>
        <ButtonLink href="/" size="lg" className="mt-10">
          Ver todos los eventos
        </ButtonLink>
      </section>
    </main>
  );
}
