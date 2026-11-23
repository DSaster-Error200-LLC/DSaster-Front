import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./internal/cx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` moves the purchase forward (one per screen); `danger` releases or cancels. */
  readonly variant?: "primary" | "secondary" | "ghost" | "danger";
  /** `lg` (52px) for the sticky checkout bar, `md` (44px) default, `sm` (32px) inside cards. */
  readonly size?: "sm" | "md" | "lg";
  readonly icon?: IconName;
  readonly iconRight?: IconName;
  /** Stretches to the container on mobile sheets. */
  readonly block?: boolean;
}

/** The one action control. Labels are verbs in sentence case ("Get tickets", "Pay €110.00"). */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  block = false,
  className,
  children,
  type = "button",
  ...rest
}: Readonly<ButtonProps>) {
  const iconSize = size === "sm" ? 16 : 18;
  return (
    <button
      type={type}
      {...rest}
      className={cx(
        "ds-btn",
        `ds-btn-${variant}`,
        `ds-btn-${size}`,
        block && "ds-btn-block",
        className,
      )}
    >
      {icon && <Icon name={icon} size={iconSize} />}
      {children == null ? null : <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
