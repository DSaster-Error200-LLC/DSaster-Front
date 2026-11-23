import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { ICON_NAMES } from "./internal/icons";

const meta = {
  title: "Status/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Seated", tone: "neutral" },
  argTypes: {
    icon: { control: "select", options: [undefined, ...ICON_NAMES] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Brand: Story = {
  args: { tone: "brand", children: "Presale" },
};

export const OnSale: Story = {
  args: { tone: "success", icon: "check", children: "On sale" },
};

export const FewLeft: Story = {
  args: { tone: "warning", icon: "triangle-alert", children: "Few left" },
};

export const SoldOut: Story = {
  args: { tone: "danger", icon: "x", children: "Sold out" },
};
