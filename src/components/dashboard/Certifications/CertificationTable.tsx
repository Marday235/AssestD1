import { useState } from "react";
import { Award, ImageOff, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import type { Certification } from "@/components/dashboard/Certifications/certification.types";
import type { Id } from "../../../../convex/_generated/dataModel";

interface CertificationTableProps {
  certifications: Certification[] | undefined;
  isLoading: boolean;
  hasSearch: boolean;
  onEdit: (certification: Certification) => void;
  onDelete: (id: Id<"certifications">) => Promise<void>;
}

/** Calcule si une certification est expirée à partir de sa date d'expiration. */
function isExpired(dateExpiration?: string): boolean {
  if (!dateExpiration) return false;
  return new Date(dateExpiration).getTime() < Date.now();
}

/** Tableau listant les certifications avec indicateur de validité et actions. */
export function CertificationTable({
  certifications,
  isLoading,
  hasSearch,
  onEdit,
  onDelete,
}: CertificationTableProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<"certifications"> | null>(null);
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

  if (!certifications || certifications.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title={hasSearch ? "Aucun résultat" : "Aucune certification pour l'instant"}
        description={
          hasSearch ? "Essaie une autre recherche." : "Ajoute la première certification de l'association."
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
              <TableHead>Certification</TableHead>
              <TableHead className="hidden md:table-cell">Organisme</TableHead>
              <TableHead className="hidden lg:table-cell">Numéro</TableHead>
              <TableHead>Obtention</TableHead>
              <TableHead>Validité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.map((cert) => {
              const expired = isExpired(cert.dateExpiration);
              return (
                <TableRow key={cert._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                        {cert.imageUrl ? (
                          <img src={cert.imageUrl} alt={cert.nom} className="h-full w-full object-cover" />
                        ) : (
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="font-medium leading-tight">{cert.nom}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {cert.organisme}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {cert.numero}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(cert.dateObtention)}</TableCell>
                  <TableCell>
                    {cert.dateExpiration ? (
                      <Badge variant="destructive" >
                        {expired ? "Expirée" : `Jusqu'au ${formatDate(cert.dateExpiration)}`}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Sans expiration</Badge>
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
                        <DropdownMenuItem onClick={() => onEdit(cert)}>
                          <Pencil className="h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setPendingDeleteId(cert._id)}
                        >
                          <Trash2 className="h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette certification ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La certification sera définitivement supprimée.
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
