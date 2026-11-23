import { Icon } from "./Icon";
import { cx } from "./internal/cx";

export interface StepIndicatorProps {
  /** Short nouns, one word each, four at most: Tickets, Details, Payment, Done. */
  readonly steps: readonly string[];
  /** Zero-based index of the current step. */
  readonly current: number;
  /** Accessible name of the list ("Checkout progress"). */
  readonly label?: string;
  /** Read to screen readers after a completed step. */
  readonly completedLabel?: string;
  readonly className?: string;
}

type StepState = "done" | "current" | "todo";

function stateOf(index: number, current: number): StepState {
  if (index < current) return "done";
  if (index === current) return "current";
  return "todo";
}

/** Where the buyer is in checkout: numbered dots joined by a line, done steps filled in brand. */
export function StepIndicator({
  steps,
  current,
  label = "Checkout progress",
  completedLabel = "(completed)",
  className,
}: Readonly<StepIndicatorProps>) {
  return (
    <ol className={cx("ds-steps", className)} aria-label={label}>
      {steps.map((step, index) => {
        const state = stateOf(index, current);
        return (
          <li
            key={step}
            className={`ds-step is-${state}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="ds-step-dot">
              {state === "done" ? (
                <Icon name="check" size={14} strokeWidth={3} />
              ) : (
                index + 1
              )}
            </span>
            <span className="ds-step-label">{step}</span>
            {state === "done" && (
              <span className="ds-visually-hidden"> {completedLabel}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
