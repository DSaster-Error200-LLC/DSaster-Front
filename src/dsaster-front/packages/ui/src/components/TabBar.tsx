"use client";

import { useState } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./internal/cx";

export interface TabBarItem {
  readonly id: string;
  readonly label: string;
  readonly icon: IconName;
  /** Counts upcoming gigs on Tickets, nothing else. */
  readonly badge?: number | string;
}

export interface TabBarProps {
  /** Three to five destinations. Default set: Discover, Search, Tickets, Account. */
  readonly items: readonly TabBarItem[];
  /** Controlled active item id; pair with `onChange`. */
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (id: string) => void;
  /** Accessible name of the navigation ("Main"). */
  readonly label?: string;
  readonly className?: string;
}

/** The mobile app's bottom navigation: the active destination sits in a brand pill. */
export function TabBar({
  items,
  value,
  defaultValue,
  onChange,
  label = "Main",
  className,
}: Readonly<TabBarProps>) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const controlled = value !== undefined;
  const active = controlled ? value : internal;

  return (
    <nav className={cx("ds-tabbar", className)} aria-label={label}>
      {items.map((item) => {
        const on = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            className={cx("ds-tab", on && "is-active")}
            aria-current={on ? "page" : undefined}
            onClick={() => {
              if (!controlled) setInternal(item.id);
              onChange?.(item.id);
            }}
          >
            <span className="ds-tab-icon">
              <Icon name={item.icon} size={22} strokeWidth={on ? 2.25 : 1.75} />
              {item.badge == null ? null : (
                <span className="ds-tab-badge">{item.badge}</span>
              )}
            </span>
            <span className="ds-tab-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
