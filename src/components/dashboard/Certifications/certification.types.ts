import { z } from "zod";
import type { Id } from "../../../../convex/_generated/dataModel";

/** Schéma de validation du formulaire d'une certification. */
export const certificationFormSchema = z
  .object({
    nom: z.string().min(2, "Le nom de la certification est requis."),
    organisme: z.string().min(2, "L'organisme délivrant la certification est requis."),
    numero: z.string().min(1, "Le numéro de certification est requis."),
    description: z.string().max(1000, "La description ne doit pas dépasser 1000 caractères.").optional(),
    dateObtention: z.string().min(1, "La date d'obtention est requise."),
    dateExpiration: z.string().optional().or(z.literal("")),
    imageStorageId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.dateExpiration) return true;
      return new Date(data.dateExpiration) >= new Date(data.dateObtention);
    },
    {
      message: "La date d'expiration doit être postérieure à la date d'obtention.",
      path: ["dateExpiration"],
    }
  );

export type CertificationFormValues = z.infer<typeof certificationFormSchema>;

/** Représente une certification telle que renvoyée par Convex. */
export interface Certification {
  _id: Id<"certifications">;
  _creationTime: number;
  nom: string;
  organisme: string;
  numero: string;
  description?: string;
  imageStorageId?: Id<"_storage">;
  imageUrl?: string | null;
  dateObtention: string;
  dateExpiration?: string;
}
