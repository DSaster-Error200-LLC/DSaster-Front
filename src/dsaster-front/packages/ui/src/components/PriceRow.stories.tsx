import type { Meta, StoryObj } from "@storybook/react-vite";
import { PriceRow } from "./PriceRow";

const meta = {
  title: "Ticketing/PriceRow",
  component: PriceRow,
  tags: ["autodocs"],
  args: { label: "General admission", amount: 45, quantity: 2 },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PriceRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};

export const Fee: Story = {
  args: {
    label: "Booking fee",
    sublabel: "€2.50 per ticket",
    amount: 5,
    quantity: undefined,
    kind: "fee",
  },
};

export const Discount: Story = {
  args: {
    label: "Early bird",
    amount: 10,
    quantity: undefined,
    kind: "discount",
  },
};

export const Free: Story = {
  args: { label: "Delivery", amount: 0, quantity: undefined, free: true },
};

export const Total: Story = {
  args: { label: "Total", amount: 85, quantity: undefined, kind: "total" },
};

export const OrderSummary: Story = {
  render: () => (
    <div>
      <PriceRow label="General admission" amount={45} quantity={2} />
      <PriceRow label="Pit standing" amount={65} was={75} quantity={1} />
      <PriceRow
        label="Booking fee"
        sublabel="€2.50 per ticket"
        amount={7.5}
        kind="fee"
      />
      <PriceRow label="Early bird" amount={10} kind="discount" />
      <PriceRow label="Delivery" amount={0} free kind="fee" />
      <PriceRow label="Total" amount={152.5} kind="total" />
    </div>
  ),
};
