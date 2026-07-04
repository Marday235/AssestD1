import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { CandidatureStage, StageFormValues, StagePublicFormValues } from "@/components/dashboard/Stage/stage.types";

export function useStages() {
  const candidatures = useQuery(api.stages.getAll) as CandidatureStage[] | undefined;
  const createMutation = useMutation(api.stages.create);
  const updateMutation = useMutation(api.stages.update);
  const removeMutation = useMutation(api.stages.remove);
  const markAsPaidMutation = useMutation(api.stages.markAsPaid);
  const addPhotosMutation = useMutation(api.stages.addPhotos);
  const removePhotoMutation = useMutation(api.stages.removePhoto);

  async function create(values: StageFormValues, photoStorageIds?: Id<"_storage">[]) {
    await createMutation({
      nom: values.nom,  numero: values.numero, niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      datePaiement: values.datePaiement || undefined,
      photoStorageIds,
    });
  }

  async function createPublic(values: StagePublicFormValues, photoStorageIds?: Id<"_storage">[]) {
    await createMutation({
      nom: values.nom,   numero: values.numero, niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      photoStorageIds,
    });
  }

  async function update(id: Id<"stages">, values: StageFormValues) {
    await updateMutation({
      id, nom: values.nom,   numero: values.numero, niveau: values.niveau,
      lettreMotivation: values.lettreMotivation,
      statutPaiement: values.statutPaiement,
      datePaiement: values.datePaiement || undefined,
    });
  }

  async function markAsPaid(id: Id<"stages">) {
    await markAsPaidMutation({ id });
  }

  async function addPhotos(stageId: Id<"stages">, photoStorageIds: Id<"_storage">[]) {
    await addPhotosMutation({ stageId, photoStorageIds });
  }

  async function removePhoto(id: Id<"stage_photos">) {
    await removePhotoMutation({ id });
  }

  async function remove(id: Id<"stages">) {
    await removeMutation({ id });
  }

  return {
    candidatures, isLoading: candidatures === undefined,
    create, createPublic, update, markAsPaid, addPhotos, removePhoto, remove,
  };
}
