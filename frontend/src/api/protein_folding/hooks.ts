import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ProteinSequenceRequest,
  ProteinFoldingResponse,
  ProteinFoldingResponseSchema,
  ProteinFoldingHealthResponse,
  ProteinFoldingHealthResponseSchema,
  Boltz2Request,
  Boltz2Response,
  Boltz2ResponseSchema,
} from "./schemas";
import { apiRouter } from "@/api/router";

const foldProteinEsmfold = async (
  payload: ProteinSequenceRequest,
): Promise<ProteinFoldingResponse> => {
  const raw = await apiRouter.url("/protein_fold/esmfold").post(payload).json();
  const parsed = ProteinFoldingResponseSchema.parse(raw);
  return parsed;
};

export const useFoldProteinMutation = () => {
  const {
    mutate: foldProtein,
    isPending: isFolding,
    error: foldingError,
    data: foldingResult,
    isSuccess: isFoldingSuccess,
  } = useMutation({
    mutationFn: (payload: ProteinSequenceRequest) => {
      return foldProteinEsmfold(payload);
    },
    onError: (error) => {
      console.error("Protein folding failed:", error);
    },
  });

  return {
    foldProtein,
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
const foldBoltz2Protein = async (
  payload: Boltz2Request,
): Promise<Boltz2Response> => {
  const raw = await apiRouter.url("/protein_fold/boltz2").post(payload).json();
  const parsed = Boltz2ResponseSchema.parse(raw);
  return parsed;
};

// Add the mutation hook
export const useBoltz2Mutation = () => {
  const {
    mutate: foldBoltz2,
    isPending: isFolding,
    error: foldingError,
    data: foldingResult,
    isSuccess: isFoldingSuccess,
  } = useMutation({
    mutationFn: (payload: Boltz2Request) => {
      return foldBoltz2Protein(payload);
    },
    onError: (error) => {
      console.error("Boltz-2 folding failed:", error);
    },
  });

  return {
    foldBoltz2,
    isFolding,
    foldingError,
    foldingResult,
    isFoldingSuccess,
  };
};
