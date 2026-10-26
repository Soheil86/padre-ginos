import { afterEach, expect, test } from "vitest";
import { cleanup, render } from "@testing-library/react";
import Cart from "../Cart";

afterEach(cleanup);

test("snapshot with nothing in cart", () => {
  const { asFragment } = render(<Cart cart={[]} />);
  expect(asFragment()).toMatchSnapshot();
});

test("checkout button is disabled when cart is empty", () => {
  const screen = render(<Cart cart={[]} checkout={() => {}} />);
  expect(screen.getByRole("button").disabled).toBe(true);
});
