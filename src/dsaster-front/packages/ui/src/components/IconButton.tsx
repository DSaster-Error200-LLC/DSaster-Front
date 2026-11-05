import type { ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./internal/cx";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly icon: IconName;
  /** Required: becomes the accessible name and the tooltip. */
  readonly label: string;
  /** `secondary` adds the surface-200 fill for buttons that float over posters. */
  readonly variant?: "ghost" | "secondary";
  /** Makes it a toggle (save, favourite) and turns the icon `accent`. */
  readonly pressed?: boolean;
}

/** A 44px round button holding one icon, for app-bar and sheet chrome. */
export function IconButton({
  icon,
  label,
  variant = "ghost",
  pressed,
  className,
  type = "button",
  ...rest
}: Readonly<IconButtonProps>) {
  return (
    <button
      type={type}
      {...rest}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cx(
        "ds-iconbtn",
        `ds-iconbtn-${variant}`,
        pressed && "is-pressed",
        className,
      )}
    >
      <Icon name={icon} size={20} />
    </button>
  );
}
