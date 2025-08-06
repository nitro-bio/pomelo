import { useQuery } from "@tanstack/react-query";
import {
  EsmfoldRequest,
  EsmfoldResponse,
  EsmfoldResponseSchema,
  ProteinFoldingHealthResponse,
  ProteinFoldingHealthResponseSchema,
  Boltz2Request,
  Boltz2Response,
  Boltz2ResponseSchema,
} from "./schemas";
import { apiRouter } from "@/api/router";
import { useAtom } from "jotai";
import { enqueueJobAtom, jobsAtom } from "@/jobs/jobQueue";
import { useMemo } from "react";

export const esmfold = async (
  payload: EsmfoldRequest,
  opts: { signal?: AbortSignal } = {},
): Promise<EsmfoldResponse> => {
  let chain = apiRouter.url("/protein_fold/esmfold");

  if (opts.signal) {
    const controller = new AbortController();
    opts.signal.addEventListener("abort", () => controller.abort());
    chain = chain.signal(controller);
  }

  const raw = await chain.post(payload).json();
  const parsed = EsmfoldResponseSchema.parse(raw);
  return parsed;
};

export const useEsmfoldMutation = () => {
  const [, enqueue] = useAtom(enqueueJobAtom);
  const [jobs] = useAtom(jobsAtom);

  // Find the most recent ESMFold job
  const latestEsmfoldJob = useMemo(() => {
    const esmfoldJobs = jobs.filter((job) => job.kind === "esmfold");
    return esmfoldJobs.length > 0 
      ? esmfoldJobs.reduce((latest, current) => 
          current.createdAt > latest.createdAt ? current : latest
        )
      : null;
  }, [jobs]);

  // Map job states to hook return values
  const isFolding = latestEsmfoldJob?.status === "queued" || latestEsmfoldJob?.status === "running";
  const foldingError = latestEsmfoldJob?.status === "error" 
    ? (latestEsmfoldJob.error instanceof Error ? latestEsmfoldJob.error : new Error(String(latestEsmfoldJob.error)))
    : null;
  const foldingResult = latestEsmfoldJob?.status === "success" ? latestEsmfoldJob.response : undefined;
  const isFoldingSuccess = latestEsmfoldJob?.status === "success";

  const esmfoldWithQueue = (payload: EsmfoldRequest) => {
    enqueue({
      kind: "esmfold",
      request: payload,
    });
  };

  return {
    esmfold: esmfoldWithQueue,
    isFolding,
    foldingError,
    foldingResult,
    isFoldingSuccess,
  };
};

export const useProteinFoldingHealthCheck = () => {
  const queryFn = async (): Promise<ProteinFoldingHealthResponse> => {
    const response = await apiRouter.url("/protein_fold/health").get().json();

    const parsed = ProteinFoldingHealthResponseSchema.safeParse(response);
    if (!parsed.success) {
      console.error(parsed.error);
      console.error("received", response);
      throw new Error("Failed to parse health check response");
    }

    return parsed.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["proteinFoldingHealth"],
    queryFn,
  });

  return {
    healthStatus: data,
    isCheckingHealth: isLoading,
    healthError: error as Error | null,
  };
};

// Add the API call function
export const foldBoltz2Protein = async (
  payload: Boltz2Request,
  opts: { signal?: AbortSignal } = {},
): Promise<Boltz2Response> => {
  let chain = apiRouter.url("/protein_fold/boltz2");

  if (opts.signal) {
    const controller = new AbortController();
    opts.signal.addEventListener("abort", () => controller.abort());
    chain = chain.signal(controller);
  }

  const raw = await chain.post(payload).json();
  const parsed = Boltz2ResponseSchema.parse(raw);
  return parsed;
};

// Add the mutation hook
export const useBoltz2Mutation = () => {
  const [, enqueue] = useAtom(enqueueJobAtom);
  const [jobs] = useAtom(jobsAtom);

  // Find the most recent Boltz2 job
  const latestBoltz2Job = useMemo(() => {
    const boltz2Jobs = jobs.filter((job) => job.kind === "boltz2");
    return boltz2Jobs.length > 0 
      ? boltz2Jobs.reduce((latest, current) => 
          current.createdAt > latest.createdAt ? current : latest
        )
      : null;
  }, [jobs]);

  // Map job states to hook return values
  const isFolding = latestBoltz2Job?.status === "queued" || latestBoltz2Job?.status === "running";
  const foldingError = latestBoltz2Job?.status === "error" 
    ? (latestBoltz2Job.error instanceof Error ? latestBoltz2Job.error : new Error(String(latestBoltz2Job.error)))
    : null;
  const foldingResult = latestBoltz2Job?.status === "success" ? latestBoltz2Job.response : undefined;
  const isFoldingSuccess = latestBoltz2Job?.status === "success";

  const foldBoltz2WithQueue = (payload: Boltz2Request) => {
    enqueue({
      kind: "boltz2",
      request: payload,
    });
  };

  return {
    foldBoltz2: foldBoltz2WithQueue,
    isFolding,
    foldingError,
    foldingResult,
    isFoldingSuccess,
  };
};
