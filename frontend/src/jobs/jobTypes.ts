import { z } from "zod";
import {
  Boltz2RequestSchema,
  Boltz2ResponseSchema,
  EsmfoldRequestSchema,
  EsmfoldResponseSchema,
} from "@/api/protein_folding/schemas";

export const JobKindSchema = z.enum(["esmfold", "boltz2"]);
export type JobKind = z.infer<typeof JobKindSchema>;

export const JobStatusSchema = z.enum([
  "queued",
  "running",
  "success",
  "error",
  "cancelled",
]);
export type JobStatus = z.infer<typeof JobStatusSchema>;

const JobBaseSchema = z.object({
  id: z.string(),
  kind: JobKindSchema, // discriminator
  status: JobStatusSchema,
  createdAt: z.number(),
  startedAt: z.number().optional(),
  finishedAt: z.number().optional(),
  attempts: z.number().int().nonnegative(),
});

export const ESMFoldJobSchema = JobBaseSchema.extend({
  kind: z.literal("esmfold"),
  request: EsmfoldRequestSchema,
  response: EsmfoldResponseSchema.optional(),
  error: z.unknown().optional(),
});

export const Boltz2JobSchema = JobBaseSchema.extend({
  kind: z.literal("boltz2"),
  request: Boltz2RequestSchema,
  response: Boltz2ResponseSchema.optional(),
  error: z.unknown().optional(),
});

export const JobSchema = z.discriminatedUnion("kind", [
  ESMFoldJobSchema,
  Boltz2JobSchema,
]);
export type Job = z.infer<typeof JobSchema>;

// Kind → request/response helpers for TypeScript ergonomics
export interface JobRequestMap {
  esmfold: z.infer<typeof EsmfoldRequestSchema>;
  boltz2: z.infer<typeof Boltz2RequestSchema>;
}
export interface JobResponseMap {
  esmfold: z.infer<typeof EsmfoldResponseSchema>;
  boltz2: z.infer<typeof Boltz2ResponseSchema>;
}

export const getJobInfo = (job: Job) => {
  const time = new Date(job.createdAt).toLocaleString();
  const duration =
    job.finishedAt && job.startedAt
      ? `${((job.finishedAt - job.startedAt) / 1000).toFixed(1)}s`
      : "N/A";

  return {
    type: job.kind.toUpperCase(),
    sequence: job.request.sequence,
    sequenceLength: job.request.sequence.length,
    time,
    duration,
  };
};
