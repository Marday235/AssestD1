import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import {
  certificationFormSchema,
  type Certification,
  type CertificationFormValues,
} from "@/components/dashboard/Certifications/certification.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface CertificationFormProps {
  defaultValues?: Certification;
  onSubmit: (values: CertificationFormValues, imageStorageId?: Id<"_storage">) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

/** Formulaire d'ajout/modification d'une certification. Validation via Zod. */
export function CertificationForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
}: CertificationFormProps) {
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | undefined>(
    defaultValues?.imageStorageId
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: defaultValues
      ? {
          nom: defaultValues.nom,
          organisme: defaultValues.organisme,
          numero: defaultValues.numero,
          description: defaultValues.description ?? "",
          dateObtention: defaultValues.dateObtention,
          dateExpiration: defaultValues.dateExpiration ?? "",
        }
      : undefined,
  });

  async function handleFormSubmit(values: CertificationFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values, imageStorageId);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div>
        <Label className="mb-2 block">Image / Justificatif</Label>
        <ImageUploader
          currentImageUrl={defaultValues?.imageUrl}
          onUploaded={setImageStorageId}
          onClear={() => setImageStorageId(undefined)}
          shape="wide"
          label="Choisir une image"
        />
      </div>

      <div>
        <Label htmlFor="nom">Nom de la certification</Label>
        <Input id="nom" {...register("nom")} placeholder="Ex : Certification qualité ISO" />
        {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="organisme">Organisme</Label>
          <Input id="organisme" {...register("organisme")} placeholder="Organisme délivrant la certification" />
          {errors.organisme && <p className="mt-1 text-xs text-destructive">{errors.organisme.message}</p>}
        </div>
        <div>
          <Label htmlFor="numero">Numéro</Label>
          <Input id="numero" {...register("numero")} placeholder="N° de certification" />
          {errors.numero && <p className="mt-1 text-xs text-destructive">{errors.numero.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="dateObtention">Date d'obtention</Label>
          <Input id="dateObtention" type="date" {...register("dateObtention")} />
          {errors.dateObtention && (
            <p className="mt-1 text-xs text-destructive">{errors.dateObtention.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="dateExpiration">Date d'expiration</Label>
          <Input id="dateExpiration" type="date" {...register("dateExpiration")} />
          {errors.dateExpiration && (
            <p className="mt-1 text-xs text-destructive">{errors.dateExpiration.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Contexte ou portée de la certification…"
          rows={3}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
