import { z } from "zod";
import type { Id } from "../../../../convex/_generated/dataModel";

/** Schéma de validation du formulaire d'un collaborateur (partenaire / organisme). */
export const collaborateurFormSchema = z.object({
  nom: z.string().min(2, "Le nom est requis."),
  telephone: z
    .string()
    .min(8, "Le numéro de téléphone est trop court.")
    .regex(/^[0-9+\s()-]+$/, "Format de téléphone invalide."),
  email: z.string().email("Adresse e-mail invalide."),
  adresse: z.string().min(3, "L'adresse est requise."),
  siteWeb: z
    .string()
    .url("URL invalide (ex: https://exemple.com).")
    .optional()
    .or(z.literal("")),
  description: z.string().max(1000, "La description ne doit pas dépasser 1000 caractères.").optional(),
  logoStorageId: z.string().optional(),
});

export type CollaborateurFormValues = z.infer<typeof collaborateurFormSchema>;

/** Représente un collaborateur tel que renvoyé par Convex. */
export interface Collaborateur {
  _id: Id<"collaborateurs">;
  _creationTime: number;
  nom: string;
  logoStorageId?: Id<"_storage">;
  logoUrl?: string | null;
  telephone: string;
  email: string;
  adresse: string;
  siteWeb?: string;
  description?: string;
}
