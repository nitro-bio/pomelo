import { atom, createStore, type Getter, type Setter } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { nanoid } from "nanoid";
import { Job, JobKind, JobRequestMap, JobSchema } from "./jobTypes";
import {
  Boltz2RequestSchema,
  Boltz2ResponseSchema,
  EsmfoldRequestSchema,
  EsmfoldResponseSchema,
} from "@/api/protein_folding/schemas";

export const jobStore = createStore();
export const jobsAtom = atomWithStorage<Job[]>("jobQueue", []);

export const enqueueJobAtom = atom(
  null,
  <K extends JobKind>(
    get: Getter,
    set: Setter,
    payload: { kind: K; request: JobRequestMap[K] },
  ) => {
    // Validate request based on kind
    switch (payload.kind) {
      case "esmfold":
        EsmfoldRequestSchema.parse(payload.request);
        break;
      case "boltz2":
        Boltz2RequestSchema.parse(payload.request);
        break;
      default:
        throw new Error(`Unknown job kind: ${payload.kind}`);
    }

    const job: Job = JobSchema.parse({
      id: nanoid(),
      kind: payload.kind,
      status: "queued",
      createdAt: Date.now(),
      attempts: 0,
      request: payload.request,
    });

    set(jobsAtom, [...get(jobsAtom), job]);
  },
);

export const markRunningAtom = atom(null, (get, set, id: string) => {
  set(
    jobsAtom,
    get(jobsAtom).map((j) =>
      j.id === id
        ? {
            ...j,
            status: "running" as const,
            startedAt: Date.now(),
            attempts: j.attempts + 1,
          }
        : j,
    ),
  );
});

export const finishOkAtom = atom(
  null,
  (get: Getter, set: Setter, args: { id: string; response: unknown }) => {
    set(
      jobsAtom,
      get(jobsAtom).map((j) => {
        if (j.id !== args.id) return j;

        // Validate response based on job kind
        switch (j.kind) {
          case "esmfold": {
            const parsed = EsmfoldResponseSchema.parse(args.response);
            return {
              ...j,
              status: "success" as const,
              response: parsed,
              finishedAt: Date.now(),
            } as Job;
          }
          case "boltz2": {
            const parsed = Boltz2ResponseSchema.parse(args.response);
            return {
              ...j,
              status: "success" as const,
              response: parsed,
              finishedAt: Date.now(),
            } as Job;
          }
          default:
            throw new Error(`Unknown job kind`);
        }
      }),
    );
  },
);

export const finishErrAtom = atom(
  null,
  (get, set, args: { id: string; error: unknown; cancelled?: boolean }) => {
    set(
      jobsAtom,
      get(jobsAtom).map((j) =>
        j.id === args.id
          ? {
              ...j,
              status: args.cancelled
                ? ("cancelled" as const)
                : ("error" as const),
              error: args.error,
              finishedAt: Date.now(),
            }
          : j,
      ),
    );
  },
);

export const removeJobAtom = atom(null, (get, set, id: string) => {
  set(
    jobsAtom,
    get(jobsAtom).filter((j) => j.id !== id),
  );
});

// selectors
export const queuedJobsAtom = atom((get) =>
  get(jobsAtom).filter((j) => j.status === "queued"),
);
export const runningJobsAtom = atom((get) =>
  get(jobsAtom).filter((j) => j.status === "running"),
);
export const completedJobsAtom = atom((get) =>
  get(jobsAtom).filter((j) => j.status === "success"),
);
export const getJobsByIdsAtom = atom(
  (get) => (ids: string[]) => get(jobsAtom).filter((j) => ids.includes(j.id)),
);
