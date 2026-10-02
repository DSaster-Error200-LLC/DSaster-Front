interface PurchaseErrorProps {
  readonly hasError: boolean;
  readonly message?: string;
}

export function PurchaseError({
  hasError,
  message = "No se pudo completar la compra. Inténtalo de nuevo.",
}: Readonly<PurchaseErrorProps>) {
  if (!hasError) return null;

  return (
    <p role="alert" className="text-sm text-brand-maroon">
      {message}
    </p>
  );
}
