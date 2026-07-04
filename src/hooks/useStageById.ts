import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { CandidatureStage } from "@/components/dashboard/Stage/stage.types";

/** Charge un seul stagiaire avec toutes ses photos. Utilisé sur la page /admin/stagiaires/:id */
export function useStageById(id: Id<"stages"> | null) {
  const candidature = useQuery(
    api.stages.getById,
    id ? { id } : "skip"
  ) as CandidatureStage | null | undefined;

  return {
    candidature: candidature ?? null,
    isLoading: id !== null && candidature === undefined,
  };
}
