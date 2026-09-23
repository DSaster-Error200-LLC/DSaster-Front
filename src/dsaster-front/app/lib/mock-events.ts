import { Event } from "@/api/search";

export const mockEvents: readonly Event[] = [
  {
    id: "1",
    name: "Gira Mundial 2026",
    artist: "Rosalía",
    date: "2026-10-15T21:00:00Z",
    venue: {
      name: "WiZink Center",
      location: "Madrid",
    },
  },
  {
    id: "2",
    name: "The Eras Tour",
    artist: "Taylor Swift",
    date: "2026-11-20T19:30:00Z",
    venue: {
      name: "Estadio Santiago Bernabéu",
      location: "Madrid",
    },
  },
  {
    id: "3",
    name: "Concierto Acústico",
    artist: "C. Tangana",
    date: "2026-12-05T20:00:00Z",
    venue: {
      name: "Palau Sant Jordi",
      location: "Barcelona",
    },
  },
];
