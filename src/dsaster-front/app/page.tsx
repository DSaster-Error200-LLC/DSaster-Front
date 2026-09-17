import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <Navbar />
      <Hero />
    </main>
  );
}
