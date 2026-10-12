import { eventsControllerFind, type EventPreview } from "@/api/search";

export type { EventPreview };

export async function searchEvents(name: string): Promise<EventPreview[]> {
  return eventsControllerFind({ name });
}
