interface PurchaseSubmitButtonProps {
  readonly isPending: boolean;
  readonly disabled: boolean;
  readonly label?: string;
  readonly pendingLabel?: string;
}

const buttonClassName =
  "w-full rounded-xl bg-brand-rust px-8 py-4 font-display text-base font-semibold text-white transition-colors hover:bg-brand-rust-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-rust disabled:cursor-not-allowed disabled:opacity-60";

export function PurchaseSubmitButton({
  isPending,
  disabled,
  label = "Seleccionar Asiento",
  pendingLabel = "Reservando…",
}: Readonly<PurchaseSubmitButtonProps>) {
  return (
    <button type="submit" disabled={disabled} className={buttonClassName}>
      {isPending ? pendingLabel : label}
    </button>
  );
}
