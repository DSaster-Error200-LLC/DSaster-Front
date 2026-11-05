import ButtonLink from "@/app/components/ButtonLink";
import Navbar from "@/app/components/Navbar";

export default function EventNotFound() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-4xl px-(--space-4) py-(--space-8) text-center sm:px-(--space-5)">
        <p className="text-label uppercase text-ink-muted">Error 404</p>
        <h1 className="mt-(--space-3) text-display-l text-ink">
          Evento no encontrado
        </h1>
        <p className="mx-auto mt-(--space-5) max-w-xl text-body text-ink-muted">
          El evento que buscas no existe o ya no está disponible.
        </p>
        <div className="mt-(--space-6) flex justify-center">
          <ButtonLink href="/" iconRight="chevron-right">
            Ver todos los eventos
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
