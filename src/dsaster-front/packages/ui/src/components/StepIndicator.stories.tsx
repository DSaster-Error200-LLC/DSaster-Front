import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepIndicator } from "./StepIndicator";

const meta = {
  title: "Ticketing/StepIndicator",
  component: StepIndicator,
  tags: ["autodocs"],
  args: { steps: ["Tickets", "Details", "Payment", "Done"], current: 1 },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = {
  args: { current: 0 },
};

export const MidWay: Story = {};

export const Done: Story = {
  args: { current: 3 },
};

export const Translated: Story = {
  args: {
    steps: ["Entradas", "Datos", "Pago", "Listo"],
    current: 2,
    label: "Progreso de la compra",
    completedLabel: "(completado)",
  },
};
