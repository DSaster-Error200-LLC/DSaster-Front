"use client";

import { useEffect, useState } from "react";
import { Button } from "@dsaster/ui";
import Navbar from "@/app/components/Navbar";
import EventDetails from "@/app/events/[eventId]/EventDetails";
import EventNotFound from "@/app/events/[eventId]/not-found";
import Checkout from "@/app/events/[eventId]/purchase/Checkout";
import {
  getEventDetails,
  type GetEventDetailsResult,
} from "@/app/lib/get-event-details";

interface EventContentProps {
  readonly eventId: string;
  readonly view: "details" | "purchase";
}

type EventState = { readonly status: "loading" } | GetEventDetailsResult;

export default function EventContent({
  eventId,
  view,
}: Readonly<EventContentProps>) {
  const [state, setState] = useState<EventState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    void getEventDetails(eventId, controller.signal).then((result) => {
      if (!controller.signal.aborted) setState(result);
    });

    return () => controller.abort();
  }, [eventId, attempt]);

  if (state.status === "missing") return <EventNotFound />;

  return (
    <main lang="es" className="min-h-screen">
      <Navbar />
      {state.status === "loading" && (
        <p
          role="status"
          className="mx-auto max-w-4xl px-6 py-12 text-center text-body text-ink-muted"
        >
          Cargando evento…
        </p>
      )}
      {state.status === "error" && (
        <section className="mx-auto max-w-4xl px-6 py-12 text-center">
          <p role="alert" className="text-body text-ink">
            No se pudo cargar el evento. Inténtalo de nuevo.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((previous) => previous + 1);
            }}
          >
            Reintentar
          </Button>
        </section>
      )}
      {state.status === "success" &&
        (view === "details" ? (
          <EventDetails event={state.event} />
        ) : (
          <Checkout event={state.event} />
        ))}
    </main>
  );
}
