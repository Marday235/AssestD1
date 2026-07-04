import { useMutation, useQuery } from "convex/react";
import { api } from "./../../convex/_generated/api";
import type { Id } from "./../../convex/_generated/dataModel";
import type { EvenementFormValues, EvenementGalerie, PhotoAvecUrl } from "@/components/dashboard/Galerie/galerie.types";

/**
 * Hook centralisant tous les accès Convex pour le module Galerie.
 * Architecture : Événements (conteneurs) + Photos (plusieurs par événement).
 */
export function useGalerie() {
  const photosHasard = useQuery(api.galerie.getPhotosHasard) as PhotoAvecUrl[] | undefined;
  const evenementsAdmin = useQuery(api.galerie.getAllEvenements) as EvenementGalerie[] | undefined;

  


  const createEvenementMutation = useMutation(api.galerie.createEvenement);
  const updateEvenementMutation = useMutation(api.galerie.updateEvenement);
  const removeEvenementMutation = useMutation(api.galerie.removeEvenement);
  const addPhotosMutation = useMutation(api.galerie.addPhotos);
  const removePhotoMutation = useMutation(api.galerie.removePhoto);

  async function createEvenement(values: EvenementFormValues): Promise<Id<"evenements_galerie">> {
    return await createEvenementMutation({
      nom: values.nom,
      description: values.description,
      date: values.date,
    });
  }

  async function updateEvenement(id: Id<"evenements_galerie">, values: EvenementFormValues) {
    await updateEvenementMutation({ id, ...values });
  }

  async function removeEvenement(id: Id<"evenements_galerie">) {
    await removeEvenementMutation({ id });
  }

  async function addPhotos(evenementId: Id<"evenements_galerie">, storageIds: Id<"_storage">[]) {
    await addPhotosMutation({ evenementId, storageIds });
  }

  async function removePhoto(id: Id<"galerie">) {
    await removePhotoMutation({ id });
  }

  return {
    photosHasard,
    evenementsAdmin,
    isLoading: photosHasard === undefined,
    createEvenement,
    updateEvenement,
    removeEvenement,
    addPhotos,
    removePhoto,
  };
}
