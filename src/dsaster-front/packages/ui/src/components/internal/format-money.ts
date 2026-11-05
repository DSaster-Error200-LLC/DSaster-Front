/**
 * Formats a price in major units (65 → "€65.00").
 * Defaults to the design system's `en-IE` / EUR; pass `locale` and
 * `currency` per market instead of formatting by hand.
 */
export function formatMoney(
  amount: number,
  currency = "EUR",
  locale = "en-IE",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return String(amount);
  }
}
