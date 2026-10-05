import { describe, expect, it } from "vitest";

//TODO delete this file when the real test is implemented
describe("Sample Test Suite", () => {
  it("should pass basic assertion", () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(1, 2)).toBe(3);
  });

  it("should pass basic subtraction", () => {
    const resta = (a: number, b: number) => a - b;
    expect(resta(3, 2)).toBe(1);
  });

  it("should pass basic division", () => {
    const division = (a: number, b: number) => a / b;
    expect(division(6, 2)).toBe(3);
  });

  it("should pass basic multiplication", () => {
    const multiplication = (a: number, b: number) => a * b;
    expect(multiplication(6, 2)).toBe(12);
  });
});
