import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/ui/select";
import { MultiImageUploader } from "@/components/dashboard/MultiImageUploader";
import { MONTANT_STAGE, STATUTS_PAIEMENT, stageFormSchema, type CandidatureStage, type StageFormValues } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface StageFormProps {
  defaultValues?: CandidatureStage;
  onSubmit: (values: StageFormValues, photoStorageIds: Id<"_storage">[]) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function StageForm({ defaultValues, onSubmit, onCancel, submitLabel = "Enregistrer" }: StageFormProps) {
  const [photoStorageIds, setPhotoStorageIds] = useState<Id<"_storage">[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StageFormValues>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: defaultValues ? {
      nom: defaultValues.nom, niveau: defaultValues.niveau,
      numero: defaultValues.numero,
      lettreMotivation: defaultValues.lettreMotivation,
      statutPaiement: defaultValues.statutPaiement,
      datePaiement: defaultValues.datePaiement ?? "",
    } : { statutPaiement: "Non payé" },
  });

  const statutValue = watch("statutPaiement");

  async function handleFormSubmit(values: StageFormValues) {
    setIsSubmitting(true);
    try { await onSubmit(values, photoStorageIds); }
    finally { setIsSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-2 ">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        <div>
          <Label htmlFor="nom">Nom complet</Label>
          <Input id="nom" {...register("nom")} placeholder="Nom et prénom" />
          {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
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
        <Textarea id="lettreMotivation" {...register("lettreMotivation")} placeholder="Contenu de la lettre…" rows={4} />
        {errors.lettreMotivation && <p className="mt-1 text-xs text-destructive">{errors.lettreMotivation.message}</p>}
      </div>

      <div>
        <Label className="mb-2 block">Documents / Photos du dossier</Label>
        <MultiImageUploader onUploaded={setPhotoStorageIds} />
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Frais de dossier</span>
          <span className="font-display text-lg font-semibold text-accent">{MONTANT_STAGE} FR</span>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block">Statut de paiement</Label>
            <Select value={statutValue} onValueChange={(v) => setValue("statutPaiement", v as StageFormValues["statutPaiement"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUTS_PAIEMENT.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="datePaiement">Date de paiement</Label>
            <Input id="datePaiement" type="date" {...register("datePaiement")} />
            {errors.datePaiement && <p className="mt-1 text-xs text-destructive">{errors.datePaiement.message}</p>}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Annuler</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}{submitLabel}
        </Button>
      </div>
    </form>
  );
}
