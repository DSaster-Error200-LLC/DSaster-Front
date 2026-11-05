import type { ReactNode } from "react";
import { cx } from "./internal/cx";
import { formatMoney } from "./internal/format-money";

export interface PriceRowProps {
  readonly label: ReactNode;
  readonly sublabel?: ReactNode;
  /** Major units: 65 is €65.00. */
  readonly amount: number;
  /** Prefixes "2 ×" to the label. */
  readonly quantity?: number;
  /** Struck-through old price. */
  readonly was?: number;
  readonly free?: boolean;
  readonly freeLabel?: string;
  /** `fee` is muted, `discount` shows −amount in success, `total` gets the rule above. Exactly one total, last. */
  readonly kind?: "line" | "fee" | "discount" | "total";
  readonly currency?: string;
  readonly locale?: string;
  readonly className?: string;
}

/** One line of an order summary: label left, tabular mono amount right. */
export function PriceRow({
  label,
  sublabel,
  amount,
  quantity,
  was,
  free = false,
  freeLabel = "Free",
  kind = "line",
  currency,
  locale,
  className,
}: Readonly<PriceRowProps>) {
  const shown = free ? freeLabel : formatMoney(amount, currency, locale);
  const signed = kind === "discount" && !free ? `−${shown}` : shown;

  return (
    <div className={cx("ds-price", `ds-price-${kind}`, className)}>
      <div className="ds-price-label">
        <span>
          {quantity ? `${quantity} × ` : null}
          {label}
        </span>
        {sublabel == null ? null : (
          <span className="ds-price-sub">{sublabel}</span>
        )}
      </div>
      <div className="ds-price-amount">
        {was === undefined ? null : (
          <s className="ds-price-was">{formatMoney(was, currency, locale)}</s>
        )}
        <span>{signed}</span>
      </div>
    </div>
  );
}
