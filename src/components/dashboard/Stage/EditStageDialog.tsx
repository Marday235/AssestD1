import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { StageForm } from "@/components/dashboard/Stage/StageForm";
import type { CandidatureStage, StageFormValues } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface EditStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidature?: CandidatureStage;
  onSubmit: (values: StageFormValues, photoStorageIds: Id<"_storage">[]) => Promise<void>;
}

export function EditStageDialog({ open, onOpenChange, candidature, onSubmit }: EditStageDialogProps) {
  const isEditing = Boolean(candidature);

  async function handleSubmit(values: StageFormValues, photoStorageIds: Id<"_storage">[]) {
    await onSubmit(values, photoStorageIds);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la candidature" : "Ajouter une candidature"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Mets à jour les informations de cette candidature." : "Renseigne les informations du nouveau candidat."}
          </DialogDescription>
        </DialogHeader>
        <StageForm defaultValues={candidature} onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel={isEditing ? "Enregistrer les modifications" : "Ajouter la candidature"} />
      </DialogContent>
    </Dialog>
  );
}
