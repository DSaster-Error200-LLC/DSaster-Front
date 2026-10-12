"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type EventPreview } from "@/api/search";
import EventList from "@/app/components/EventList";
import Hero from "@/app/components/Hero";
import { searchEvents } from "@/app/lib/search-events";

export default function EventSearch() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<readonly EventPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const requestIdRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findEvents = useCallback(async (name: string) => {
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);
    setHasError(false);

    try {
      const results = await searchEvents(name);
      if (currentRequestId === requestIdRef.current) {
        setEvents(results);
      }
    } catch {
      if (currentRequestId === requestIdRef.current) {
        setEvents([]);
        setHasError(true);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleQueryChange = useCallback(
    (nextQuery: string) => {
      requestIdRef.current += 1;
      setQuery(nextQuery);
      setEvents([]);
      setHasError(false);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const name = nextQuery.trim();
      if (!name) {
        setIsLoading(false);
        debounceTimerRef.current = null;
        return;
      }

      setIsLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        void findEvents(name);
      }, 300);
    },
    [findEvents],
  );

  const handleSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const name = query.trim();
    if (name) {
      void findEvents(name);
    }
  }, [findEvents, query]);

  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      requestIdRef.current += 1;
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
      <div aria-live="polite" aria-busy={isLoading}>
        {!hasQuery && (
          <p className="px-6 pb-8 text-center text-brand-muted">
            Escribe el nombre de un evento para ver resultados.
          </p>
        )}
        {hasQuery && isLoading && (
          <p className="px-6 pb-8 text-center text-brand-muted">
            Buscando eventos...
          </p>
        )}
        {hasQuery && !isLoading && hasError && (
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
        {hasQuery && !isLoading && !hasError && <EventList events={events} />}
      </div>
    </>
  );
}
