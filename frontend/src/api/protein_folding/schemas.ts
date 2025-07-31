import { z } from "zod";

export const ProteinSequenceRequestSchema = z.object({
  sequence: z.string().min(1).max(10000),
});
export type ProteinSequenceRequest = z.infer<
  typeof ProteinSequenceRequestSchema
>;

export const FoldResultSchema = z.object({
  pdb: z.string(),
  plddt: z.array(z.number()),
});
export type FoldResult = z.infer<typeof FoldResultSchema>;

export const ProteinFoldingResponseSchema = z.object({
  results: z.array(FoldResultSchema),
});
export type ProteinFoldingResponse = z.infer<
  typeof ProteinFoldingResponseSchema
>;

export const ProteinFoldingHealthResponseSchema = z.object({
  status: z.string(),
  service: z.string(),
});
export type ProteinFoldingHealthResponse = z.infer<
  typeof ProteinFoldingHealthResponseSchema
>;
