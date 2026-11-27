import type { MouseEvent } from "react";
import { Badge, type BadgeProps } from "./Badge";
import { Button } from "./Button";
import { Icon, type IconName } from "./Icon";
import { cx } from "./internal/cx";
import { formatMoney } from "./internal/format-money";

export type EventStatus = "onsale" | "low" | "soldout" | "soon";

export interface EventCardProps {
  readonly title: string;
  /** Short month for the date stamp ("Mar"). */
  readonly month: string;
  /** Day numeral for the date stamp (12). */
  readonly day: string | number;
  /** Formatted day and time ("Fri 12 Mar · 20:00"). */
  readonly when: string;
  /** "Venue, City". */
  readonly venue: string;
  /** The genre: Rock, Metal, Punk, Indie… */
  readonly category?: string;
  /** Poster at 4:3; without it the card shows a dotted placeholder with the category. */
  readonly image?: string;
  /** Lowest price in major units; formatted with `currency` and `locale`. */
  readonly priceFrom?: number;
  readonly currency?: string;
  readonly locale?: string;
  readonly status?: EventStatus;
  /** Overrides the status badge text (for translation). */
  readonly statusLabel?: string;
  /** Word before the price ("from"). */
  readonly fromLabel?: string;
  /** Makes the title a link. Use this or `onSelect`, not both. */
  readonly href?: string;
  /** Without `href`, shows a small Tickets button that calls this. */
  readonly onSelect?: (event: MouseEvent<HTMLElement>) => void;
  /** Label of that button ("Tickets"). */
  readonly cta?: string;
  /** `row` for search results and lists; `stack` (default) for grids. */
  readonly layout?: "stack" | "row";
  readonly className?: string;
}

interface StatusPresentation {
  readonly tone: NonNullable<BadgeProps["tone"]>;
  readonly label: string;
  readonly icon: IconName;
}

const STATUS: Readonly<Record<EventStatus, StatusPresentation>> = {
  onsale: { tone: "success", label: "On sale", icon: "check" },
  low: { tone: "warning", label: "Few left", icon: "triangle-alert" },
  soldout: { tone: "danger", label: "Sold out", icon: "x" },
  soon: { tone: "neutral", label: "Coming soon", icon: "clock" },
};

/** The event as a ticket: poster on top, a perforated seam, then the stub with the facts. */
export function EventCard({
  title,
  month,
  day,
  when,
  venue,
  category,
  image,
  priceFrom,
  currency,
  locale,
  status = "onsale",
  statusLabel,
  fromLabel = "from",
  href,
  onSelect,
  cta = "Tickets",
  layout = "stack",
  className,
}: Readonly<EventCardProps>) {
  const presentation = STATUS[status];
  const soldOut = status === "soldout";
  const showButton = !soldOut && onSelect !== undefined && href === undefined;

  return (
    <article
      className={cx(
        "ds-event",
        soldOut && "is-soldout",
        layout === "row" && "ds-event-row",
        className,
      )}
    >
      <div className="ds-event-media">
        {image ? (
          <img className="ds-event-img" src={image} alt="" />
        ) : (
          <div className="ds-event-placeholder" aria-hidden="true">
            <span className="ds-event-ph-genre">{category ?? "Live"}</span>
            <Icon name="ticket" size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className="ds-event-date">
          <span className="ds-event-month">{month}</span>
          <span className="ds-event-day">{day}</span>
        </div>
      </div>
      <div className="ds-event-body">
        <div className="ds-event-top">
          <Badge tone={presentation.tone} icon={presentation.icon}>
            {statusLabel ?? presentation.label}
          </Badge>
          {category && <span className="ds-event-cat">{category}</span>}
        </div>
        <h3 className="ds-event-title">
          {href ? (
            <a href={href} onClick={onSelect}>
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="ds-event-meta">
          <Icon name="calendar" size={14} />
          {when}
        </p>
        <p className="ds-event-meta">
          <Icon name="map-pin" size={14} />
          {venue}
        </p>
        <div className="ds-event-foot">
          {priceFrom === undefined ? (
            <span />
          ) : (
            <span className="ds-event-price">
              <span className="ds-event-from">{fromLabel} </span>
              {formatMoney(priceFrom, currency, locale)}
            </span>
          )}
          {showButton && (
            <Button
              size="sm"
              variant="secondary"
              iconRight="chevron-right"
              onClick={onSelect}
            >
              {cta}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
