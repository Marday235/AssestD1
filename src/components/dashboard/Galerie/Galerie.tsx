import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, SearchBar } from "@/components/dashboard/shared";
import { useToast } from "@/components/dashboard/ui/use-toast";
import { useGalerie } from "@/hooks/useGalerie";
import { GalerieEvenements } from "@/components/dashboard/Galerie/GalerieEvenements";
import { EvenementDialog } from "@/components/dashboard/Galerie/EvenementDialog";
import { AddPhotosDialog } from "@/components/dashboard/Galerie/AddPhotosDialog";
import type { EvenementFormValues, EvenementGalerie } from "@/components/dashboard/Galerie/galerie.types";
import type { Id } from "../../../../convex/_generated/dataModel";

/** Module Galerie : événements photo avec upload multiple de photos par événement. */
export function Galerie() {
  const { evenementsAdmin, isLoading, createEvenement, updateEvenement, removeEvenement, addPhotos, removePhoto } = useGalerie();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [evenementDialogOpen, setEvenementDialogOpen] = useState(false);
  const [editingEvenement, setEditingEvenement] = useState<EvenementGalerie | undefined>(undefined);
  const [addPhotosEvenement, setAddPhotosEvenement] = useState<EvenementGalerie | null>(null);

  const filtered = useMemo(() => {
    if (!evenementsAdmin) return evenementsAdmin;
    const q = search.trim().toLowerCase();
    if (!q) return evenementsAdmin;
    return evenementsAdmin.filter((e) => e.nom.toLowerCase().includes(q));
  }, [evenementsAdmin, search]);

  function handleCreate() {
    setEditingEvenement(undefined);
    setEvenementDialogOpen(true);
  }

  function handleEdit(evt: EvenementGalerie) {
    setEditingEvenement(evt);
    setEvenementDialogOpen(true);
  }

  async function handleEvenementSubmit(values: EvenementFormValues, storageIds: Id<"_storage">[]) {
    try {
      if (editingEvenement) {
        await updateEvenement(editingEvenement._id, values);
        if (storageIds.length > 0) {
          await addPhotos(editingEvenement._id, storageIds);
        }
        toast({ title: "Événement modifié" });
      } else {
        const evenementId = await createEvenement(values);
        if (storageIds.length > 0) {
          await addPhotos(evenementId, storageIds);
        }
        toast({
          title: "Événement créé",
          description: `${storageIds.length} photo${storageIds.length !== 1 ? "s" : ""} ajoutée${storageIds.length !== 1 ? "s" : ""}.`,
        });
      }
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    }
  }

  async function handleDeleteEvenement(id: Id<"evenements_galerie">) {
    try {
      await removeEvenement(id);
      toast({ title: "Événement supprimé", description: "L'événement et ses photos ont été supprimés." });
    } catch {
      toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive" });
    }
  }

  async function handleDeletePhoto(id: Id<"galerie">) {
    try {
      await removePhoto(id);
      toast({ title: "Photo supprimée" });
    } catch {
      toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive" });
    }
  }

  async function handleAddPhotos(evenementId: Id<"evenements_galerie">, storageIds: Id<"_storage">[]) {
    try {
      await addPhotos(evenementId, storageIds);
      toast({
        title: "Photos ajoutées",
        description: `${storageIds.length} photo${storageIds.length !== 1 ? "s" : ""} ajoutée${storageIds.length !== 1 ? "s" : ""}.`,
      });
    } catch {
      toast({ title: "Erreur", description: "L'ajout a échoué.", variant: "destructive" });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Galerie"
        description="Photos organisées par événement. Clique sur un événement pour voir toutes ses photos."
        action={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" /> Nouvel événement
          </Button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un événement…" />

      <GalerieEvenements
        evenementsAdmin={filtered}
        isLoading={isLoading}
        hasSearch={search.trim().length > 0}
        onEdit={handleEdit}
        onDelete={handleDeleteEvenement}
        onDeletePhoto={handleDeletePhoto}
        onAddPhotos={(evt) => setAddPhotosEvenement(evt)}
      />

      <EvenementDialog
        open={evenementDialogOpen}
        onOpenChange={setEvenementDialogOpen}
        evenementsAdmin={editingEvenement}
        onSubmit={handleEvenementSubmit}
      />

      <AddPhotosDialog
        open={addPhotosEvenement !== null}
        onOpenChange={(open) => !open && setAddPhotosEvenement(null)}
        evenementsAdmin={addPhotosEvenement}
        onSubmit={handleAddPhotos}
      />
    </div>
  );
}

export default Galerie;
