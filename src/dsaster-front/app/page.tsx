import EventList from "@/app/components/EventList";
import Hero from "@/app/components/Hero";
import Navbar from "@/app/components/Navbar";
import { mockEvents } from "@/app/lib/mock-events";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <Navbar />
      <Hero />
      <EventList events={mockEvents} />
    </main>
  );
}
