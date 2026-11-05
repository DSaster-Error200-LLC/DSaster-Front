import { Notice } from "@dsaster/ui";

interface PurchaseSuccessProps {
  readonly isSuccess: boolean;
  readonly message?: string;
}

export function PurchaseSuccess({
  isSuccess,
  message = "Tu compra se ha completado.",
}: Readonly<PurchaseSuccessProps>) {
  if (!isSuccess) return null;

  return (
    <Notice tone="success" title={message}>
      Guarda el código del ticket: lo necesitarás para entrar.
    </Notice>
  );
}
