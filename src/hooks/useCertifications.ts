import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { Certification, CertificationFormValues } from "@/components/dashboard/Certifications/certification.types";

/**
 * Hook centralisant tous les accès Convex pour le module Certifications.
 * Aucun composant ne doit appeler useQuery/useMutation directement.
 */
export function useCertifications() {
  const certifications = useQuery(api.certifications.getAll) as Certification[] | undefined;
  const createMutation = useMutation(api.certifications.create);
  const updateMutation = useMutation(api.certifications.update);
  const removeMutation = useMutation(api.certifications.remove);

  async function create(values: CertificationFormValues, imageStorageId?: Id<"_storage">) {
    await createMutation({
      nom: values.nom,
      organisme: values.organisme,
      numero: values.numero,
      description: values.description,
      dateObtention: values.dateObtention,
      dateExpiration: values.dateExpiration || undefined,
      imageStorageId,
    });
  }

  async function update(
    id: Id<"certifications">,
    values: CertificationFormValues,
    imageStorageId?: Id<"_storage">
  ) {
    await updateMutation({
      id,
      nom: values.nom,
      organisme: values.organisme,
      numero: values.numero,
      description: values.description,
      dateObtention: values.dateObtention,
      dateExpiration: values.dateExpiration || undefined,
      imageStorageId,
    });
  }

  async function remove(id: Id<"certifications">) {
    await removeMutation({ id });
  }

  return {
    certifications,
    isLoading: certifications === undefined,
    create,
    update,
    remove,
  };
}
