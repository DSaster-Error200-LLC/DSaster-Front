interface PurchaseSubmitButtonProps {
  readonly isPending: boolean;
}

const buttonClassName =
  "w-full rounded-xl bg-brand-rust px-8 py-4 font-display text-base font-semibold text-white transition-colors hover:bg-brand-rust-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-rust disabled:cursor-wait disabled:opacity-60";

export function PurchaseSubmitButton({
  isPending,
}: Readonly<PurchaseSubmitButtonProps>) {
  return (
    <button type="submit" disabled={isPending} className={buttonClassName}>
      {isPending ? "Comprando…" : "Comprar Ticket"}
    </button>
  );
}
