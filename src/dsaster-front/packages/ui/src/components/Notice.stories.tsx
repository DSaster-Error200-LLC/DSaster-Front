import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { Notice } from "./Notice";

const meta = {
  title: "Status/Notice",
  component: Notice,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    title: "Doors 19:00",
    children: "Support act at 20:00. Bring the QR code on your phone.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Tickets held for 9:42",
    children:
      "Finish checkout before the timer runs out or your tickets go back on sale.",
  },
};

export const Success: Story = {
  args: {
    tone: "success",
    title: "You’re going!",
    children:
      "Your tickets are in the Tickets tab and on their way to ana@example.com.",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
    title: "Payment didn’t go through",
    children:
      "Your bank declined the card. Try another card. Your tickets are still held.",
    action: (
      <Button size="sm" variant="secondary">
        Try another card
      </Button>
    ),
  },
};
