import { Button } from "@dsaster/ui";

interface PurchaseSubmitButtonProps {
  readonly isPending: boolean;
  readonly disabled: boolean;
  readonly label?: string;
  readonly pendingLabel?: string;
}

export function PurchaseSubmitButton({
  isPending,
  disabled,
  label = "Seleccionar Asiento",
  pendingLabel = "Reservando…",
}: Readonly<PurchaseSubmitButtonProps>) {
  return (
    <Button type="submit" size="lg" block disabled={disabled}>
      {isPending ? pendingLabel : label}
    </Button>
  );
}
