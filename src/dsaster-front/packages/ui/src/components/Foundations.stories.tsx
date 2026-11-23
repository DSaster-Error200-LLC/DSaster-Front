import type { Meta, StoryObj } from "@storybook/react-vite";

/** The design tokens as the app sees them: CSS custom properties, switched by `data-theme`. */
const meta = {
  title: "Foundations/Tokens",
  tags: ["autodocs"],
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = [
  "surface-000",
  "surface-100",
  "surface-200",
  "line",
  "line-strong",
  "ink",
  "ink-muted",
  "brand",
  "brand-hover",
  "on-brand",
  "brand-text",
  "accent",
  "on-accent",
  "success",
  "success-soft",
  "warning",
  "warning-soft",
  "danger",
  "danger-soft",
  "focus",
] as const;

const SPACES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const RADII = ["sm", "md", "lg", "pill"] as const;
const TYPE_STYLES = [
  ["display-xl", "TONIGHT ONLY"],
  ["display-l", "Primavera Live"],
  ["display-numeral", "14"],
  ["heading-m", "Choose your tickets"],
  ["heading-s", "General admission"],
  ["body", "Doors open at 19:30. Bring the QR code on your phone."],
  ["body-s", "Includes a €2.50 booking fee per ticket."],
  ["label", "SOLD OUT"],
  ["mono-m", "€45.00"],
  ["mono-s", "ORD-7Q4K-21 · ROW F · SEAT 12"],
] as const;

export const Colors: Story = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "var(--space-3)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {COLORS.map((name) => (
        <li
          key={name}
          style={{
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 56, background: `var(--${name})` }} />
          <code
            className="ds-mono-s"
            style={{ display: "block", padding: "var(--space-2)" }}
          >
            --{name}
          </code>
        </li>
      ))}
    </ul>
  ),
};

export const Spacing: Story = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gap: "var(--space-2)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {SPACES.map((step) => (
        <li
          key={step}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <code className="ds-mono-s" style={{ width: 96 }}>
            --space-{step}
          </code>
          <div
            style={{
              height: 16,
              width: `var(--space-${step})`,
              background: "var(--brand)",
            }}
          />
        </li>
      ))}
    </ul>
  ),
};

export const Radii: Story = {
  render: () => (
    <ul
      style={{
        display: "flex",
        gap: "var(--space-4)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {RADII.map((name) => (
        <li key={name} style={{ display: "grid", gap: "var(--space-2)" }}>
          <div
            style={{
              width: 80,
              height: 56,
              background: "var(--surface-200)",
              border: "1px solid var(--line-strong)",
              borderRadius: `var(--radius-${name})`,
            }}
          />
          <code className="ds-mono-s">--radius-{name}</code>
        </li>
      ))}
    </ul>
  ),
};

export const Typography: Story = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gap: "var(--space-4)",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {TYPE_STYLES.map(([name, sample]) => (
        <li key={name} style={{ display: "grid", gap: "var(--space-1)" }}>
          <code className="ds-mono-s" style={{ color: "var(--ink-muted)" }}>
            .ds-{name} / text-{name}
          </code>
          <span className={`ds-${name}`}>{sample}</span>
        </li>
      ))}
    </ul>
  ),
};
