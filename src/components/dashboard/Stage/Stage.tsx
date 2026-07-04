import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/dashboard/ui/card";
import { SectionHeader, SearchBar } from "@/components/dashboard/shared";
import { useToast } from "@/components/dashboard/ui/use-toast";
import { useStages } from "@/hooks/useStages";
import { StageTable } from "@/components/dashboard/Stage/StageTable";
import { EditStageDialog } from "@/components/dashboard/Stage/EditStageDialog";
import { genererPdfCandidatsPayes } from "@/lib/pdf-export";
import type { CandidatureStage, StageFormValues } from "@/components/dashboard/Stage/stage.types";
import type { Id } from "../../../../convex/_generated/dataModel";

export function Stage() {
  const { candidatures, isLoading, create, update, markAsPaid, remove } = useStages();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCandidature, setEditingCandidature] = useState<CandidatureStage | undefined>(undefined);

  const filtered = useMemo(() => {
    if (!candidatures) return candidatures;
    const q = search.trim().toLowerCase();
    if (!q) return candidatures;
    return candidatures.filter((c) => [c.nom, c.niveau].some((f) => f.toLowerCase().includes(q)));
  }, [candidatures, search]);

  const resume = useMemo(() => {
    if (!candidatures) return { total: 0, payes: 0, nonPayes: 0 };
    const payes = candidatures.filter((c) => c.statutPaiement === "Payé").length;
    return { total: candidatures.length, payes, nonPayes: candidatures.length - payes };
  }, [candidatures]);

  function handleAdd() { setEditingCandidature(undefined); setDialogOpen(true); }
  function handleEdit(c: CandidatureStage) { setEditingCandidature(c); setDialogOpen(true); }

  async function handleSubmit(values: StageFormValues, photoStorageIds: Id<"_storage">[]) {
    try {
      if (editingCandidature) {
        await update(editingCandidature._id, values);
        toast({ title: "Candidature modifiée" });
      } else {
        await create(values, photoStorageIds);
        toast({ title: "Candidature ajoutée" });
      }
    } catch {
      toast({ title: "Erreur", variant: "destructive", description: "Une erreur est survenue." });
    }
  }

  async function handleMarkAsPaid(c: CandidatureStage) {
    try {
      await markAsPaid(c._id);
      toast({ title: "Paiement enregistré", description: `${c.nom} est maintenant marqué(e) comme payé(e).` });
    } catch {
      toast({ title: "Erreur", variant: "destructive", description: "La mise à jour a échoué." });
    }
  }

  async function handleDelete(id: Id<"stages">) {
    try { await remove(id); toast({ title: "Candidature supprimée" }); }
    catch { toast({ title: "Erreur", variant: "destructive", description: "La suppression a échoué." }); }
  }

  async function handleDownloadPdf() {
    if (!candidatures) return;
    const payes = candidatures.filter((c) => c.statutPaiement === "Payé");
    if (payes.length === 0) {
      toast({ title: "Aucun candidat payé", description: "Aucun candidat payé à inclure dans le PDF." });
      return;
    }
    await genererPdfCandidatsPayes(candidatures);
    toast({ title: "PDF généré", description: `${payes.length} candidat(s) exporté(s).` });
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Stage"
        description="Gère les candidatures de stage : profil, photos du dossier et frais de 1000 FR."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4" /> Télécharger les payés (PDF)
            </Button>
            <Button onClick={handleAdd}><Plus className="h-4 w-4" /> Ajouter une candidature</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Candidatures</p>
          <p className="mt-1 font-display text-2xl font-semibold">{resume.total}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Payé</p>
          <p className="mt-1 font-display text-2xl font-semibold text-success">{resume.payes}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Non payé</p>
          <p className="mt-1 font-display text-2xl font-semibold text-destructive">{resume.nonPayes}</p>
        </CardContent></Card>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un candidat…" />

      <StageTable
        candidatures={filtered} isLoading={isLoading}
        hasSearch={search.trim().length > 0}
        onEdit={handleEdit} onDelete={handleDelete} onMarkAsPaid={handleMarkAsPaid}
      />

      <EditStageDialog open={dialogOpen} onOpenChange={setDialogOpen}
        candidature={editingCandidature} onSubmit={handleSubmit} />
    </div>
  );
}

export default Stage;
