import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { QuantityStepper } from "./QuantityStepper";

const meta = {
  title: "Ticketing/QuantityStepper",
  component: QuantityStepper,
  tags: ["autodocs"],
  args: { label: "Pit standing tickets", min: 0, max: 4, onChange: fn() },
} satisfies Meta<typeof QuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: 2 },
};

export const AtLimit: Story = {
  args: { defaultValue: 4 },
};

export const Small: Story = {
  args: { size: "sm", defaultValue: 1 },
};

export const Disabled: Story = {
  args: { defaultValue: 1, disabled: true },
};

export const Translated: Story = {
  args: {
    label: "Entradas de pista",
    decrementLabel: "Quitar una",
    incrementLabel: "Añadir una",
    defaultValue: 1,
  },
};
