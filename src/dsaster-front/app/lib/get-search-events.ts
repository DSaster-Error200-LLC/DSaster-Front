import { eventsControllerFind, type EventPreview } from "@/api/search";

export type { EventPreview };
export type SearchEventsResult =
  | { readonly status: "error" }
  | { readonly status: "success"; readonly events: readonly EventPreview[] };

export async function searchEvents(
  name: string,
  signal: AbortSignal,
): Promise<SearchEventsResult> {
  try {
    const events = await eventsControllerFind({ name }, { signal });
    return { status: "success", events };
  } catch {
    return {
      status: "error",
    };
  }
}
