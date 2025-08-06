import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox";
import { jobsAtom, removeJobAtom } from "@/jobs/jobQueue";
import { useJobRunner } from "@/jobs/jobRunner";
import type { Job } from "@/jobs/jobTypes";
import { useAtom } from "jotai";
import { RotateCcw, X, XCircle } from "lucide-react";
import React from "react";

// Job Queue Runner Component (must be inside Jotai Provider)
export function JobQueueRunner(): React.ReactElement {
  useJobRunner({ maxConcurrent: 2, pauseWhenOffline: true });
  return <></>;
}

// Job Queue Panel Component
export function JobQueuePanel({
  compareJobs,
  setCompareJobs,
}: {
  compareJobs: Job[];
  setCompareJobs: (next: Job[]) => void;
}): React.ReactElement {
  const [jobs, setJobs] = useAtom(jobsAtom);
  const [, removeJob] = useAtom(removeJobAtom);
  const selectedJobIds = compareJobs.map((job) => job.id);

  const retryJob = (jobId: string) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId &&
        (job.status === "error" || job.status === "cancelled")
          ? {
              ...job,
              status: "queued" as const,
              attempts: job.attempts,
              error: undefined,
              startedAt: undefined,
              finishedAt: undefined,
            }
          : job,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "queued":
        return "secondary";
      case "running":
        return "outline";
      case "success":
        return "success";
      case "error":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleJobSelection = (jobId: string, checked: boolean) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    if (checked) {
      setCompareJobs([...compareJobs, job]);
    } else {
      setCompareJobs(compareJobs.filter((j) => j.id !== jobId));
    }
  };

  const handleClearSelection = () => {
    setCompareJobs([]);
  };

  return (
    <>
      {compareJobs.length > 1 && (
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearSelection}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            Clear Selection
          </Button>
        </div>
      )}

      {jobs.length === 0 ? (
        <p className="text-muted-foreground text-sm">No jobs in queue</p>
      ) : (
        <div className="flex flex-col gap-2">
          {jobs
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((job) => (
              <div
                key={job.id}
                className="bg-card flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  {job.status === "success" && (
                    <Checkbox
                      checked={selectedJobIds.includes(job.id)}
                      onCheckedChange={(checked) =>
                        handleJobSelection(job.id, checked == true)
                      }
                    />
                  )}
                  <Badge variant={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                  <div>
                    <div className="text-sm font-medium">
                      {job.kind.toUpperCase()}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(job.createdAt).toLocaleTimeString()}
                      {job.attempts > 0 && ` • Attempt ${job.attempts}`}
                      {job.status === "success" && job.request && (
                        <span> • {job.request.sequence.length} residues</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === "error" && (
                    <>
                      <span className="text-destructive text-xs">✗ Failed</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => retryJob(job.id)}
                        title="Retry"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeJob(job.id)}
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
