import EventSearch from "@/app/components/EventSearch";
import Navbar from "@/app/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <EventSearch />
    </main>
  );
}
