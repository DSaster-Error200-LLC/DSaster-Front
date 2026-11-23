import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta = {
  title: "Forms/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "Promo code" },
  decorators: [
    (Story) => (
      <div style={{ width: 340 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  args: { hint: "Optional. Codes are case-insensitive." },
};

export const Search: Story = {
  args: {
    label: "Search events",
    placeholder: "Band, venue or city",
    icon: "search",
  },
};

export const WithError: Story = {
  args: {
    label: "Email for your tickets",
    type: "email",
    defaultValue: "ana@",
    error: "Enter a full email address, like ana@example.com",
  },
};

export const Disabled: Story = {
  args: { label: "Order number", defaultValue: "ORD-7Q4K-21", disabled: true },
};
