import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route } from "../routes/contact.lazy";
import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("can submit contact form", async () => {
  // fake fetch that waits until we call resolveFetch, so we can see the "Sending…" state
  let resolveFetch;
  const fetchMock = vi.fn(
    () =>
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
  );
  vi.stubGlobal("fetch", fetchMock);

  const queryClient = new QueryClient();
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>,
  );

  const testData = {
    name: "Brian",
    email: "test@example.com",
    message: "This is a test message",
  };

  await screen.getByPlaceholder("Name").fill(testData.name);
  await screen.getByPlaceholder("Email").fill(testData.email);
  await screen.getByPlaceholder("Message").fill(testData.message);

  const btn = screen.getByRole("button");
  await btn.click();

  // while the request is in flight, useFormStatus reports pending
  await expect.element(btn).toHaveTextContent("Sending…");
  await expect.element(btn).toBeDisabled();

  resolveFetch({ ok: true, json: async () => ({ status: "ok" }) });

  const h3 = screen.getByRole("heading", { level: 3 });
  await expect.element(h3).toHaveTextContent("Submitted");

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith("/api/contact", {
    body: JSON.stringify(testData),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
});
