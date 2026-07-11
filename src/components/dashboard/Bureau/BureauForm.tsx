import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/ui/select";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import {
  bureauFormSchema,
  POSTES_BUREAU,
  STATUTS_BUREAU,
  type BureauFormValues,
  type MembreBureau,
} from "@/components/dashboard/Bureau/bureau.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface BureauFormProps {
  defaultValues?: MembreBureau;
  onSubmit: (values: BureauFormValues, photoStorageId?: Id<"_storage">) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

/** Formulaire d'ajout/modification d'un membre du bureau. Validation via Zod. */
export function BureauForm({ defaultValues, onSubmit, onCancel, submitLabel = "Enregistrer" }: BureauFormProps) {
  const [photoStorageId, setPhotoStorageId] = useState<Id<"_storage"> | undefined>(
    defaultValues?.photoStorageId
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BureauFormValues>({
    resolver: zodResolver(bureauFormSchema),
    defaultValues: defaultValues
      ? {
          nom: defaultValues.nom,
          prenom: defaultValues.prenom,
          telephone: defaultValues.telephone,
          role: defaultValues.role,
          niveauEtude: defaultValues.niveauEtude,
          statut: defaultValues.statut,
          bio: defaultValues.bio ?? "",
        }
      : {
          statut: "Présent",
        },
  });

  const statutValue = watch("statut");
  const roleValue = watch("role");

  async function handleFormSubmit(values: BureauFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values, photoStorageId);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        handleSubmit(handleFormSubmit)();
      }
    }}
    className="flex flex-col gap-4">
      <div>
        <Label className="mb-2 block">Photo</Label>
        <ImageUploader
          currentImageUrl={defaultValues?.photoUrl}
          onUploaded={setPhotoStorageId}
          onClear={() => setPhotoStorageId(undefined)}
          shape="circle"
          label="Choisir une photo"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" {...register("prenom")} placeholder="Jean" />
          {errors.prenom && <p className="mt-1 text-xs text-destructive">{errors.prenom.message}</p>}
        </div>
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" {...register("nom")} placeholder="Dupont" />
          {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" {...register("telephone")} placeholder="+237 6 00 00 00 00" />
          {errors.telephone && <p className="mt-1 text-xs text-destructive">{errors.telephone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block">Poste</Label>
          <Select
            value={roleValue ?? ""}
            onValueChange={(value) => setValue("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un poste" />
            </SelectTrigger>
            <SelectContent>
              {POSTES_BUREAU.map((poste) => (
                <SelectItem key={poste} value={poste}>
                  {poste}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>}
        </div>
        <div>
          <Label htmlFor="niveauEtude">Niveau d'étude</Label>
          <Input id="niveauEtude" {...register("niveauEtude")} placeholder="Master 2" />
          {errors.niveauEtude && (
            <p className="mt-1 text-xs text-destructive">{errors.niveauEtude.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">Statut</Label>
        <Select
          value={statutValue}
          onValueChange={(value) => setValue("statut", value as BureauFormValues["statut"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            {STATUTS_BUREAU.map((statut) => (
              <SelectItem key={statut} value={statut}>
                {statut}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.statut && <p className="mt-1 text-xs text-destructive">{errors.statut.message}</p>}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" {...register("bio")} placeholder="Quelques mots sur ce membre…" rows={3} />
        {errors.bio && <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>}
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
