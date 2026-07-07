import { useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/dashboard/ui/badge";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { getPosteRank } from "@/components/dashboard/Bureau/bureau.types";
import type { MembreBureau } from "@/components/dashboard/Bureau/bureau.types";
import type { Id } from "../../../../convex/_generated/dataModel";

const INITIAL_COUNT = 10;

interface BureauGridProps {
  membres: MembreBureau[] | undefined;
  isLoading: boolean;
  hasSearch: boolean;
  onEdit: (membre: MembreBureau) => void;
  onDelete: (id: Id<"bureau">) => Promise<void>;
}

/** Grille des membres du bureau triée par poste officiel, 10 premiers + bouton Voir plus. */
export function BureauGrid({ membres, isLoading, hasSearch, onEdit, onDelete }: BureauGridProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<"bureau"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="mt-2 grid w-full grid-cols-2 gap-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-24" />
            <Skeleton className="mt-3 h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!membres || membres.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={hasSearch ? "Aucun résultat" : "Aucun membre pour l'instant"}
        description={
          hasSearch ? "Essaie une autre recherche." : "Ajoute le premier membre du bureau pour commencer."
        }
      />
    );
  }

  // Tri par rang de poste (ordre officiel), puis alphabétique à rang égal
  const sorted = [...membres].sort((a, b) => {
    const diff = getPosteRank(a.role) - getPosteRank(b.role);
    if (diff !== 0) return diff;
    return a.nom.localeCompare(b.nom);
  });

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
  const hasMore = sorted.length > INITIAL_COUNT;

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
      {/* Grille : 2 colonnes mobile, 4 colonnes desktop */}
      <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4 bg-transparent">
        {visible.map((membre) => (
          <div key={membre._id} className="group relative">
            {/* Menu actions — visible au survol */}
            <div className="absolute right-0 top-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(membre)}>
                    <Pencil className="h-4 w-4" /> Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setPendingDeleteId(membre._id)}
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <img
              alt={membre.prenom}
              className="h-20 w-20 m-5 rounded-full bg-transparent object-cover"
              height={120}
              src={membre.photoUrl ?? undefined}
              width={120}
            />
            <h3 className="mt-4 font-semibold text-lg leading-tight">
              {membre.prenom} {membre.nom}
            </h3>
            <p className="text-muted-foreground text-sm">{membre.role}</p>
            <p className="mt-3 text-sm">{membre.bio}</p>
            <Badge variant={membre.statut === "Présent" ? "success" : "secondary"} className="mt-3">
              {membre.statut}
            </Badge>
          </div>
        ))}
      </div>

      {/* Bouton Voir plus / Réduire — affiché seulement si nécessaire */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? (
              <><ChevronUp className="h-4 w-4" /> Réduire</>
            ) : (
              <><ChevronDown className="h-4 w-4" /> Voir les {sorted.length - INITIAL_COUNT} autres membres</>
            )}
          </Button>
        </div>
      )}

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce membre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le membre sera définitivement retiré du bureau.
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
