import { useState } from "react";
import { FileText, GraduationCap, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/dashboard/ui/table";
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
import { formatDate } from "@/lib/utils";
import type { CandidatureStage } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface StageTableProps {
  candidatures: CandidatureStage[] | undefined;
  isLoading: boolean;
  hasSearch: boolean;
  onEdit: (candidature: CandidatureStage) => void;
  onDelete: (id: Id<"stages">) => Promise<void>;
  onMarkAsPaid: (candidature: CandidatureStage) => Promise<void>;
}

/** Tableau listant les candidatures de stage avec statut de paiement et actions. */
export function StageTable({
  candidatures,
  isLoading,
  hasSearch,
  onEdit,
  onDelete,
  onMarkAsPaid,
}: StageTableProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<"stages"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState<Id<"stages"> | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!candidatures || candidatures.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title={hasSearch ? "Aucun résultat" : "Aucune candidature pour l'instant"}
        description={
          hasSearch ? "Essaie une autre recherche." : "Ajoute la première candidature de stage."
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

  async function handleMarkAsPaid(candidature: CandidatureStage) {
    setMarkingPaidId(candidature._id);
    try {
      await onMarkAsPaid(candidature);
    } finally {
      setMarkingPaidId(null);
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidat</TableHead>
              <TableHead className="hidden md:table-cell">Niveau</TableHead>
              <TableHead className="hidden lg:table-cell">Dossier</TableHead>
              <TableHead>Frais (1000 FR)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidatures.map((candidature) => (
              <TableRow key={candidature._id}>
                <TableCell>
                  <p className="font-medium leading-tight">{candidature.nom}</p>
                  <p className="text-xs text-muted-foreground">{candidature.age} ans</p>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {candidature.numero}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {candidature.dossierUrl ? (
                    <a
                      href={candidature.dossierUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" /> Voir le PDF
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {candidature.statutPaiement === "Non payé" ? (
                    <button
                      type="button"
                      onClick={() => handleMarkAsPaid(candidature)}
                      disabled={markingPaidId === candidature._id}
                      className="inline-flex items-center"
                      title="Cliquer pour marquer comme payé"
                    >
                      <Badge
                        variant="destructive"
                        className="cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-60"
                      >
                        {markingPaidId === candidature._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          candidature.statutPaiement
                        )}
                      </Badge>
                    </button>
                  ) : (
                    <Badge  variant='destructive' >{candidature.statutPaiement}</Badge>
                  )}
                  {candidature.statutPaiement === "Payé" && candidature.datePaiement && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      le {formatDate(candidature.datePaiement)}
                    </p>
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
                      <DropdownMenuItem onClick={() => onEdit(candidature)}>
                        <Pencil className="h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setPendingDeleteId(candidature._id)}
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
            <AlertDialogTitle>Supprimer cette candidature ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La candidature et son dossier seront définitivement supprimés.
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
