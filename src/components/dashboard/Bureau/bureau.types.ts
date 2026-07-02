import { z } from "zod";
import type { Id } from "../../../../convex/_generated/dataModel";

export const STATUTS_BUREAU = ["Présent", "Ancien"] as const;
export type StatutBureau = (typeof STATUTS_BUREAU)[number];

/** Schéma de validation du formulaire d'un membre du bureau. */
export const bureauFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  telephone: z
    .string()
    .min(8, "Le numéro de téléphone est trop court.")
    .regex(/^[0-9+\s()-]+$/, "Format de téléphone invalide."),
  age: z.string(),
  role: z.string().min(2, "Le rôle est requis."),
  niveauEtude: z.string().min(2, "Le niveau d'étude est requis."),
  statut: z.string("Le statut doit être 'Présent' ou 'Ancien'." ),
  bio: z.string().max(1000, "La bio ne doit pas dépasser 1000 caractères.").optional(),
  photoStorageId: z.string().optional(),
});

export type BureauFormValues = z.infer<typeof bureauFormSchema>;

/** Représente un membre du bureau tel que renvoyé par Convex (avec son _id et son URL de photo résolue). */
export interface MembreBureau {
  _id: Id<"bureau">;
  _creationTime: number;
  nom: string;
  prenom: string;
  telephone: string;
  age: string;
  photoStorageId?: Id<"_storage">;
  photoUrl?: string | null;
  role: string;
  niveauEtude: string;
  statut: StatutBureau;
  bio?: string;
}
