import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Images,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/dashboard/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dashboard/ui/alert-dialog";
import { EmptyState } from "@/components/dashboard/shared";
import { formatDate } from "@/lib/utils";
import type { EvenementGalerie, PhotoAvecUrl } from "@/components/dashboard/Galerie/galerie.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface GalerieEvenementsProps {
  evenementsAdmin: EvenementGalerie[] | undefined;
  isLoading: boolean;
  hasSearch: boolean;
  onEdit: (evenement: EvenementGalerie) => void;
  onDelete: (id: Id<"evenements_galerie">) => Promise<void>;
  onDeletePhoto: (id: Id<"galerie">) => Promise<void>;
  onAddPhotos: (evenement: EvenementGalerie) => void;
}

/** Lightbox simple pour naviguer dans les photos d'un événement. */
function Lightbox({
  photos,
  initialIndex,
  onClose,
  onDeletePhoto,
}: {
  photos: PhotoAvecUrl[];
  initialIndex: number;
  onClose: () => void;
  onDeletePhoto: (id: Id<"galerie">) => Promise<void>;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [deletingId, setDeletingId] = useState<Id<"galerie"> | null>(null);
  const photo = photos[index];
  if (!photo) return null;

  function prev() {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }
  function next() {
    setIndex((i) => (i + 1) % photos.length);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    await onDeletePhoto(deletingId);
    setDeletingId(null);
    // Si c'était la dernière photo, fermer
    if (photos.length <= 1) {
      onClose();
    } else {
      setIndex((i) => Math.min(i, photos.length - 2));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panneau principal */}
      <div
        className="relative flex max-h-[92vh] max-w-[92vw] flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barre de contrôles */}
        <div className="flex w-full items-center justify-between px-1">
          <span className="text-sm text-white/70">
            {index + 1} / {photos.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-destructive hover:bg-transparent"
              onClick={() => setDeletingId(photo._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-transparent"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex items-center justify-center">
          {photos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-12 text-white/70 hover:text-white hover:bg-white/10 z-10"
              onClick={prev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <img
            src={photo.imageUrl ?? ""}
            alt={`Photo ${index + 1}`}
            className="max-h-[78vh] max-w-[80vw] rounded-lg object-contain shadow-2xl"
          />
          {photos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-12 text-white/70 hover:text-white hover:bg-white/10 z-10"
              onClick={next}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Pellicule miniature */}
        {photos.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto py-1">
            {photos.map((p, i) => (
              <button
                key={p._id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded transition-opacity ${
                  i === index ? "ring-2 ring-white opacity-100" : "opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={p.imageUrl ?? ""}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** Grille des événements photos avec lightbox et actions de gestion. */
export function GalerieEvenements({
  evenementsAdmin,
  isLoading,
  hasSearch,
  onEdit,
  onDelete,
  onDeletePhoto,
  onAddPhotos,
}: GalerieEvenementsProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<"evenements_galerie"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lightbox, setLightbox] = useState<{ photos: PhotoAvecUrl[]; index: number } | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  console.log(evenementsAdmin);
  

  if (!evenementsAdmin || evenementsAdmin.length === 0) {
    return (
      <EmptyState
        icon={Images}
        title={hasSearch ? "Aucun résultat" : "Aucun événement pour l'instant"}
        description={
          hasSearch
            ? "Essaie une autre recherche."
            : "Crée le premier événement pour y ajouter des photos."
        }
      />
    );
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(pendingDeleteId);
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {evenementsAdmin.map((evt) => (
          <Card key={evt._id} className="overflow-hidden">
            {/* Mosaïque de couverture */}
            <div
              className="relative cursor-pointer"
              onClick={() =>
                evt.photos.length > 0 && setLightbox({ photos: evt.photos, index: 0 })
              }
            >
              {evt.photos.length === 0 ? (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <Images className="h-8 w-8 text-muted-foreground" />
                </div>
              ) : evt.photos.length === 1 ? (
                <img
                  src={evt.photos[0]!.imageUrl ?? ""}
                  alt={evt.nom}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="grid h-48 grid-cols-2 gap-0.5">
                  <img
                    src={evt.photos[0]!.imageUrl ?? ""}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="grid grid-rows-2 gap-0.5">
                    <img
                      src={evt.photos[1]!.imageUrl ?? ""}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {evt.photos.length > 2 ? (
                      <div className="relative">
                        <img
                          src={evt.photos[2]!.imageUrl ?? ""}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        {evt.photos.length > 3 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-foreground/55">
                            <span className="font-display text-xl font-semibold text-white">
                              +{evt.photos.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-muted" />
                    )}
                  </div>
                </div>
              )}

              <Badge variant="destructive" className="absolute left-2 top-2">
                {evt.nombrePhotos} photo{evt.nombrePhotos !== 1 ? "s" : ""}
              </Badge>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display truncate font-semibold">{evt.nom}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(evt.date)}
                  </p>
                  {evt.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {evt.description}
                    </p>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onAddPhotos(evt)}>
                      <Plus className="h-4 w-4" /> Ajouter des photos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(evt)}>
                      <Pencil className="h-4 w-4" /> Modifier l'événement
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setPendingDeleteId(evt._id)}
                    >
                      <Trash2 className="h-4 w-4" /> Supprimer l'événement
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onDeletePhoto={async (id) => {
            await onDeletePhoto(id);
            setLightbox((prev) => {
              if (!prev) return null;
              const updated = prev.photos.filter((p) => p._id !== id);
              if (updated.length === 0) return null;
              return { photos: updated, index: Math.min(prev.index, updated.length - 1) };
            });
          }}
        />
      )}

      {/* Dialog suppression événement */}
      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les photos de cet événement seront supprimées définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
