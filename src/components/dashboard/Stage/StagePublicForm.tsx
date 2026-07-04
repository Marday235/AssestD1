import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiImageUploader } from "@/components/dashboard/MultiImageUploader";
import { MONTANT_STAGE, stagePublicFormSchema, type StagePublicFormValues } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface StagePublicFormProps {
  onSubmit: (values: StagePublicFormValues, photoStorageIds: Id<"_storage">[]) => Promise<void>;
}

export function StagePublicForm({ onSubmit }: StagePublicFormProps) {
  const [photoStorageIds, setPhotoStorageIds] = useState<Id<"_storage">[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StagePublicFormValues>({
    resolver: zodResolver(stagePublicFormSchema),
  });

  async function handleFormSubmit(values: StagePublicFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values, photoStorageIds);
      reset();
      setPhotoStorageIds([]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      {/* Nom */}
      <div className="space-y-1.5">
        <Label htmlFor="nom" className="text-base font-semibold">Nom complet</Label>
        <Input id="nom" {...register("nom")} placeholder="Ton nom et prénom"
          className="h-12 text-base" autoComplete="name" />
        {errors.nom && <p className="text-sm text-destructive">{errors.nom.message}</p>}
      </div>

      {/* Âge + Niveau côte à côte sur mobile */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="age" className="text-base font-semibold">Numero</Label>
          <Input id="numero" type="number" inputMode="numeric" {...register("numero")}
            placeholder="237 600000000" className="h-12 text-base" />
          {errors.numero && <p className="text-sm text-destructive">{errors.numero.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="niveau" className="text-base font-semibold">Niveau</Label>
          <Input id="niveau" {...register("niveau")} placeholder="Licence 3…"
            className="h-12 text-base" />
          {errors.niveau && <p className="text-sm text-destructive">{errors.niveau.message}</p>}
        </div>
      </div>

      {/* Lettre de motivation */}
      <div className="space-y-1.5">
        <Label htmlFor="lettreMotivation" className="text-base font-semibold">
          Lettre de motivation
        </Label>
        <Textarea id="lettreMotivation" {...register("lettreMotivation")}
          placeholder="Explique pourquoi tu souhaites faire ce stage avec nous…"
          rows={6} className="text-base resize-none" />
        {errors.lettreMotivation && <p className="text-sm text-destructive">{errors.lettreMotivation.message}</p>}
      </div>

      {/* Photos du dossier */}
      <div className="space-y-1.5">
        <Label className="text-base font-semibold">
          Photos du dossier{" "}
          <span className="font-normal text-muted-foreground text-sm">(CV, diplômes, etc.)</span>
        </Label>
        <MultiImageUploader onUploaded={setPhotoStorageIds} />
      </div>

      {/* Info frais */}
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
        <p className="font-semibold text-accent-foreground">
          Frais de dossier :{" "}
          <span className="text-lg">{MONTANT_STAGE} FR</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          À régler une fois ta candidature étudiée. Tu seras recontacté(e) avec les modalités.
        </p>
      </div>

      {/* Bouton */}
      <Button type="submit" size="lg" disabled={isSubmitting}
        className="h-14 w-full text-base font-semibold">
        {isSubmitting
          ? <><Loader2 className="h-5 w-5 animate-spin" /> Envoi en cours…</>
          : <><Send className="h-5 w-5" /> Envoyer ma candidature</>
        }
      </Button>
    </form>
  );
}
