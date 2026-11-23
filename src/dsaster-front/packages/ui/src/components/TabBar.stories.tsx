import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TabBar } from "./TabBar";

const meta = {
  title: "Ticketing/TabBar",
  component: TabBar,
  tags: ["autodocs"],
  args: {
    items: [
      { id: "discover", label: "Discover", icon: "house" },
      { id: "search", label: "Search", icon: "search" },
      { id: "tickets", label: "Tickets", icon: "ticket", badge: 2 },
      { id: "account", label: "Account", icon: "user" },
    ],
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 390 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TicketsActive: Story = {
  args: { defaultValue: "tickets" },
};

export const Controlled: Story = {
  args: { value: "search" },
};
