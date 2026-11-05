"use client";

import { useEffect, useState } from "react";
import { Button, Notice } from "@dsaster/ui";
import Navbar from "@/app/components/Navbar";
import EventDetails from "@/app/events/[eventId]/EventDetails";
import EventNotFound from "@/app/events/[eventId]/not-found";
import PurchaseDetails from "@/app/events/[eventId]/purchase/PurchaseDetails";
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
        <div className="mx-auto max-w-4xl px-(--space-4) py-(--space-6) sm:px-(--space-5)">
          <Notice tone="info">Cargando evento…</Notice>
        </div>
      )}
      {state.status === "error" && (
        <div className="mx-auto max-w-4xl px-(--space-4) py-(--space-6) sm:px-(--space-5)">
          <Notice
            tone="danger"
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setState({ status: "loading" });
                  setAttempt((previous) => previous + 1);
                }}
              >
                Reintentar
              </Button>
            }
          >
            No se pudo cargar el evento. Inténtalo de nuevo.
          </Notice>
        </div>
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
