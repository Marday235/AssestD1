import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CollaborateurForm } from "@/components/dashboard/Collaborateurs/CollaborateurForm";
import type { Collaborateur, CollaborateurFormValues } from "@/components/dashboard/Collaborateurs/collaborateur.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface EditCollaborateurDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborateur?: Collaborateur;
  onSubmit: (values: CollaborateurFormValues, logoStorageId?: Id<"_storage">) => Promise<void>;
}

/** Dialog modale pour créer ou modifier un collaborateur. */
export function EditCollaborateurDialog({
  open,
  onOpenChange,
  collaborateur,
  onSubmit,
}: EditCollaborateurDialogProps) {
  const isEditing = Boolean(collaborateur);

  async function handleSubmit(values: CollaborateurFormValues, logoStorageId?: Id<"_storage">) {
    await onSubmit(values, logoStorageId);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le collaborateur" : "Ajouter un collaborateur"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mets à jour les informations de ce collaborateur."
              : "Renseigne les informations du nouveau collaborateur."}
          </DialogDescription>
        </DialogHeader>
        <CollaborateurForm
          defaultValues={collaborateur}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel={isEditing ? "Enregistrer les modifications" : "Ajouter le collaborateur"}
        />
      </DialogContent>
    </Dialog>
  );
}
