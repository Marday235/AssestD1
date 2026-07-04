import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { BureauFormValues, MembreBureau } from "@/components/dashboard/Bureau/bureau.types";

/**
 * Hook centralisant tous les accès Convex pour le module Bureau.
 * Aucun composant ne doit appeler useQuery/useMutation directement :
 * tout passe par ici (getAll, create, update, remove).
 */
export function useBureau() {
  const membres = useQuery(api.bureau.getAll) as MembreBureau[] | undefined;
  const createMutation = useMutation(api.bureau.create);
  const updateMutation = useMutation(api.bureau.update);
  const removeMutation = useMutation(api.bureau.remove);

  async function create(values: BureauFormValues, photoStorageId?: Id<"_storage">) {
    await createMutation({
      nom: values.nom,
      prenom: values.prenom,
      telephone: values.telephone,
      role: values.role,
      niveauEtude: values.niveauEtude,
      statut: "Présent" ,
      bio: values.bio,
      photoStorageId,
    });
  }

  async function update(
    id: Id<"bureau">,
    values: BureauFormValues,
    photoStorageId?: Id<"_storage">
  ) {
    await updateMutation({
      id,
      nom: values.nom,
      prenom: values.prenom,
      telephone: values.telephone,
      role: values.role,
      niveauEtude: values.niveauEtude,
      statut: values.statut ?? "Présent",
      bio: values.bio,
      photoStorageId,
    });
  }

  async function remove(id: Id<"bureau">) {
    await removeMutation({ id });
  }

  return {
    membres,
    isLoading: membres === undefined,
    create,
    update,
    remove,
  };
}
