export type ClassValue = string | false | null | undefined;

/** Joins truthy class names with a space. */
export function cx(...parts: readonly ClassValue[]): string {
  return parts.filter((part): part is string => Boolean(part)).join(" ");
}
