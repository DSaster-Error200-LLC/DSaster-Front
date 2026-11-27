import { RefObject } from "react";
import { TextField } from "@dsaster/ui";

interface PurchaseFormFieldProps {
  readonly id: string;
  readonly name: "fullName" | "email";
  readonly label: string;
  readonly type: string;
  readonly autoComplete: string;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly disabled: boolean;
  readonly error?: string;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PurchaseFormField({
  id,
  name,
  label,
  type,
  autoComplete,
  inputRef,
  disabled,
  error,
  onChange,
}: Readonly<PurchaseFormFieldProps>) {
  return (
    <TextField
      ref={inputRef}
      id={`${id}-${name}`}
      name={name}
      label={label}
      type={type}
      autoComplete={autoComplete}
      required
      maxLength={type === "email" ? 254 : undefined}
      disabled={disabled}
      error={error}
      onChange={onChange}
    />
  );
}
