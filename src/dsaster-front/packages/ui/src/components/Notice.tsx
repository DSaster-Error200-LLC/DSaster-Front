import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./internal/cx";

export type NoticeTone = "info" | "success" | "warning" | "danger";

export interface NoticeProps {
  /** `info` facts, `success` done, `warning` act soon, `danger` something failed (announced as an alert). */
  readonly tone?: NoticeTone;
  /** What happened, in a few words. */
  readonly title?: ReactNode;
  /** What to do next. */
  readonly children?: ReactNode;
  /** A Button when there is one obvious fix. */
  readonly action?: ReactNode;
  readonly className?: string;
}

const NOTICE_ICON: Readonly<Record<NoticeTone, IconName>> = {
  info: "info",
  success: "check",
  warning: "triangle-alert",
  danger: "triangle-alert",
};

/** An inline message about the purchase, placed at the top of the step it concerns. */
export function Notice({
  tone = "info",
  title,
  children,
  action,
  className,
}: Readonly<NoticeProps>) {
  return (
    <div
      className={cx("ds-notice", `ds-notice-${tone}`, className)}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon name={NOTICE_ICON[tone]} size={18} className="ds-notice-icon" />
      <div className="ds-notice-body">
        {title == null ? null : <p className="ds-notice-title">{title}</p>}
        {children == null ? null : (
          <div className="ds-notice-text">{children}</div>
        )}
      </div>
      {action}
    </div>
  );
}
