import { useEffect, useRef, useState } from "react";
import type { Event } from "@/api/search";
import BuyerDetails from "@/app/events/[eventId]/purchase/BuyerDetails";
import PurchaseDetails from "@/app/events/[eventId]/purchase/PurchaseDetails";

interface CheckoutProps {
  readonly event: Event;
}

const steps = ["Datos", "Asientos", "Pago", "Listo"] as const;

function stepClassName(index: number, current: number): string {
  if (index === current) return "border-brand-rust text-brand-ink";
  if (index < current) return "border-brand-rust/40 text-brand-muted";
  return "border-brand-border text-brand-muted";
}

export default function Checkout({ event }: Readonly<CheckoutProps>) {
  const [step, setStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // The previous step unmounts, so move focus to the new one instead of losing it.
  useEffect(() => {
    if (step > 0) panelRef.current?.focus();
  }, [step]);

  return (
    <>
      <ol
        aria-label="Pasos de compra"
        className="mx-auto grid max-w-xl grid-cols-4 gap-2 px-6 pt-12"
      >
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={`border-t-4 pt-2 font-display text-sm font-semibold ${stepClassName(index, step)}`}
          >
            <span className="tabular-nums">{index + 1}.</span> {label}
          </li>
        ))}
      </ol>

      <div ref={panelRef} tabIndex={-1} className="outline-none">
        {step === 0 && (
          <BuyerDetails event={event} onContinue={() => setStep(1)} />
        )}
        {step === 1 && <PurchaseDetails event={event} />}
        {step > 1 && (
          // TODO: build the payment and confirmation steps.
          <section className="mx-auto max-w-xl px-6 py-12">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand-ink">
              {steps[step]}
            </h1>
            <p className="mt-3 text-brand-muted">Disponible próximamente.</p>
          </section>
        )}
      </div>
    </>
  );
}
