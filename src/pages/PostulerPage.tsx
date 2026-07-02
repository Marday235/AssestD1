import { useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/dashboard/ui/card";
import { useStages } from "@/hooks/useStages";
import { StagePublicForm } from "@/components/dashboard/Stage/StagePublicForm";
import type { StagePublicFormValues } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../convex/_generated/dataModel";
import { HeroHeader } from "@/components/HeroHeader";

/**
 * Page publique de dépôt de candidature de stage. Accessible à tous,
 * sans authentification ni accès à l'espace admin.
 */
export default function PostulerPage() {
  const { create } = useStages();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    values: StagePublicFormValues,
    dossierStorageId?: Id<"_storage">,
    dossierNom?: string
  ) {
    setError(null);
    try {
      await create(values, dossierStorageId, dossierNom);
      setIsSubmitted(true);
    } catch {
      setError("Une erreur est survenue lors de l'envoi. Réessaie dans quelques instants.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <header className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-5 mt-3">
          <div className="seal-mark flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold leading-tight">Candidature de stage</h1>
            <p className="text-xs text-muted-foreground">Association — Espace candidats</p>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-10 sm:py-14">
        {isSubmitted ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <h2 className="font-display text-xl font-semibold">Candidature envoyée !</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Merci pour ta candidature. Notre équipe va l'étudier et te recontactera prochainement
                avec les modalités de paiement des frais de dossier.
              </p>
              <Button variant="outline" className="mt-2" onClick={() => setIsSubmitted(false)}>
                Déposer une autre candidature
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Postule pour un stage
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Remplis le formulaire ci-dessous pour déposer ta candidature. Tous les champs sont
                requis.
              </p>
            </div>

            <Card>
              <CardContent className="p-5 sm:p-6">
                <StagePublicForm onSubmit={handleSubmit} />
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
