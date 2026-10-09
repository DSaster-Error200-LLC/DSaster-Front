"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { eventsControllerGetDetails, type Event } from "@/api/search";
import Navbar from "@/app/components/Navbar";
import EventDetails from "@/app/events/[eventId]/EventDetails";
import EventNotFound from "@/app/events/[eventId]/not-found";
import PurchaseDetails from "@/app/events/[eventId]/purchase/PurchaseDetails";

interface EventContentProps {
  readonly eventId: string;
  readonly view: "details" | "purchase";
}

type EventState =
  | { readonly status: "loading" | "missing" | "error" }
  | { readonly status: "success"; readonly event: Event };

export default function EventContent({
  eventId,
  view,
}: Readonly<EventContentProps>) {
  const [state, setState] = useState<EventState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    void eventsControllerGetDetails(eventId, { signal: controller.signal })
      .then((event) => {
        if (!controller.signal.aborted) setState({ status: "success", event });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const status = isAxiosError(error) ? error.response?.status : undefined;
        setState({
          status: status === 400 || status === 404 ? "missing" : "error",
        });
      });

    return () => controller.abort();
  }, [eventId, attempt]);

  if (state.status === "missing") return <EventNotFound />;

  return (
    <main lang="es" className="min-h-screen bg-brand-bg">
      <Navbar />
      {state.status === "loading" && (
        <p
          role="status"
          className="mx-auto max-w-4xl px-6 py-12 text-center text-brand-muted"
        >
          Cargando evento…
        </p>
      )}
      {state.status === "error" && (
        <section className="mx-auto max-w-4xl px-6 py-12 text-center">
          <p role="alert" className="text-brand-ink">
            No se pudo cargar el evento. Inténtalo de nuevo.
          </p>
          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((previous) => previous + 1);
            }}
            className="mt-6 rounded-xl bg-brand-rust px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-brand-rust-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-rust"
          >
            Reintentar
          </button>
        </section>
      )}
      {state.status === "success" &&
        (view === "details" ? (
          <EventDetails event={state.event} />
        ) : (
          <PurchaseDetails event={state.event} />
        ))}
    </main>
  );
}
