import { useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStages } from "@/hooks/useStages";
import { StagePublicForm } from "@/components/dashboard/Stage/StagePublicForm";
import type { StagePublicFormValues } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../convex/_generated/dataModel";

export default function PostulerPage() {
  const { createPublic } = useStages();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: StagePublicFormValues, photoStorageIds: Id<"_storage">[]) {
    setError(null);
    try {
      await createPublic(values, photoStorageIds);
      setIsSubmitted(true);
    } catch {
      setError("Une erreur est survenue lors de l'envoi. Réessaie dans quelques instants.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header compact mobile */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold leading-tight text-sm">Candidature de stage</p>
            <p className="text-xs text-muted-foreground">Remplis le formulaire ci-dessous</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-12 max-w-xl mx-auto">
        {isSubmitted ? (
          /* Confirmation */
          <div className="flex flex-col items-center gap-5 py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold">Candidature envoyée !</h2>
              <p className="text-muted-foreground max-w-xs">
                Merci ! Notre équipe va étudier ton dossier et te recontacter prochainement.
              </p>
            </div>
            <Button variant="outline" className="mt-2 h-12 w-full text-base" onClick={() => setIsSubmitted(false)}>
              Déposer une autre candidature
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-1">
              <h1 className="font-display text-2xl font-semibold">Postule pour un stage</h1>
              <p className="text-sm text-muted-foreground">Tous les champs sont requis.</p>
            </div>

            <StagePublicForm onSubmit={handleSubmit} />

            {error && (
              <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
