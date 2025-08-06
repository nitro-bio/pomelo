import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import {
  queuedJobsAtom,
  runningJobsAtom,
  markRunningAtom,
  finishOkAtom,
  finishErrAtom,
  jobStore,
} from "./jobQueue";
import { esmfold, foldBoltz2Protein } from "@/api/protein_folding/hooks";
import type {
  EsmfoldRequest,
  Boltz2Request,
} from "@/api/protein_folding/schemas";

export function useJobRunner(
  cfg: { maxConcurrent?: number; pauseWhenOffline?: boolean } = {},
) {
  const maxConcurrent = cfg.maxConcurrent ?? 2;
  const pauseWhenOffline = cfg.pauseWhenOffline ?? true;

  const queued = useAtomValue(queuedJobsAtom);
  const running = useAtomValue(runningJobsAtom);

  const next = queued[0]; // FIFO; add priority to Job to change this
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const tick = async () => {
      const online =
        !pauseWhenOffline ||
        typeof navigator === "undefined" ||
        navigator.onLine;
      if (!online) return;
      if (!next) return;
      if (running.length >= maxConcurrent) return;

      const job = next;
      jobStore.set(markRunningAtom, job.id);
      const ctrl = new AbortController();

      try {
        let response;
        switch (job.kind) {
          case "esmfold":
            response = await esmfold(job.request as EsmfoldRequest, {
              signal: ctrl.signal,
            });
            break;
          case "boltz2":
            response = await foldBoltz2Protein(job.request as Boltz2Request, {
              signal: ctrl.signal,
            });
            break;
          default:
            throw new Error(`Unknown job kind`);
        }

        jobStore.set(finishOkAtom, { id: job.id, response });
      } catch (e: unknown) {
        const cancelled =
          (e as Error)?.name === "AbortError" || ctrl.signal.aborted;
        jobStore.set(finishErrAtom, { id: job.id, error: e, cancelled });
      }
    };

    timer.current = window.setTimeout(tick, 30);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [next?.id, running.length, maxConcurrent, pauseWhenOffline]);
}
