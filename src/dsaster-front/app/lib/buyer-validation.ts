export function emailFieldError(input: HTMLInputElement): string {
  if (!input.value.trim()) {
    return "Introduce tu correo electrónico.";
  }

  return !input.validity.valid || input.value.trim().length > 254
    ? "Introduce un correo electrónico válido."
    : "";
}

export function fullNameFieldError(input: HTMLInputElement): string {
  return input.value.trim() ? "" : "Introduce tu nombre completo.";
}
