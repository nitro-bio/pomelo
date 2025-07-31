import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ProteinSequenceRequest,
  ProteinFoldingResponse,
  ProteinFoldingResponseSchema,
  ProteinFoldingHealthResponse,
  ProteinFoldingHealthResponseSchema,
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
