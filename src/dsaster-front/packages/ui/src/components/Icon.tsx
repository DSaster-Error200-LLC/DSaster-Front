import { cx } from "./internal/cx";
import { ICONS, type IconName } from "./internal/icons";

export type { IconName };

export interface IconProps {
  readonly name: IconName;
  /** Pixel size; 14 in meta lines, 18 in buttons and fields, 20 in icon buttons, 22 in the tab bar. */
  readonly size?: number;
  readonly strokeWidth?: number;
  /** Only when the icon stands alone and carries meaning; otherwise it is decorative. */
  readonly label?: string;
  readonly className?: string;
}

/** Inline Lucide outline icon (v0.460.0). Takes `currentColor`, so colour it through the parent. */
export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  label,
  className,
}: Readonly<IconProps>) {
  return (
    <svg
      className={cx("ds-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {ICONS[name]}
    </svg>
  );
}
