interface PurchaseSuccessProps {
  readonly isSuccess: boolean;
  readonly message?: string;
}

export function PurchaseSuccess({
  isSuccess,
  message = "Tu compra se ha completado.",
}: Readonly<PurchaseSuccessProps>) {
  return (
    <output className="block font-display text-lg font-semibold text-brand-ink">
      {isSuccess ? message : ""}
    </output>
  );
}
