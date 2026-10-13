"use client";

import { useEffect, useRef, useState } from "react";
import EventList from "@/app/components/EventList";
import Hero from "@/app/components/Hero";
import {
  searchEvents,
  type SearchEventsResult,
} from "@/app/lib/get-search-events";

type SearchState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | SearchEventsResult;

export default function EventSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const requestControllerRef = useRef<AbortController | null>(null);

  const findEvents = (name: string) => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setState({ status: "loading" });

    void searchEvents(name, controller.signal).then((result) => {
      if (!controller.signal.aborted) {
        setState(result);
      }
    });
  };

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
  };

  const handleSearch = () => {
    const name = query.trim();
    if (name) {
      findEvents(name);
    }
  };

  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
    },
    [],
  );

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <Hero
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
      />
      <div aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "idle" && !hasQuery && (
          <p className="px-6 pb-8 text-center text-brand-muted">
            Escribe el nombre de un evento para ver resultados.
          </p>
        )}
        {state.status === "loading" && (
          <p className="px-6 pb-8 text-center text-brand-muted">
            Buscando eventos...
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="px-6 pb-8 text-center text-brand-rust">
            <span>No fue posible buscar eventos. Inténtalo de nuevo.</span>
            <button
              type="button"
              onClick={handleSearch}
              className="ml-2 font-semibold underline"
            >
              Reintentar
            </button>
          </p>
        )}
        {(state.status === "success" || state.status === "missing") && (
          <EventList events={state.status === "success" ? state.events : []} />
        )}
      </div>
    </>
  );
}
