import { isAxiosError } from "axios";
import { eventsControllerFind, type EventPreview } from "@/api/search";

export type { EventPreview };
export type SearchEventsResult =
  | { readonly status: "missing" | "error" }
  | { readonly status: "success"; readonly events: readonly EventPreview[] };

export async function searchEvents(
  name: string,
  signal: AbortSignal,
): Promise<SearchEventsResult> {
  try {
    const events = await eventsControllerFind({ name }, { signal });
    return { status: "success", events };
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    return {
      status: status === 400 || status === 404 ? "missing" : "error",
    };
  }
}
