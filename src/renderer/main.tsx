import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { routeTree } from "../routeTree.gen";
import { QueryClientProvider } from "@tanstack/react-query";
import { query } from "@/lib/query";

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"],
});

const router = createRouter({ routeTree, history: memoryHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function Main() {
  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={router} />
      <Toaster duration={1000} richColors />
    </QueryClientProvider>
  );
}
