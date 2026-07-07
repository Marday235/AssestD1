import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, SearchBar } from "@/components/dashboard/shared";
import { useToast } from "@/components/dashboard/ui/use-toast";
import { useBureau } from "@/hooks/useBureau";
import { BureauGrid } from "@/components/dashboard/Bureau/BureauGrid";
import { EditBureauDialog } from "@/components/dashboard/Bureau/EditBureauDialog";
import type { BureauFormValues, MembreBureau } from "@/components/dashboard/Bureau/bureau.types";
import type { Id } from "../../../../convex/_generated/dataModel";

/** Module Bureau : liste, recherche, et CRUD complet des membres du bureau. */
export function Bureau() {
  const { membres, isLoading, create, update, remove } = useBureau();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMembre, setEditingMembre] = useState<MembreBureau | undefined>(undefined);

  const filteredMembres = useMemo(() => {
    if (!membres) return membres;
    const query = search.trim().toLowerCase();
    if (!query) return membres;
    return membres.filter((m) =>
      [m.nom, m.prenom, m.role, m.niveauEtude].some((field) => field.toLowerCase().includes(query))
    );
  }, [membres, search]);

  function handleAdd() {
    setEditingMembre(undefined);
    setDialogOpen(true);
  }

  function handleEdit(membre: MembreBureau) {
    setEditingMembre(membre);
    setDialogOpen(true);
  }

  async function handleSubmit(values: BureauFormValues, photoStorageId?: Id<"_storage">) {
    try {
      if (editingMembre) {
        await update(editingMembre._id, values, photoStorageId);
        toast({ title: "Membre modifié", description: "Les informations ont été mises à jour." });
      } else {
        await create(values, photoStorageId);
        toast({ title: "Membre ajouté", description: "Le nouveau membre a été ajouté au bureau." });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Réessaie.",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: Id<"bureau">) {
    try {
      await remove(id);
      toast({ title: "Membre supprimé" });
    } catch {
      toast({
        title: "Erreur",
        description: "La suppression a échoué. Réessaie.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Bureau"
        description="Gère les membres du bureau de l'association : rôles, statuts et profils."
        action={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" /> Ajouter un membre
          </Button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un membre…" />

      <BureauGrid
        membres={filteredMembres}
        isLoading={isLoading}
        hasSearch={search.trim().length > 0}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditBureauDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        membre={editingMembre}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Bureau;
