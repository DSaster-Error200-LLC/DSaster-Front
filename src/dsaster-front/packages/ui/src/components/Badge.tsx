import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./internal/cx";

export interface BadgeProps {
  /** Availability uses `success`, `warning`, `danger` with an icon; `brand` only for presale or members. */
  readonly tone?: "neutral" | "brand" | "success" | "warning" | "danger";
  readonly icon?: IconName;
  readonly children?: ReactNode;
  readonly className?: string;
}

/** One or two upper-case words of status or restriction, in label type. */
export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: Readonly<BadgeProps>) {
  return (
    <span className={cx("ds-badge", `ds-badge-${tone}`, className)}>
      {icon && <Icon name={icon} size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
