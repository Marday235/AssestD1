import { z } from "zod";
import type { Id } from "../../../../convex/_generated/dataModel";

// ─── Événement ────────────────────────────────────────────────────────────────

export const evenementFormSchema = z.object({
  nom: z.string().min(2, "Le nom de l'événement doit contenir au moins 2 caractères."),
  description: z.string().max(500).optional(),
  date: z.string().min(1, "La date est requise."),
});

export type EvenementFormValues = z.infer<typeof evenementFormSchema>;

export interface PhotoAvecUrl {
  _id: Id<"galerie">;
  _creationTime: number;
  evenementId: Id<"evenements_galerie">;
  imageStorageId: Id<"_storage">;
  imageUrl: string | null;
  ordre: number;
}

export interface EvenementGalerie {
  _id: Id<"evenements_galerie">;
  _creationTime: number;
  nom: string;
  description?: string;
  date: string;
  photos: PhotoAvecUrl[];
  nombrePhotos: number;
  couvertureUrl: string | null;
}

