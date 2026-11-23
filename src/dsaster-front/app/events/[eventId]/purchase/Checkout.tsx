import { useEffect, useRef, useState } from "react";
import { StepIndicator } from "@dsaster/ui";
import type { Event } from "@/api/search";
import BuyerDetails from "@/app/events/[eventId]/purchase/BuyerDetails";
import PurchaseDetails from "@/app/events/[eventId]/purchase/PurchaseDetails";

interface CheckoutProps {
  readonly event: Event;
}

const steps = ["Datos", "Asientos", "Pago", "Listo"] as const;

export default function Checkout({ event }: Readonly<CheckoutProps>) {
  const [step, setStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // The previous step unmounts, so move focus to the new one instead of losing it.
  useEffect(() => {
    if (step > 0) panelRef.current?.focus();
  }, [step]);

  return (
    <>
      <div className="mx-auto max-w-xl px-6 pt-12">
        <StepIndicator
          steps={steps}
          current={step}
          label="Pasos de compra"
          completedLabel="(completado)"
        />
      </div>

      <div ref={panelRef} tabIndex={-1} className="outline-none">
        {step === 0 && (
          <BuyerDetails event={event} onContinue={() => setStep(1)} />
        )}
        {step === 1 && <PurchaseDetails event={event} />}
        {step > 1 && (
          // TODO: build the payment and confirmation steps.
          <section className="mx-auto max-w-xl px-6 py-12">
            <h1 className="text-display-l uppercase text-ink">{steps[step]}</h1>
            <p className="mt-3 text-body text-ink-muted">
              Disponible próximamente.
            </p>
          </section>
        )}
      </div>
    </>
  );
}
