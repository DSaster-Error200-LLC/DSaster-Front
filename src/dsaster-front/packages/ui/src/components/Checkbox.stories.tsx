import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { label: "Add ticket insurance", onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};

export const WithDescription: Story = {
  args: {
    description: "€2.50 per ticket. Refund if you can’t make it.",
  },
};

export const Checked: Story = {
  args: { label: "Email me about this tour", defaultChecked: true },
};

export const Disabled: Story = {
  args: {
    label: "Members presale",
    description: "Sign in to use it",
    disabled: true,
  },
};
