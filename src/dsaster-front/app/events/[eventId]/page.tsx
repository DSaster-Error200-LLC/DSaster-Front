import EventContent from "@/app/events/[eventId]/EventContent";

interface EventPageProps {
  readonly params: Promise<{ readonly eventId: string }>;
}

export default async function EventPage({ params }: Readonly<EventPageProps>) {
  const { eventId } = await params;
  return <EventContent key={eventId} eventId={eventId} view="details" />;
}
