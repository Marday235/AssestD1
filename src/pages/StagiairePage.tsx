import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Award, CalendarDays, GraduationCap, ImageOff,
  Loader2, Trash2, User,
} from "lucide-react";
import { useStageById } from "@/hooks/useStageById";
import { useStages } from "@/hooks/useStages";
import { useToast } from "@/components/dashboard/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/dashboard/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/dashboard/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card";
import { MultiImageUploader } from "@/components/dashboard/MultiImageUploader";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/dashboard/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import type { Id } from "../../convex/_generated/dataModel";
import type { StagePhoto } from "@/components/dashboard/Stage/stage.types";
import { MONTANT_STAGE } from "@/components/dashboard/Stage/stage.types";

/** Lightbox minimaliste pour les photos du dossier. */
function PhotoLightbox({ photos, index: initial, onClose }: {
  photos: StagePhoto[]; index: number; onClose: () => void;
}) {
  const [index, setIndex] = useState(initial);
  const photo = photos[index];
  if (!photo) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 backdrop-blur-sm" onClick={onClose}>
      <div className="relative flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex w-full items-center justify-between px-1">
          <span className="text-sm text-white/70">{index + 1} / {photos.length}</span>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-transparent" onClick={onClose}>✕</Button>
        </div>
        <img src={photo.imageUrl ?? ""} alt="" className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" />
        {photos.length > 1 && (
          <div className="flex gap-1.5">
            {photos.map((p, i) => (
              <button key={p._id} type="button" onClick={() => setIndex(i)}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded ${i === index ? "ring-2 ring-white" : "opacity-50"}`}>
                <img src={p.imageUrl ?? ""} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Page dédiée affichant la fiche complète d'un stagiaire. */
export default function StagiairePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { candidature, isLoading } = useStageById(id as Id<"stages"> | null);
  const { markAsPaid, addPhotos, removePhoto, remove } = useStages();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<Id<"stage_photos"> | null>(null);
  const [showDeleteCandidat, setShowDeleteCandidat] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4">
        <Skeleton className="h-8 w-32" />
      </header>
      <main className="container max-w-3xl py-8 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </main>
    </div>
  );

  if (!candidature) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
      <GraduationCap className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">Candidature introuvable.</p>
      <Button variant="outline" onClick={() => navigate("/admin")}>Retour à l'admin</Button>
    </div>
  );

  async function handleMarkAsPaid() {
    setIsMarkingPaid(true);
    try {
      await markAsPaid(candidature!._id);
      toast({ title: "Paiement enregistré", description: `${candidature!.nom} est marqué(e) comme payé(e).` });
    } catch {
      toast({ title: "Erreur", variant: "destructive", description: "La mise à jour a échoué." });
    } finally {
      setIsMarkingPaid(false);
    }
  }

  async function handleAddPhotos(storageIds: Id<"_storage">[]) {
    if (storageIds.length === 0) return;
    try {
      await addPhotos(candidature!._id, storageIds);
      toast({ title: "Photos ajoutées", description: `${storageIds.length} photo(s) ajoutée(s).` });
    } catch {
      toast({ title: "Erreur", variant: "destructive", description: "L'ajout a échoué." });
    }
  }

  async function confirmDeletePhoto() {
    if (!deletingPhotoId) return;
    try {
      await removePhoto(deletingPhotoId);
      toast({ title: "Photo supprimée" });
    } catch {
      toast({ title: "Erreur", variant: "destructive", description: "La suppression a échoué." });
    } finally {
      setDeletingPhotoId(null);
    }
  }

  async function confirmDeleteCandidat() {
    try {
      await remove(candidature!._id);
      toast({ title: "Candidature supprimée" });
      navigate("/admin");
    } catch {
      toast({ title: "Erreur", variant: "destructive", description: "La suppression a échoué." });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
          <div className="flex items-center gap-2">
            {candidature.statutPaiement === "Non payé" && (
              <Button size="sm" onClick={handleMarkAsPaid} disabled={isMarkingPaid}>
                {isMarkingPaid ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                Marquer payé
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDeleteCandidat(true)}>
              <Trash2 className="h-4 w-4" /> Supprimer
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl py-6 space-y-6">
        {/* Carte identité */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {candidature.photos[0]?.imageUrl ? (
                  <img src={candidature.photos[0].imageUrl} alt={candidature.nom}
                    className="h-16 w-16 rounded-full object-cover shrink-0 cursor-pointer"
                    onClick={() => setLightboxIndex(0)} />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-7 w-7 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-xl">{candidature.nom}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{candidature.niveau} · {candidature.numero} ans</p>
                </div>
              </div>
              <Badge variant={candidature.statutPaiement === "Payé" ? "success" : "destructive"} className="text-sm">
                {candidature.statutPaiement}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 shrink-0" />
                <span>{candidature.niveau}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="h-4 w-4 shrink-0" />
                <span>{MONTANT_STAGE} FR</span>
                {candidature.statutPaiement === "Payé" && candidature.datePaiement && (
                  <span className="text-xs">· payé le {formatDate(candidature.datePaiement)}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>Candidature du {formatDate(candidature._creationTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lettre de motivation */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lettre de motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {candidature.lettreMotivation}
            </p>
          </CardContent>
        </Card>

        {/* Photos du dossier */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Dossier — {candidature.photos.length} photo{candidature.photos.length !== 1 ? "s" : ""}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidature.photos.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <ImageOff className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Aucune photo de dossier.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {candidature.photos.map((photo, index) => (
                  <div key={photo._id} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
                    <img src={photo.imageUrl ?? ""} alt={`Dossier ${index + 1}`}
                      className="h-full w-full object-cover cursor-pointer"
                      onClick={() => setLightboxIndex(index)} />
                    <button type="button"
                      onClick={() => setDeletingPhotoId(photo._id)}
                      className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Separator />
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Ajouter des photos</p>
              <MultiImageUploader onUploaded={handleAddPhotos} />
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && candidature.photos.length > 0 && (
        <PhotoLightbox photos={candidature.photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      {/* Supprimer photo */}
      <AlertDialog open={deletingPhotoId !== null} onOpenChange={(open) => !open && setDeletingPhotoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePhoto}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Supprimer candidature */}
      <AlertDialog open={showDeleteCandidat} onOpenChange={setShowDeleteCandidat}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {candidature.nom} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La candidature et toutes ses photos seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCandidat}>Supprimer définitivement</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
