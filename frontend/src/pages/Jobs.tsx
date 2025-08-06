import React, { useState } from "react";
import Shell from "@/components/Shell";
import { JobComparison } from "@/components/JobComparison";
import type { Job } from "@/jobs/jobTypes";
import { JobQueuePanel } from "@/components/JobQueuePanel";

export default function Jobs(): React.ReactElement {
  const [compareJobs, setCompareJobs] = useState<Job[]>([]);

  return (
    <Shell>
      <div className="flex min-h-screen flex-col items-center justify-start p-8">
        <div className="flex w-full max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Job Queue</h1>
          </div>

          <div className="flex flex-col gap-8">
            <JobQueuePanel
              compareJobs={compareJobs}
              setCompareJobs={setCompareJobs}
            />

            <JobComparison jobs={compareJobs} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
