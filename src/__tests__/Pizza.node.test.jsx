import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Pizza from "../Pizza";

afterEach(cleanup)

test("renders the pizza image with the correct src and alt text", async () => {
  const name = "My Favorite Pizza";
  const src = "https://picsum.photos/200";
  const screen = render(
    <Pizza name={name} description="super cool pizza" image={src} />,
  );
  const img = screen.getByRole("img");
  expect(img.src).toBe(src);
  expect(img.alt).toBe(name);
});

test("shows a default image when no image is provided", () => {
  const screen = render(<Pizza name="Test" description="desc" />);
  const img = screen.getByRole("img");
  expect(img.src).not.toBe("");
});
