"use client";

import { useEffect, useRef, useState } from "react";
import { Notice } from "@dsaster/ui";
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
  const [searchedName, setSearchedName] = useState("");
  const [state, setState] = useState<SearchState>({ status: "idle" });
  const requestControllerRef = useRef<AbortController | null>(null);

  const findEvents = (name: string) => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setState({ status: "loading" });
    setSearchedName(name);

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

  return (
    <>
      <Hero
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
      />
      <div aria-live="polite" aria-busy={state.status === "loading"}>
        {state.status === "loading" && (
          <div className="mx-auto max-w-4xl px-(--space-4) pb-(--space-6) sm:px-(--space-5)">
            <Notice tone="info">Buscando eventos...</Notice>
          </div>
        )}
        {state.status === "error" && (
          <div className="mx-auto max-w-4xl px-(--space-4) pb-(--space-6) sm:px-(--space-5)">
            <Notice tone="danger" title="No fue posible buscar eventos.">
              Inténtalo de nuevo.
            </Notice>
          </div>
        )}
        {state.status === "success" && (
          <EventList events={state.events} searchedName={searchedName} />
        )}
      </div>
    </>
  );
}
