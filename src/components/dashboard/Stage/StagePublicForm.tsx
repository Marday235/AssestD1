import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/dashboard/FileUploader";
import {
  MONTANT_STAGE,
  stagePublicFormSchema,
  type CandidatureStage,
  type StagePublicFormValues,
} from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface StagePublicFormProps {
  defaultValues?: CandidatureStage;
  onSubmit: (
    values: StagePublicFormValues,
    dossierStorageId?: Id<"_storage">,
    dossierNom?: string
  ) => Promise<void>;
}

/** Formulaire public de dépôt de candidature de stage, sans gestion du paiement. */
export function StagePublicForm({ onSubmit ,defaultValues }: StagePublicFormProps) {
  const [dossierStorageId, setDossierStorageId] = useState<Id<"_storage"> | undefined>(undefined);
  const [dossierNom, setDossierNom] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StagePublicFormValues>({
      resolver: zodResolver(stagePublicFormSchema),
      defaultValues: defaultValues
        ? {
            nom: defaultValues.nom,
            age: defaultValues.age.toString(),
            numero: defaultValues.numero,
            niveau: defaultValues.niveau,
            lettreMotivation: defaultValues.lettreMotivation,
            statutPaiement: "non paye",
            datePaiement: defaultValues.datePaiement ?? "",
          }
        : {
            statutPaiement: "Non payé",
          },
    });

  async function handleFormSubmit(values: StagePublicFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values, dossierStorageId, dossierNom);
      reset();
      setDossierStorageId(undefined);
      setDossierNom(undefined);
    } finally {
      setIsSubmitting(false);
    }
  }

  

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="nom">Nom complet</Label>
          <Input id="nom" {...register("nom")} placeholder="Ton nom et prénom" />
          {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
        </div>
        <div>
          <Label htmlFor="age">Âge</Label>
          <Input id="age" type="number" {...register("age")} placeholder="22" />
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
          <Input id="numero" {...register("numero")} placeholder="N°" />
          {errors.numero && <p className="mt-1 text-xs text-destructive">{errors.numero.message}</p>}
        </div>
      <div>
        <Label htmlFor="lettreMotivation">Lettre de motivation</Label>
        <Textarea
          id="lettreMotivation"
          {...register("lettreMotivation")}
          placeholder="Explique pourquoi tu souhaites faire ce stage avec nous…"
          rows={6}
        />
        {errors.lettreMotivation && (
          <p className="mt-1 text-xs text-destructive">{errors.lettreMotivation.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block">Dossier (CV, diplôme… au format PDF)</Label>
        <FileUploader
          onUploaded={(storageId, fileName) => {
            setDossierStorageId(storageId);
            setDossierNom(fileName);
          }}
          onClear={() => {
            setDossierStorageId(undefined);
            setDossierNom(undefined);
          }}
          label="Joindre mon dossier PDF"
        />
      </div>

      <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm">
        <p className="font-medium text-accent-foreground">
          Des frais de dossier de <span className="font-semibold">{MONTANT_STAGE} FR</span> sont à
          régler une fois ta candidature étudiée.
        </p>
        <p className="mt-1 text-muted-foreground">
          Tu seras recontacté(e) avec les modalités de paiement après l'étude de ton dossier.
        </p>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? "Envoi en cours…" : "Envoyer ma candidature"}
      </Button>
    </form>
  );
}
