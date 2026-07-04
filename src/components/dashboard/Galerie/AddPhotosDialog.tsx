import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/dashboard/ui/dialog";
import { Button } from "@/components/ui/button";
import { MultiImageUploader } from "@/components/dashboard/MultiImageUploader";
import type { EvenementGalerie } from "@/components/dashboard/Galerie/galerie.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface AddPhotosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evenementsAdmin: EvenementGalerie | null;
  onSubmit: (evenementId: Id<"evenements_galerie">, storageIds: Id<"_storage">[]) => Promise<void>;
}

/** Dialog pour ajouter plusieurs photos à un événement existant. */
export function AddPhotosDialog({ open, onOpenChange, evenementsAdmin, onSubmit }: AddPhotosDialogProps) {
  const [storageIds, setStorageIds] = useState<Id<"_storage">[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!evenementsAdmin || storageIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(evenementsAdmin._id, storageIds);
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
          <DialogTitle>Ajouter des photos</DialogTitle>
          <DialogDescription>
            {evenementsAdmin ? (
              <>Ajouter des photos à <strong>{evenementsAdmin.nom}</strong></>
            ) : (
              "Sélectionne les photos à ajouter."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <MultiImageUploader onUploaded={setStorageIds} />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || storageIds.length === 0}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Ajouter {storageIds.length > 0 ? `${storageIds.length} photo${storageIds.length > 1 ? "s" : ""}` : "les photos"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
