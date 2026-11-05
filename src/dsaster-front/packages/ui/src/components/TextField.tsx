"use client";

import { useId, type ComponentProps } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./internal/cx";

/** Every `<input>` attribute passes through, `ref` included (React 19 refs are props). */
export interface TextFieldProps extends ComponentProps<"input"> {
  /** Always pass one; placeholders are examples, not labels. */
  readonly label?: string;
  readonly hint?: string;
  /** Replaces the hint, turns the border `danger` and is announced with the field. Write it as the fix. */
  readonly error?: string;
  /** `search` for search fields only; other fields stay plain. */
  readonly icon?: IconName;
}

/** A labelled single-line input with an optional leading icon, hint and error. */
export function TextField({
  label,
  hint,
  error,
  icon,
  className,
  id,
  type = "text",
  ...rest
}: Readonly<TextFieldProps>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-err`;
  const hintId = `${fieldId}-hint`;
  let describedBy: string | undefined;
  if (error) describedBy = errorId;
  else if (hint) describedBy = hintId;

  return (
    <div className={cx("ds-field", error && "is-invalid", className)}>
      {label && (
        <label className="ds-field-label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="ds-field-control">
        {icon && <Icon name={icon} size={18} className="ds-field-icon" />}
        <input
          type={type}
          {...rest}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx("ds-field-input", icon && "has-icon")}
        />
      </div>
      {error && (
        <p className="ds-field-error" id={errorId}>
          <Icon name="triangle-alert" size={14} />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="ds-field-hint" id={hintId}>
          {hint}
        </p>
      )}
    </div>
  );
}
