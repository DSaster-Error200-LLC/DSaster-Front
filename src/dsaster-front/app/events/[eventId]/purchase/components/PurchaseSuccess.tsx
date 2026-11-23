interface PurchaseSuccessProps {
  readonly isSuccess: boolean;
  readonly message?: string;
}

export function PurchaseSuccess({
  isSuccess,
  message = "Tu compra se ha completado.",
}: Readonly<PurchaseSuccessProps>) {
  return (
    <output className="block text-heading-s text-success">
      {isSuccess ? message : ""}
    </output>
  );
}
