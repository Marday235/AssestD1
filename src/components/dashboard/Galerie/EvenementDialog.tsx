import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiImageUploader } from "@/components/dashboard/MultiImageUploader";
import { evenementFormSchema, type EvenementFormValues, type EvenementGalerie } from "@/components/dashboard/Galerie/galerie.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface EvenementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evenementsAdmin?: EvenementGalerie;
  onSubmit: (
    values: EvenementFormValues,
    storageIds: Id<"_storage">[]
  ) => Promise<void>;
}

/** Dialog pour créer un événement photo ou en modifier les infos + ajouter des photos. */
export function EvenementDialog({ open, onOpenChange, evenementsAdmin, onSubmit }: EvenementDialogProps) {
  const isEditing = Boolean(evenementsAdmin);
  const [storageIds, setStorageIds] = useState<Id<"_storage">[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EvenementFormValues>({
    resolver: zodResolver(evenementFormSchema),
    values: evenementsAdmin
      ? { nom: evenementsAdmin.nom, description: evenementsAdmin.description ?? "", date: evenementsAdmin.date }
      : undefined,
  });

  async function handleFormSubmit(values: EvenementFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values, storageIds);
      reset();
      setStorageIds([]);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier l'événement" : "Nouvel événement photo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mets à jour les infos de l'événement ou ajoute de nouvelles photos."
              : "Nomme l'événement et sélectionne toutes les photos à la fois."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="nom">Nom de l'événement</Label>
            <Input
              id="nom"
              {...register("nom")}
              placeholder="Ex : Assemblée générale 2025, Journée sportive…"
            />
            {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
          </div>

          <div>
            <Label htmlFor="date">Date de l'événement</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description (facultative)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Quelques mots sur cet événement…"
              rows={2}
            />
          </div>

          <div>
            <Label className="mb-2 block">
              Photos{" "}
              {!isEditing && <span className="text-muted-foreground">(sélectionne-en plusieurs à la fois)</span>}
            </Label>
            <MultiImageUploader onUploaded={setStorageIds} />
          </div>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Enregistrer" : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
