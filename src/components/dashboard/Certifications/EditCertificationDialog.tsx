import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CertificationForm } from "@/components/dashboard/Certifications/CertificationForm";
import type { Certification, CertificationFormValues } from "@/components/dashboard/Certifications/certification.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface EditCertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: Certification;
  onSubmit: (values: CertificationFormValues, imageStorageId?: Id<"_storage">) => Promise<void>;
}

/** Dialog modale pour créer ou modifier une certification. */
export function EditCertificationDialog({
  open,
  onOpenChange,
  certification,
  onSubmit,
}: EditCertificationDialogProps) {
  const isEditing = Boolean(certification);

  async function handleSubmit(values: CertificationFormValues, imageStorageId?: Id<"_storage">) {
    await onSubmit(values, imageStorageId);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la certification" : "Ajouter une certification"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mets à jour les informations de cette certification."
              : "Renseigne les informations de la nouvelle certification."}
          </DialogDescription>
        </DialogHeader>
        <CertificationForm
          defaultValues={certification}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel={isEditing ? "Enregistrer les modifications" : "Ajouter la certification"}
        />
      </DialogContent>
    </Dialog>
  );
}
