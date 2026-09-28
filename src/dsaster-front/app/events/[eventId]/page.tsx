import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import EventDetails from "./EventDetails";
import { mockEvents } from "@/app/lib/mock-events";

interface EventPageProps {
  readonly params: Promise<{ eventId: string }>;
}

export default async function EventPage({ params }: Readonly<EventPageProps>) {
  const { eventId } = await params;
  const event = mockEvents.find((e) => e.id === eventId);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-bg">
      <Navbar />
      <EventDetails event={event} />
    </main>
  );
}
