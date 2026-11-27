import type { ReactNode } from "react";
import { cx } from "./internal/cx";

export interface WordmarkProps {
  /** `lg` (56px) on heroes, `md` (28px) in the web header, `sm` (18px) in the app bar. */
  readonly size?: "sm" | "md" | "lg";
  /** Overrides the text only for co-branded lockups. */
  readonly children?: ReactNode;
  readonly className?: string;
}

/** The Ticket DSaster name set in Archivo Black, a stand-in until real logo files arrive. */
export function Wordmark({
  size = "md",
  children,
  className,
}: Readonly<WordmarkProps>) {
  return (
    <span className={cx("ds-wordmark", `ds-wordmark-${size}`, className)}>
      {children ?? "Ticket DSaster"}
    </span>
  );
}
