import { z } from "zod";
import type { Id } from "../../../../convex/_generated/dataModel";

export const STATUTS_PAIEMENT = ["Payé", "Non payé"] as const;
export type StatutPaiement = (typeof STATUTS_PAIEMENT)[number];

export const MONTANT_STAGE = 1000;

export interface StagePhoto {
  _id: Id<"stage_photos">;
  _creationTime: number;
  stageId: Id<"stages">;
  imageStorageId: Id<"_storage">;
  imageUrl: string | null;
  ordre: number;
}

export interface CandidatureStage {
  _id: Id<"stages">;
  _creationTime: number;
  nom: string;
  numero: string;
  niveau: string;
  lettreMotivation: string;
  photos: StagePhoto[];
  montant: number;
  statutPaiement: StatutPaiement;
  datePaiement?: string;
}

/** Schéma admin (avec paiement). */
export const stageFormSchema = z
  .object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    niveau: z.string().min(1, "Le niveau d'étude est requis."),
    numero: z.string().min(1, "Le numéro de certification est requis."),
    lettreMotivation: z.string()
      .min(20, "La lettre de motivation doit contenir au moins 20 caractères.")
      .max(3000, "Maximum 3000 caractères."),
    statutPaiement: z.enum(STATUTS_PAIEMENT),
    datePaiement: z.string().optional().or(z.literal("")),
  })
  .refine((d) => d.statutPaiement === "Non payé" || Boolean(d.datePaiement), {
    message: "La date de paiement est requise quand le statut est 'Payé'.",
    path: ["datePaiement"],
  });

export type StageFormValues = z.infer<typeof stageFormSchema>;

/** Schéma public (sans paiement). */
export const stagePublicFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  numero: z.string().min(1, "Le numéro de certification est requis."),
  niveau: z.string().min(1, "Le niveau d'étude est requis."),
  lettreMotivation: z.string()
    .min(20, "La lettre de motivation doit contenir au moins 20 caractères.")
    .max(3000, "Maximum 3000 caractères."),
});

export type StagePublicFormValues = z.infer<typeof stagePublicFormSchema>;
