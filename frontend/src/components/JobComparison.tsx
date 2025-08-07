import { FoldingCard } from "@/components/FoldingCard";
import { PomeloSequenceViewer } from "@/components/PomeloSequenceViewer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { STRUCTURE_HEX_COLOR } from "@/constants";
import { getJobInfo, Job } from "@/jobs/jobTypes";
import { cn } from "@/lib/utils";
import { AriadneSelection } from "@nitro-bio/sequence-viewers";
import React, { useState } from "react";

const getFoldingData = (job: Job) => {
  if (job.status !== "success" || !job.response) return null;
  return job.response.results?.[0] ?? null;
};

type JobCardProps = {
  job: Job;
  structureHexColor?: string;
  selection: AriadneSelection | null;
  setSelection: (selection: AriadneSelection | null) => void;
  className?: string;
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  structureHexColor = STRUCTURE_HEX_COLOR,
  selection,
  setSelection,
  className,
}) => {
  const info = getJobInfo(job);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between rounded-md">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{info.type}</Badge>
          <span className="text-muted-foreground text-sm">
            {info.sequenceLength} residues
          </span>
        </div>
        <span className="text-muted-foreground text-xs">{info.duration}</span>
      </div>

      <FoldingCard
        foldingData={getFoldingData(job)}
        isFetchingFolding={false}
        foldingError={null}
        sequence={info.sequence}
        structureHexColor={structureHexColor}
        selection={selection}
        setSelection={setSelection}
      />
    </div>
  );
};

interface JobComparisonProps {
  jobs: Job[];
  sequences: string[];
  setSequences: (sequences: string[]) => void;
}

export function JobComparison({
  jobs,
  sequences,
  setSequences,
}: JobComparisonProps): React.ReactElement | null {
  if (jobs.length === 0) return null;

  const [selection, setSelection] = useState<AriadneSelection | null>(null);

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4">
        <div className={cn("grid grid-cols-3 gap-4")}>
          {jobs.map((job) => (
            <JobCard
              className={cn("")}
              key={job.id}
              job={job}
              selection={selection}
              setSelection={setSelection}
            />
          ))}
        </div>

        <div className="rounded-md border p-4">
          <PomeloSequenceViewer
            sequences={sequences}
            setSequences={setSequences}
            selection={selection}
            setSelection={setSelection}
          />
        </div>
      </CardContent>
    </Card>
  );
}
