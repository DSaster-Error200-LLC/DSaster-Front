/* eslint-disable @typescript-eslint/no-unused-vars -- the mock ignores its input until the real endpoint exists */
export interface Buyer {
  readonly fullName: string;
  readonly email: string;
}

export type StartCheckoutResult =
  { readonly status: "success" } | { readonly status: "error" };

// shortcut: mocked with a fixed delay, swap for the Orval client once the backend exposes a checkout endpoint.
export async function startCheckout(
  eventId: string,
  buyer: Buyer,
): Promise<StartCheckoutResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { status: "success" };
}
