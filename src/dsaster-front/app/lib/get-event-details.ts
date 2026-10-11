import { isAxiosError } from "axios";
import { eventsControllerGetDetails, type Event } from "@/api/search";

export type GetEventDetailsResult =
  | { readonly status: "missing" | "error" }
  | { readonly status: "success"; readonly event: Event };

export async function getEventDetails(
  eventId: string,
  signal: AbortSignal,
): Promise<GetEventDetailsResult> {
  try {
    const event = await eventsControllerGetDetails(eventId, { signal });
    return { status: "success", event };
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    return {
      status: status === 400 || status === 404 ? "missing" : "error",
    };
  }
}
