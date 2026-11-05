import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EventCard } from "./EventCard";

const meta = {
  title: "Ticketing/EventCard",
  component: EventCard,
  tags: ["autodocs"],
  args: {
    title: "Riot Hymns: Arena Tour 2027",
    month: "Mar",
    day: 12,
    when: "Fri 12 Mar · 20:00",
    venue: "Palau Sant Jordi, Barcelona",
    category: "Rock",
    priceFrom: 55,
    status: "onsale",
    layout: "stack",
  },
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnSale: Story = {
  args: { onSelect: fn() },
};

export const FewLeft: Story = {
  args: { status: "low", onSelect: fn() },
};

export const SoldOut: Story = {
  args: {
    title: "Static Wolves + Grave Lilies",
    month: "Nov",
    day: 21,
    when: "Sat 21 Nov · 21:30",
    venue: "Sala Razzmatazz, Barcelona",
    category: "Punk",
    priceFrom: 22,
    status: "soldout",
  },
};

export const ComingSoon: Story = {
  args: { status: "soon", priceFrom: undefined, category: "Metal" },
};

export const LinkedTitle: Story = {
  args: { href: "#riot-hymns" },
};

export const Row: Story = {
  args: { layout: "row", status: "low", onSelect: fn() },
};

export const Translated: Story = {
  args: {
    statusLabel: "A la venta",
    fromLabel: "desde",
    cta: "Entradas",
    locale: "es-ES",
    onSelect: fn(),
  },
};
