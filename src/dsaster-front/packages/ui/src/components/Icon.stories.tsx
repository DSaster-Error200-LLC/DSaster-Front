import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./Icon";
import { ICON_NAMES } from "./internal/icons";

const meta = {
  title: "Core/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "ticket", size: 20, strokeWidth: 2 },
  argTypes: {
    name: { control: "select", options: ICON_NAMES },
    size: { control: { type: "range", min: 12, max: 64, step: 1 } },
    strokeWidth: { control: { type: "range", min: 1, max: 3, step: 0.25 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Labelled: Story = {
  args: { name: "triangle-alert", label: "Warning" },
};

export const AllIcons: Story = {
  render: (args) => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "var(--space-4)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {ICON_NAMES.map((name) => (
        <li
          key={name}
          style={{
            display: "grid",
            justifyItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Icon {...args} name={name} size={24} />
          <code className="ds-mono-s" style={{ color: "var(--ink-muted)" }}>
            {name}
          </code>
        </li>
      ))}
    </ul>
  ),
};
