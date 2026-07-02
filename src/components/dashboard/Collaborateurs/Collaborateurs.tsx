import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, SearchBar } from "@/components/dashboard/shared";
import { useToast } from "@/components/dashboard/ui/use-toast";
import { useCollaborateurs } from "@/hooks/useCollaborateurs";
import { CollaborateurTable } from "@/components/dashboard/Collaborateurs/CollaborateurTable";
import { EditCollaborateurDialog } from "@/components/dashboard/Collaborateurs/EditCollaborateurDialog";
import type { Collaborateur, CollaborateurFormValues } from "@/components/dashboard/Collaborateurs/collaborateur.types";
import type { Id } from "../../../../convex/_generated/dataModel";

/** Module Collaborateurs : liste, recherche, et CRUD complet des partenaires de l'association. */
export function Collaborateurs() {
  const { collaborateurs, isLoading, create, update, remove } = useCollaborateurs();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollaborateur, setEditingCollaborateur] = useState<Collaborateur | undefined>(undefined);

  const filtered = useMemo(() => {
    if (!collaborateurs) return collaborateurs;
    const query = search.trim().toLowerCase();
    if (!query) return collaborateurs;
    return collaborateurs.filter((c) =>
      [c.nom, c.email, c.adresse].some((field) => field.toLowerCase().includes(query))
    );
  }, [collaborateurs, search]);

  function handleAdd() {
    setEditingCollaborateur(undefined);
    setDialogOpen(true);
  }

  function handleEdit(collaborateur: Collaborateur) {
    setEditingCollaborateur(collaborateur);
    setDialogOpen(true);
  }

  async function handleSubmit(values: CollaborateurFormValues, logoStorageId?: Id<"_storage">) {
    try {
      if (editingCollaborateur) {
        await update(editingCollaborateur._id, values, logoStorageId);
        toast({ title: "Collaborateur modifié", description: "Les informations ont été mises à jour." });
      } else {
        await create(values, logoStorageId);
        toast({ title: "Collaborateur ajouté", description: "Le nouveau collaborateur a été ajouté." });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Réessaie.",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: Id<"collaborateurs">) {
    try {
      await remove(id);
      toast({ title: "Collaborateur supprimé" });
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
        title="Collaborateurs"
        description="Gère les partenaires et collaborateurs externes de l'association."
        action={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" /> Ajouter un collaborateur
          </Button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un collaborateur…" />

      <CollaborateurTable
        collaborateurs={filtered}
        isLoading={isLoading}
        hasSearch={search.trim().length > 0}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditCollaborateurDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        collaborateur={editingCollaborateur}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Collaborateurs;
