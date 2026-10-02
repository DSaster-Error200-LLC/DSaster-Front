import { RefObject } from "react";

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
  const fieldId = `${id}-${name}`;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-medium text-brand-ink"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={fieldId}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-lg border border-brand-muted bg-white px-4 py-3 text-brand-ink outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand-rust disabled:opacity-60 aria-invalid:border-brand-maroon"
        onChange={onChange}
      />
      {error && (
        <p id={errorId} className="mt-2 text-sm text-brand-maroon" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
