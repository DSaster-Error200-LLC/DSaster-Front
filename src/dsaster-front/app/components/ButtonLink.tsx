import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@dsaster/ui";

interface ButtonLinkProps {
  readonly href: string;
  /** Mirrors `Button`: one `primary` per screen, `secondary` for alternatives. */
  readonly variant?: "primary" | "secondary" | "ghost";
  readonly size?: "sm" | "md" | "lg";
  readonly block?: boolean;
  readonly icon?: IconName;
  readonly iconRight?: IconName;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * A `next/link` dressed as the design-system `Button`, for navigation that
 * must stay a real link (prefetching, open in new tab, link semantics).
 */
export default function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  block = false,
  icon,
  iconRight,
  className,
  children,
}: Readonly<ButtonLinkProps>) {
  const iconSize = size === "sm" ? 16 : 18;
  const classes = [
    "ds-btn",
    `ds-btn-${variant}`,
    `ds-btn-${size}`,
    block && "ds-btn-block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={classes}>
      {icon && <Icon name={icon} size={iconSize} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </Link>
  );
}
