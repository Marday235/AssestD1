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
  collaborateurFormSchema,
  type Collaborateur,
  type CollaborateurFormValues,
} from "@/components/dashboard/Collaborateurs/collaborateur.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface CollaborateurFormProps {
  defaultValues?: Collaborateur;
  onSubmit: (values: CollaborateurFormValues, logoStorageId?: Id<"_storage">) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

/** Formulaire d'ajout/modification d'un collaborateur (partenaire). Validation via Zod. */
export function CollaborateurForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
}: CollaborateurFormProps) {
  const [logoStorageId, setLogoStorageId] = useState<Id<"_storage"> | undefined>(
    defaultValues?.logoStorageId
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollaborateurFormValues>({
    resolver: zodResolver(collaborateurFormSchema),
    defaultValues: defaultValues
      ? {
          nom: defaultValues.nom,
          telephone: defaultValues.telephone,
          email: defaultValues.email,
          adresse: defaultValues.adresse,
          siteWeb: defaultValues.siteWeb ?? "",
          description: defaultValues.description ?? "",
        }
      : undefined,
  });

  async function handleFormSubmit(values: CollaborateurFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values, logoStorageId);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div>
        <Label className="mb-2 block">Logo</Label>
        <ImageUploader
          currentImageUrl={defaultValues?.logoUrl}
          onUploaded={setLogoStorageId}
          onClear={() => setLogoStorageId(undefined)}
          shape="square"
          label="Choisir un logo"
        />
      </div>

      <div>
        <Label htmlFor="nom">Nom du collaborateur</Label>
        <Input id="nom" {...register("nom")} placeholder="Entreprise ou organisme partenaire" />
        {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" {...register("telephone")} placeholder="+237 6 00 00 00 00" />
          {errors.telephone && <p className="mt-1 text-xs text-destructive">{errors.telephone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} placeholder="contact@exemple.com" />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="adresse">Adresse</Label>
        <Input id="adresse" {...register("adresse")} placeholder="Ville, pays" />
        {errors.adresse && <p className="mt-1 text-xs text-destructive">{errors.adresse.message}</p>}
      </div>

      <div>
        <Label htmlFor="siteWeb">Site web</Label>
        <Input id="siteWeb" {...register("siteWeb")} placeholder="https://exemple.com" />
        {errors.siteWeb && <p className="mt-1 text-xs text-destructive">{errors.siteWeb.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Présentation du partenariat…"
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
