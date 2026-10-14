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
  const [searchedName, setSearchedName] = useState("");
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
    setSearchedName(name);
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
          <p className="px-6 pb-8 text-center text-brand-muted">
            Buscando eventos...
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="px-6 pb-8 text-center text-brand-rust">
            No fue posible buscar eventos. Inténtalo de nuevo.
          </p>
        )}
        {state.status === "success" && (
          <EventList
            events={state.status === "success" ? state.events : []}
            searchedName={searchedName}
          />
        )}
      </div>
    </>
  );
}
