import { z } from "zod";
import type { Id } from "../../../../convex/_generated/dataModel";

export const STATUTS_PAIEMENT = ["Payé", "Non payé"] as const;
export type StatutPaiement = (typeof STATUTS_PAIEMENT)[number];

/** Montant fixe à payer par chaque candidat au stage, en francs CFA. */
export const MONTANT_STAGE = 1000;

/** Schéma de validation du formulaire d'une candidature de stage. */
export const stageFormSchema = z
  .object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    age: z.string().min(1),
    niveau: z.string().min(1, "Le niveau d'étude est requis."),
    numero: z.string().min(1, "Le numéro pour conctate."),
    lettreMotivation: z
      .string()
      .min(20, "La lettre de motivation doit contenir au moins 20 caractères.")
      .max(3000, "La lettre de motivation ne doit pas dépasser 3000 caractères."),
    statutPaiement: z.string("Le statut doit être 'Payé' ou 'Non payé'." ),
    datePaiement: z.string().optional().or(z.literal("")),
    dossierStorageId: z.string().optional(),
    dossierNom: z.string().optional(),
  })
  .refine((data) => data.statutPaiement === "Non payé" || Boolean(data.datePaiement), {
    message: "La date de paiement est requise quand le statut est 'Payé'.",
    path: ["datePaiement"],
  });
  export const stagePublicFormSchema = z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    age: z.string().min(1),
    niveau: z.string().min(1, "Le niveau d'étude est requis."),
      numero: z.string().min(1, "Le numéro de certification est requis."),
    lettreMotivation: z
      .string()
      .min(20, "La lettre de motivation doit contenir au moins 20 caractères.")
      .max(3000, "La lettre de motivation ne doit pas dépasser 3000 caractères."),
    statutPaiement: z.string("Le statut doit être 'Payé' ou 'Non payé'." ),
    datePaiement: z.string().optional().or(z.literal("")),
    dossierStorageId: z.string().optional(),
    dossierNom: z.string().optional(),
  });

export type StageFormValues = z.infer<typeof stageFormSchema>;

/** Représente une candidature de stage telle que renvoyée par Convex. */
export interface CandidatureStage {
  _id: Id<"stages">;
  _creationTime: number;
  nom: string;
  age: number;
  niveau: string;
  numero: string;
  lettreMotivation: string;
  dossierStorageId?: Id<"_storage">;
  dossierUrl?: string | null;
  dossierNom?: string;
  montant: number;
  statutPaiement: StatutPaiement;
  datePaiement?: string;
}
export type StagePublicFormValues = z.infer<typeof stagePublicFormSchema>;

/** Représente une candidature de stage telle que renvoyée par Convex. */
export interface CandidatureStage {
  _id: Id<"stages">;
  _creationTime: number;
  nom: string;
  age: number;
  niveau: string;
  numero: string;
  lettreMotivation: string;
  dossierStorageId?: Id<"_storage">;
  dossierUrl?: string | null;
  dossierNom?: string;
  montant: number;
  statutPaiement: StatutPaiement;
  datePaiement?: string;
}