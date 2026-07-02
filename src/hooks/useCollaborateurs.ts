import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { Collaborateur, CollaborateurFormValues } from "@/components/dashboard/Collaborateurs/collaborateur.types";

/**
 * Hook centralisant tous les accès Convex pour le module Collaborateurs.
 * Aucun composant ne doit appeler useQuery/useMutation directement.
 */
export function useCollaborateurs() {
  const collaborateurs = useQuery(api.collaborateurs.getAll) as Collaborateur[] | undefined;
  const createMutation = useMutation(api.collaborateurs.create);
  const updateMutation = useMutation(api.collaborateurs.update);
  const removeMutation = useMutation(api.collaborateurs.remove);

  async function create(values: CollaborateurFormValues, logoStorageId?: Id<"_storage">) {
    await createMutation({
      nom: values.nom,
      telephone: values.telephone,
      email: values.email,
      adresse: values.adresse,
      siteWeb: values.siteWeb || undefined,
      description: values.description,
      logoStorageId,
    });
  }

  async function update(
    id: Id<"collaborateurs">,
    values: CollaborateurFormValues,
    logoStorageId?: Id<"_storage">
  ) {
    await updateMutation({
      id,
      nom: values.nom,
      telephone: values.telephone,
      email: values.email,
      adresse: values.adresse,
      siteWeb: values.siteWeb || undefined,
      description: values.description,
      logoStorageId,
    });
  }

  async function remove(id: Id<"collaborateurs">) {
    await removeMutation({ id });
  }

  return {
    collaborateurs,
    isLoading: collaborateurs === undefined,
    create,
    update,
    remove,
  };
}
