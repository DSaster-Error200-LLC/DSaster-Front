import { EventCard } from "@dsaster/ui";
import { EventPreview } from "@/api/search";
import { formatEventDate } from "@/app/lib/date";

interface EventRowProps {
  readonly event: EventPreview;
}

export default function EventRow({ event }: Readonly<EventRowProps>) {
  const { day, month, time } = formatEventDate(event.date);

  return (
    <EventCard
      layout="row"
      className="max-w-none"
      title={event.name}
      // The search API has no genre, so the artist takes the poster slot.
      category={event.artist}
      month={month}
      day={day}
      when={`${day} ${month} · ${time}`}
      venue={event.venueName}
      status="onsale"
      statusLabel="A la venta"
      fromLabel="desde"
      href={`/events/${event.id}`}
    />
  );
}
