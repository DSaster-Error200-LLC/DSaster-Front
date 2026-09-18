import { Event } from "@/app/types/event";

export const mockEvents: Event[] = [
  {
    id: "1",
    name: "Gira Mundial 2026",
    artist: "Rosalía",
    date: new Date("2026-10-15T21:00:00Z"),
    venue: "WiZink Center, Madrid",
  },
  {
    id: "2",
    name: "The Eras Tour",
    artist: "Taylor Swift",
    date: new Date("2026-11-20T19:30:00Z"),
    venue: "Estadio Santiago Bernabéu, Madrid",
  },
  {
    id: "3",
    name: "Concierto Acústico",
    artist: "C. Tangana",
    date: new Date("2026-12-05T20:00:00Z"),
    venue: "Palau Sant Jordi, Barcelona",
  },
];
