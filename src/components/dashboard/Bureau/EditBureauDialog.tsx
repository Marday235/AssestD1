import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BureauForm } from "@/components/dashboard/Bureau/BureauForm";
import type { BureauFormValues, MembreBureau } from "@/components/dashboard/Bureau/bureau.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface EditBureauDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membre?: MembreBureau;
  onSubmit: (values: BureauFormValues, photoStorageId?: Id<"_storage">) => Promise<void>;
}

/** Dialog modale pour créer ou modifier un membre du bureau. */
export function EditBureauDialog({ open, onOpenChange, membre, onSubmit }: EditBureauDialogProps) {
  const isEditing = Boolean(membre);

  async function handleSubmit(values: BureauFormValues, photoStorageId?: Id<"_storage">) {
    await onSubmit(values, photoStorageId);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le membre" : "Ajouter un membre du bureau"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mets à jour les informations de ce membre du bureau."
              : "Renseigne les informations du nouveau membre du bureau."}
          </DialogDescription>
        </DialogHeader>
        <BureauForm
          defaultValues={membre}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel={isEditing ? "Enregistrer les modifications" : "Ajouter le membre"}
        />
      </DialogContent>
    </Dialog>
  );
}
