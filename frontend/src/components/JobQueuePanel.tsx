import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { jobsAtom, removeJobAtom } from "@/jobs/jobQueue";
import { useJobRunner } from "@/jobs/jobRunner";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Job Queue Runner Component (must be inside Jotai Provider)
export function JobQueueRunner(): React.ReactElement {
  useJobRunner({ maxConcurrent: 2, pauseWhenOffline: true });
  return <></>;
}

// Job Queue Panel Component
export function JobQueuePanel(): React.ReactElement {
  const jobs = useAtomValue(jobsAtom);
  const [, removeJob] = useAtom(removeJobAtom);

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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Job Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No jobs in queue</p>
        ) : (
          <div className="space-y-2">
            {jobs
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((job) => (
                <div
                  key={job.id}
                  className="bg-card flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === "error" && (
                      <span className="text-destructive text-xs">✗ Failed</span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeJob(job.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
