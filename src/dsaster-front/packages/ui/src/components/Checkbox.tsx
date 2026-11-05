import type { InputHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import { cx } from "./internal/cx";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: ReactNode;
  /** What it costs or what happens, in body-s. */
  readonly description?: ReactNode;
}

/** An opt-in choice with a label and optional one-line description. */
export function Checkbox({
  label,
  description,
  className,
  disabled,
  ...rest
}: Readonly<CheckboxProps>) {
  return (
    <label className={cx("ds-check", disabled && "is-disabled", className)}>
      <input
        type="checkbox"
        disabled={disabled}
        {...rest}
        className="ds-check-input"
      />
      <span className="ds-check-box" aria-hidden="true">
        <Icon name="check" size={14} strokeWidth={3} />
      </span>
      <span className="ds-check-text">
        <span className="ds-check-label">{label}</span>
        {description == null ? null : (
          <span className="ds-check-desc">{description}</span>
        )}
      </span>
    </label>
  );
}
