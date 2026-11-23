import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wordmark } from "./Wordmark";

const meta = {
  title: "Core/Wordmark",
  component: Wordmark,
  tags: ["autodocs"],
  args: { size: "md" },
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {};

export const Hero: Story = {
  args: { size: "lg" },
};

export const AppBar: Story = {
  args: { size: "sm" },
};
