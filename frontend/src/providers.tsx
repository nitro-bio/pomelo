import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { TooltipProvider } from "./components/ui/tooltip";
import { jobStore } from "./jobs/jobQueue";
import { JobQueueRunner } from "./components/JobQueuePanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={jobStore}>
        <JobQueueRunner />
        <BrowserRouter>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </BrowserRouter>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
