import { z } from "zod";

export const EsmfoldRequestSchema = z.object({
  sequence: z.string().min(1).max(10000),
});
export type EsmfoldRequest = z.infer<typeof EsmfoldRequestSchema>;

export const EsmfoldResultSchema = z.object({
  pdb: z.string(),
  plddt: z.array(z.number()),
});
export type EsmfoldResult = z.infer<typeof EsmfoldResultSchema>;

export const EsmfoldResponseSchema = z.object({
  results: z.array(EsmfoldResultSchema),
});
export type EsmfoldResponse = z.infer<typeof EsmfoldResponseSchema>;

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
