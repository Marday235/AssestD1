import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { CandidatureStage, StageFormValues, StagePublicFormValues } from "@/components/Stage/stage.types";

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
      niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      statutPaiement: values.statutPaiement,
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
      niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      statutPaiement: values.statutPaiement,
      datePaiement: values.datePaiement || undefined,
      dossierStorageId,
      dossierNom,
    });
  }

  /** Dépôt de candidature côté client : statut de paiement fixé à "Non payé" par défaut. */
  async function createPublic(
    values: StagePublicFormValues,
    dossierStorageId?: Id<"_storage">,
    dossierNom?: string
  ) {
    await createMutation({
      nom: values.nom,
      age: values.age,
      niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      statutPaiement: "Non payé",
      dossierStorageId,
      dossierNom,
    });
  }

  /** Bascule rapidement une candidature en "Payé" avec la date du jour, sans repasser par le formulaire complet. */
  async function markAsPaid(candidature: CandidatureStage) {
    await updateMutation({
      id: candidature._id,
      nom: candidature.nom,
      age: candidature.age,
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
    createPublic,
    update,
    markAsPaid,
    remove,
  };
}
