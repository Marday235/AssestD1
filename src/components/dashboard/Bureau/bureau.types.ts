import { z } from "zod";
import type { Id } from "../../../../convex/_generated/dataModel";

export const STATUTS_BUREAU = ["Présent", "Ancien"] as const;
export type StatutBureau = (typeof STATUTS_BUREAU)[number];

/** Liste ordonnée des postes du bureau — l'ordre détermine le tri d'affichage. */
export const POSTES_BUREAU = [
  "Président",
  "Vice-Président",
  "Secrétaire Général",
  "Secrétaire Général Adjoint",
  "Trésorier",
  "Trésorier Adjoint",
  "Chargée des Affaires Féminines",
  "Chargée des Affaires Féminines Adjointe",
  "Chargé des Relations Extérieures",
  "Chargé des Relations Extérieures Adjoint",
  "Chargé de la Communication",
  "Chargé de la Communication Adjoint",
  "Chargé des Affaires Culturelles",
  "Chargé des Affaires Culturelles Adjoint",
  "Chargé des Affaires Sportives",
  "Chargé des Affaires Sportives Adjoint",
  "Chargé des Affaires Académiques",
  "Chargé des Affaires Académiques Adjoint",
  "Censeur",
  "Censeur Adjoint",
  "Conseiller",
] as const;

/** Retourne le rang d'un poste pour le tri (poste inconnu → en fin de liste). */
export function getPosteRank(role: string): number {
  const idx = POSTES_BUREAU.indexOf(role as (typeof POSTES_BUREAU)[number]);
  return idx === -1 ? POSTES_BUREAU.length : idx;
}

/** Schéma de validation du formulaire d'un membre du bureau. */
export const bureauFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  telephone: z
    .string()
    .min(8, "Le numéro de téléphone est trop court.")
    .regex(/^[0-9+\s()-]+$/, "Format de téléphone invalide."),
  role: z.string().min(2, "Le rôle est requis."),
  niveauEtude: z.string().min(2, "Le niveau d'étude est requis."),
  statut: z.enum(["Présent", "Ancien"]),
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
  age: number;
  photoStorageId?: Id<"_storage">;
  photoUrl?: string | null;
  role: string;
  niveauEtude: string;
  statut: StatutBureau;
  bio?: string;
}
