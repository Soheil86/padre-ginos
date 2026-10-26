import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route } from "../routes/past.lazy";
import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

afterEach(() => {
  vi.unstubAllGlobals();
});

// 10 fake orders, so the "Next" button is enabled
const makeOrders = (startId) =>
  Array.from({ length: 10 }, (_, i) => ({
    order_id: startId + i,
    date: "2026-10-01",
    time: "12:00:00",
  }));

// fake fetch for /api/past-orders that only answers when we call respond(...)
function mockPastOrders() {
  const pending = [];
  const fetchMock = vi.fn(
    () =>
      new Promise((resolve) => {
        pending.push(resolve);
      }),
  );
  vi.stubGlobal("fetch", fetchMock);

  const respond = async (orders) => {
    // wait until the component has actually called fetch
    await vi.waitFor(() => expect(pending.length).toBeGreaterThan(0));
    const resolve = pending.shift();
    resolve({ ok: true, json: async () => orders });
  };
  return { fetchMock, respond };
}

function renderPastOrders() {
  // same option as App.jsx, needed for useQuery(...).promise
  const queryClient = new QueryClient({
    defaultOptions: { queries: { experimental_prefetchInRender: true } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>,
  );
}

test("shows loading first, then the past orders", async () => {
  const { fetchMock, respond } = mockPastOrders();
  const screen = renderPastOrders();

  // Suspense fallback while use() is waiting for the promise
  await expect
    .element(screen.getByText("Loading Past Order ..."))
    .toBeInTheDocument();

  await respond(makeOrders(1));

  await expect.element(screen.getByRole("table")).toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "1", exact: true }))
    .toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith("/api/past-orders?page=1");
});

test("clicking Next loads the next page", async () => {
  const { fetchMock, respond } = mockPastOrders();
  const screen = renderPastOrders();

  await respond(makeOrders(1));
  await expect.element(screen.getByRole("table")).toBeInTheDocument();

  await screen.getByRole("button", { name: "Next" }).click();

  // page 2 is a new promise, so the component suspends again
  await expect
    .element(screen.getByText("Loading Past Order ..."))
    .toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith("/api/past-orders?page=2");

  await respond(makeOrders(11));

  await expect
    .element(screen.getByRole("button", { name: "11", exact: true }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "1", exact: true }))
    .not.toBeInTheDocument();
});
