import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { IconButton } from "./IconButton";
import { ICON_NAMES } from "./internal/icons";

const meta = {
  title: "Core/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    icon: "chevron-left",
    label: "Back",
    variant: "ghost",
    onClick: fn(),
  },
  argTypes: {
    icon: { control: "select", options: ICON_NAMES },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};

export const Secondary: Story = {
  args: { icon: "x", label: "Close", variant: "secondary" },
};

export const Pressed: Story = {
  args: { icon: "heart", label: "Saved", pressed: true },
};

export const Disabled: Story = {
  args: { icon: "search", label: "Search", disabled: true },
};
