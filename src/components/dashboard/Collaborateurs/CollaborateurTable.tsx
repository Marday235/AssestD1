import { useState } from "react";
import { Building2, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getInitials } from "@/lib/utils";
import type { Collaborateur } from "@/components/dashboard/Collaborateurs/collaborateur.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface CollaborateurTableProps {
  collaborateurs: Collaborateur[] | undefined;
  isLoading: boolean;
  hasSearch: boolean;
  onEdit: (collaborateur: Collaborateur) => void;
  onDelete: (id: Id<"collaborateurs">) => Promise<void>;
}

/** Tableau listant les collaborateurs avec actions de modification et suppression. */
export function CollaborateurTable({
  collaborateurs,
  isLoading,
  hasSearch,
  onEdit,
  onDelete,
}: CollaborateurTableProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<"collaborateurs"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!collaborateurs || collaborateurs.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title={hasSearch ? "Aucun résultat" : "Aucun collaborateur pour l'instant"}
        description={
          hasSearch ? "Essaie une autre recherche." : "Ajoute le premier collaborateur de l'association."
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
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collaborateur</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Adresse</TableHead>
              <TableHead className="hidden sm:table-cell">Site web</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collaborateurs.map((collaborateur) => (
              <TableRow key={collaborateur._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="rounded-md">
                      <AvatarImage src={collaborateur.logoUrl ?? undefined} alt={collaborateur.nom} />
                      <AvatarFallback className="rounded-md">
                        {getInitials(collaborateur.nom)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium leading-tight">{collaborateur.nom}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <p className="text-foreground">{collaborateur.email}</p>
                  <p className="text-xs text-muted-foreground">{collaborateur.telephone}</p>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                  {collaborateur.adresse}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {collaborateur.siteWeb ? (
                    <a
                      href={collaborateur.siteWeb}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Visiter <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(collaborateur)}>
                        <Pencil className="h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setPendingDeleteId(collaborateur._id)}
                      >
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce collaborateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le collaborateur sera définitivement retiré de la liste.
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
