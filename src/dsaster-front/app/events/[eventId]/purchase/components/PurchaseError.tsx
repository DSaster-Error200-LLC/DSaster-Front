import { Notice } from "@dsaster/ui";

interface PurchaseErrorProps {
  readonly hasError: boolean;
  readonly message?: string;
}

export function PurchaseError({
  hasError,
  message = "No se pudo completar la compra. Inténtalo de nuevo.",
}: Readonly<PurchaseErrorProps>) {
  if (!hasError) return null;

  return <Notice tone="danger">{message}</Notice>;
}
