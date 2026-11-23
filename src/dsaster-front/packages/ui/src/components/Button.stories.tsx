import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";
import { ICON_NAMES } from "./internal/icons";

const meta = {
  title: "Core/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Get tickets",
    variant: "primary",
    size: "md",
    block: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    icon: { control: "select", options: [undefined, ...ICON_NAMES] },
    iconRight: { control: "select", options: [undefined, ...ICON_NAMES] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { icon: "ticket" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Add to calendar" },
};

export const Ghost: Story = {
  args: { variant: "ghost", icon: "heart", children: "Save" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Release tickets" },
};

export const Large: Story = {
  args: {
    size: "lg",
    iconRight: "chevron-right",
    children: "Continue to payment",
  },
};

export const Small: Story = {
  args: { size: "sm", variant: "secondary", children: "Edit" },
};

export const Block: Story = {
  args: { size: "lg", block: true, children: "Pay €110.00" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Sold out" },
};
