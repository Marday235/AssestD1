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
import { FileUploader } from "@/components/dashboard/FileUploader";
import {
  MONTANT_STAGE,
  STATUTS_PAIEMENT,
  stageFormSchema,
  type CandidatureStage,
  type StageFormValues,
} from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface StageFormProps {
  defaultValues?: CandidatureStage;
  onSubmit: (
    values: StageFormValues,
    dossierStorageId?: Id<"_storage">,
    dossierNom?: string
  ) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

/** Formulaire d'ajout/modification d'une candidature de stage. Validation via Zod. */
export function StageForm({ defaultValues, onSubmit, onCancel, submitLabel = "Enregistrer" }: StageFormProps) {
  const [dossierStorageId, setDossierStorageId] = useState<Id<"_storage"> | undefined>(
    defaultValues?.dossierStorageId
  );
  const [dossierNom, setDossierNom] = useState<string | undefined>(defaultValues?.dossierNom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: defaultValues
      ? {
          nom: defaultValues.nom,
          age: defaultValues.age.toString(),
          numero: defaultValues.numero,
          niveau: defaultValues.niveau,
          lettreMotivation: defaultValues.lettreMotivation,
          statutPaiement: defaultValues.statutPaiement ,
          datePaiement: defaultValues.datePaiement ?? "",
        }
      : {
          statutPaiement: "Non payé",
        },
  });

  const statutValue = watch("statutPaiement");

  async function handleFormSubmit(values: StageFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values, dossierStorageId, dossierNom);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-1">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="nom">Nom complet</Label>
          <Input id="nom" {...register("nom")} placeholder="Nom et prénom du candidat" />
          {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
        </div>
        <div>
          <Label htmlFor="age">Âge</Label>
          <Input id="age"  {...register("age")} placeholder="22" />
          {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="niveau">Niveau d'étude</Label>
        <Input id="niveau" {...register("niveau")} placeholder="Ex : Licence 3, Master 1…" />
        {errors.niveau && <p className="mt-1 text-xs text-destructive">{errors.niveau.message}</p>}
      </div>
      <div>
          <Label htmlFor="numero">Numéro</Label>
          <Input id="numero" {...register("numero")} placeholder="N° de certification" />
          {errors.numero && <p className="mt-1 text-xs text-destructive">{errors.numero.message}</p>}
        </div>
      <div>
        <Label htmlFor="lettreMotivation">Lettre de motivation</Label>
        <Textarea
          id="lettreMotivation"
          {...register("lettreMotivation")}
          placeholder="Contenu ou résumé de la lettre de motivation…"
          rows={5}
        />
        {errors.lettreMotivation && (
          <p className="mt-1 text-xs text-destructive">{errors.lettreMotivation.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block">Dossier (CV, diplôme… au format PDF)</Label>
        <FileUploader
          currentFileName={defaultValues?.dossierNom}
          currentFileUrl={defaultValues?.dossierUrl}
          onUploaded={(storageId, fileName) => {
            setDossierStorageId(storageId);
            setDossierNom(fileName);
          }}
          onClear={() => {
            setDossierStorageId(undefined);
            setDossierNom(undefined);
          }}
        />
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Frais de dossier à payer</span>
          <span className="font-display text-lg font-semibold text-accent">{MONTANT_STAGE} FR</span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block">Statut de paiement</Label>
            <Select
              value={statutValue}
              onValueChange={(value) => setValue("statutPaiement", value as StageFormValues["statutPaiement"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {STATUTS_PAIEMENT.map((statut) => (
                  <SelectItem key={statut} value={statut}>
                    {statut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.statutPaiement && (
              <p className="mt-1 text-xs text-destructive">{errors.statutPaiement.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="datePaiement">Date de paiement</Label>
            <Input id="datePaiement" type="date" {...register("datePaiement")} />
            {errors.datePaiement && (
              <p className="mt-1 text-xs text-destructive">{errors.datePaiement.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col-reverse gap-1.5 sm:flex-row sm:justify-end">
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
