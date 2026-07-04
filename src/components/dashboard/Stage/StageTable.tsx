import { useState } from "react";
import { FileText, GraduationCap, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/ui/table";
import { Badge } from "@/components/dashboard/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/dashboard/ui/alert-dialog";
import { EmptyState } from "@/components/dashboard/shared";
import { formatDate } from "@/lib/utils";
import type { CandidatureStage } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface StageTableProps {
  candidatures: CandidatureStage[] | undefined;
  isLoading: boolean;
  hasSearch: boolean;
  onEdit: (c: CandidatureStage) => void;
  onDelete: (id: Id<"stages">) => Promise<void>;
  onMarkAsPaid: (c: CandidatureStage) => Promise<void>;
}

export function StageTable({ candidatures, isLoading, hasSearch, onEdit, onDelete, onMarkAsPaid }: StageTableProps) {
  const navigate = useNavigate();
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<"stages"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState<Id<"stages"> | null>(null);

  if (isLoading) return (
    <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
  );

  if (!candidatures || candidatures.length === 0) return (
    <EmptyState icon={GraduationCap}
      title={hasSearch ? "Aucun résultat" : "Aucune candidature pour l'instant"}
      description={hasSearch ? "Essaie une autre recherche." : "Ajoute la première candidature de stage."} />
  );

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    try { await onDelete(pendingDeleteId); }
    finally { setIsDeleting(false); setPendingDeleteId(null); }
  }

  async function handleMarkAsPaid(c: CandidatureStage) {
    setMarkingPaidId(c._id);
    try { await onMarkAsPaid(c); }
    finally { setMarkingPaidId(null); }
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
            {candidatures.map((c) => (
              <TableRow
                key={c._id}
                className="cursor-pointer"
                onClick={() => navigate(`/admin/stagiaires/${c._id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {c.photos[0]?.imageUrl ? (
                      <img src={c.photos[0].imageUrl} alt={c.nom}
                        className="h-9 w-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium leading-tight">{c.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.numero} ans</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{c.niveau}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" /> {c.photos.length} photo{c.photos.length !== 1 ? "s" : ""}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {c.statutPaiement === "Non payé" ? (
                    <button type="button" onClick={() => handleMarkAsPaid(c)} disabled={markingPaidId === c._id} className="inline-flex items-center" title="Cliquer pour marquer comme payé">
                      <Badge variant="destructive" className="cursor-pointer transition-opacity hover:opacity-80">
                        {markingPaidId === c._id ? <Loader2 className="h-3 w-3 animate-spin" /> : c.statutPaiement}
                      </Badge>
                    </button>
                  ) : (
                    <div>
                      <Badge variant="success">{c.statutPaiement}</Badge>
                      {c.datePaiement && <p className="mt-1 text-xs text-muted-foreground">le {formatDate(c.datePaiement)}</p>}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/admin/stagiaires/${c._id}`)}>
                        <GraduationCap className="h-4 w-4" /> Voir la fiche
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(c)}>
                        <Pencil className="h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setPendingDeleteId(c._id)}>
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
            <AlertDialogDescription>Cette action est irréversible. La candidature et ses photos seront supprimées.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? "Suppression…" : "Supprimer"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
