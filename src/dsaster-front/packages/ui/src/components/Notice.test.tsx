import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";
import { Notice } from "./Notice";

describe("Notice", () => {
  it("is a status region by default", () => {
    render(<Notice title="Tickets held for 9:42">Finish checkout.</Notice>);

    const notice = screen.getByRole("status");
    expect(notice).toHaveTextContent("Tickets held for 9:42");
    expect(notice).toHaveTextContent("Finish checkout.");
    expect(notice).toHaveClass("ds-notice-info");
  });

  it("announces danger as an alert and renders the action", () => {
    render(
      <Notice
        tone="danger"
        title="Payment didn’t go through"
        action={<Button variant="secondary">Try another card</Button>}
      >
        Your bank declined the card.
      </Notice>,
    );

    expect(screen.getByRole("alert")).toHaveClass("ds-notice-danger");
    expect(
      screen.getByRole("button", { name: "Try another card" }),
    ).toBeInTheDocument();
  });
});
