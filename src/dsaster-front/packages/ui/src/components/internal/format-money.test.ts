import { describe, expect, it } from "vitest";
import { formatMoney } from "./format-money";

describe("formatMoney", () => {
  it("defaults to euros in en-IE", () => {
    expect(formatMoney(65)).toBe("€65.00");
  });

  it("formats per market", () => {
    expect(formatMoney(1234.5, "USD", "en-US")).toBe("$1,234.50");
  });

  it("falls back to the raw number for an unknown currency", () => {
    expect(formatMoney(5, "NOT-A-CODE")).toBe("5");
  });
});
