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

// Request schema for Boltz-2
export const Boltz2RequestSchema = z.object({
  sequence: z.string().min(1).max(10000),
  ligandSmiles: z.string().optional(),
  recyclingSteps: z.number().min(1).max(10).optional(),
  samplingSteps: z.number().min(1).max(100).optional(),
  diffusionSamples: z.number().min(1).max(10).optional(),
});
export type Boltz2Request = z.infer<typeof Boltz2RequestSchema>;

// Result schema for Boltz-2
export const Boltz2ResultSchema = z.object({
  mmcif_string: z.string(),
  plddt: z.array(z.number()),
  confidence_scores: z.array(z.number()),
});
export type Boltz2Result = z.infer<typeof Boltz2ResultSchema>;

// Response schema for Boltz-2
export const Boltz2ResponseSchema = z.object({
  results: z.array(Boltz2ResultSchema),
});
export type Boltz2Response = z.infer<typeof Boltz2ResponseSchema>;
