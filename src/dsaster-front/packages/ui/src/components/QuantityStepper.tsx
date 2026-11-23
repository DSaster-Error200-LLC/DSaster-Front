"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { cx } from "./internal/cx";

export interface QuantityStepperProps {
  /** Controlled value; pair with `onChange`. */
  readonly value?: number;
  /** Uncontrolled starting value; defaults to `min`. */
  readonly defaultValue?: number;
  readonly min?: number;
  /** The per-order limit or what is left, whichever is lower. */
  readonly max?: number;
  readonly onChange?: (value: number) => void;
  /** Names the ticket type for screen readers ("Pit standing tickets"). */
  readonly label?: string;
  readonly size?: "md" | "sm";
  readonly disabled?: boolean;
  /** Accessible name of the minus button. */
  readonly decrementLabel?: string;
  /** Accessible name of the plus button. */
  readonly incrementLabel?: string;
  readonly className?: string;
}

/** Minus, count, plus: how many of one ticket type to buy. */
export function QuantityStepper({
  value,
  defaultValue,
  min = 0,
  max = 10,
  onChange,
  label = "Quantity",
  size = "md",
  disabled = false,
  decrementLabel = "Remove one",
  incrementLabel = "Add one",
  className,
}: Readonly<QuantityStepperProps>) {
  const [internal, setInternal] = useState(defaultValue ?? min);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const update = (next: number) => {
    const clamped = Math.max(min, Math.min(max, next));
    if (!controlled) setInternal(clamped);
    onChange?.(clamped);
  };

  return (
    <div
      className={cx(
        "ds-stepper",
        size === "sm" && "ds-stepper-sm",
        disabled && "is-disabled",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className="ds-stepper-btn"
        aria-label={decrementLabel}
        disabled={disabled || current <= min}
        onClick={() => {
          update(current - 1);
        }}
      >
        <Icon name="minus" size={18} />
      </button>
      <output className="ds-stepper-value" aria-live="polite">
        {current}
      </output>
      <button
        type="button"
        className="ds-stepper-btn"
        aria-label={incrementLabel}
        disabled={disabled || current >= max}
        onClick={() => {
          update(current + 1);
        }}
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
