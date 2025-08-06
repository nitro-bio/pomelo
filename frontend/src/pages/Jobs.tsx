import React from "react";
import Shell from "@/components/Shell";
import { JobQueuePanel } from "@/components/JobQueuePanel";

export default function Jobs(): React.ReactElement {
  return (
    <Shell>
      <div className="flex min-h-screen flex-col items-center justify-start p-8">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Job Queue</h1>
            <p className="text-muted-foreground text-lg">
              Monitor and manage protein folding jobs
            </p>
          </div>
          
          <div className="flex justify-center">
            <JobQueuePanel />
          </div>
        </div>
      </div>
    </Shell>
  );
}