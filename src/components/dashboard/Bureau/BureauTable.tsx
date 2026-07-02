import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import type { MembreBureau } from "@/components/dashboard/Bureau/bureau.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface BureauTableProps {
  membres: MembreBureau[] | undefined;
  isLoading: boolean;
  hasSearch: boolean;
  onEdit: (membre: MembreBureau) => void;
  onDelete: (id: Id<"bureau">) => Promise<void>;
}

/** Tableau listant les membres du bureau avec actions de modification et suppression. */
export function BureauTable({ membres, isLoading, hasSearch, onEdit, onDelete }: BureauTableProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<"bureau"> | null>(null);
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

  if (!membres || membres.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={hasSearch ? "Aucun résultat" : "Aucun membre pour l'instant"}
        description={
          hasSearch
            ? "Essaie une autre recherche."
            : "Ajoute le premier membre du bureau pour commencer."
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
              <TableHead>Membre</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="hidden md:table-cell">Téléphone</TableHead>
              <TableHead className="hidden lg:table-cell">Niveau d'étude</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membres.map((membre) => (
              <TableRow key={membre._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={membre.photoUrl ?? undefined} alt={membre.prenom} />
                      <AvatarFallback>{getInitials(membre.prenom, membre.nom)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-tight">
                        {membre.prenom} {membre.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">{membre.age} ans</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{membre.role}</TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {membre.telephone}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                  {membre.niveauEtude}
                </TableCell>
                <TableCell>
                  <Badge variant={membre.statut === "Présent" ? "success" : "secondary"}>
                    {membre.statut}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
