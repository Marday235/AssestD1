import { Images } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { Separator } from "@/components/dashboard/ui/separator";
import { useGalerie } from "@/hooks/useGalerie";
import { Gallery } from "@/components/dashboard/Galerie/Gallery";

/**
 * Page publique de la galerie. Affiche une section "Explore our Gallery"
 * par événement, avec les photos réelles de Convex.
 */
export default function GaleriePage() {
  const { photosHasard, isLoading } = useGalerie();

const evenementsAvecPhotos = photosHasard ?? [];
console.log(evenementsAvecPhotos);


  return (
    <div className="min-h-screen bg-background">
      {/* <header className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-5">
          <div className="seal-mark flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Images className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold leading-tight">Galerie</h1>
            <p className="text-xs text-muted-foreground">Association — Moments en images</p>
          </div>
        </div>
      </header> */}

      <main>
        {isLoading && (
          <div className="container max-w-7xl py-16">
            <div className="mb-12 flex flex-col items-center gap-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-80" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {!isLoading && evenementsAvecPhotos.length === 0 && (
          <div className="container flex flex-col items-center gap-3 py-24 text-center">
            <div className="rounded-full bg-muted p-4">
              <Images className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium">Aucune photo pour l'instant</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Les photos des prochains événements de l'association apparaîtront ici.
            </p>
          </div>
        )}

     <Gallery
  photos={evenementsAvecPhotos ?? []}
/>
      </main>
    </div>
  );
}
