import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { CandidatureStage, StageFormValues } from "@/components/dashboard/Stage/stage.types";

/**
 * Hook centralisant tous les accès Convex pour le module Stage (candidatures).
 * Aucun composant ne doit appeler useQuery/useMutation directement.
 */
export function useStages() {
  const candidatures = useQuery(api.stages.getAll) as CandidatureStage[] | undefined;
  const createMutation = useMutation(api.stages.create);
  const updateMutation = useMutation(api.stages.update);
  const removeMutation = useMutation(api.stages.remove);


  async function create(
    values: StageFormValues,
    dossierStorageId?: Id<"_storage">,
    dossierNom?: string
  ) {
    await createMutation({
      nom: values.nom,
      age: values.age,
      numero: values.numero,
      niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      statutPaiement : values.statutPaiement ?? "Non payé",
      datePaiement: values.datePaiement || undefined,
      dossierStorageId,
      dossierNom,
    });
  }

  async function update(
    id: Id<"stages">,
    values: StageFormValues,
    dossierStorageId?: Id<"_storage">,
    dossierNom?: string
  ) {
    await updateMutation({
      id,
      nom: values.nom,
      age: values.age,
      numero: values.numero,
      niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
     statutPaiement : values.statutPaiement ?? "Non payé",
      datePaiement: values.datePaiement || undefined,
      dossierStorageId,
      dossierNom,
    });
  }
  async function createPublic(
    values: StageFormValues,
    dossierStorageId?: Id<"_storage">,
    dossierNom?: string
  ) {
    await createMutation({
      nom: values.nom,
      age: values.age,
      numero: values.numero,
      niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      statutPaiement: "Non payé",
      dossierStorageId,
      dossierNom,
    });
  }
    async function markAsPaid(candidature: CandidatureStage) {
      await updateMutation({
        id: candidature._id,
        nom: candidature.nom,
        numero: candidature.numero.toString(),
        age: candidature.age.toString(),
        niveau: candidature.niveau,
        lettreMotivation: candidature.lettreMotivation,
        statutPaiement: "Payé",
        datePaiement: new Date().toISOString().slice(0, 10),
        dossierStorageId: candidature.dossierStorageId,
        dossierNom: candidature.dossierNom,
      });
    }
  async function remove(id: Id<"stages">) {
    await removeMutation({ id });
  }

  return {
    candidatures,
    isLoading: candidatures === undefined,
    create,
    update,
    remove,
    createPublic,
    markAsPaid
  };
}
