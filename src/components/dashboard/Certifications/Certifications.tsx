import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, SearchBar } from "@/components/dashboard/shared";
import { useToast } from "@/components/dashboard/ui/use-toast";
import { useCertifications } from "@/hooks/useCertifications";
import { CertificationTable } from "@/components/dashboard/Certifications/CertificationTable";
import { EditCertificationDialog } from "@/components/dashboard/Certifications/EditCertificationDialog";
import type { Certification, CertificationFormValues } from "@/components/dashboard/Certifications/certification.types";
import type { Id } from "../../../../convex/_generated/dataModel";

/** Module Certifications : liste, recherche, et CRUD complet des certifications de l'association. */
export function Certifications() {
  const { certifications, isLoading, create, update, remove } = useCertifications();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | undefined>(undefined);

  const filtered = useMemo(() => {
    if (!certifications) return certifications;
    const query = search.trim().toLowerCase();
    if (!query) return certifications;
    return certifications.filter((c) =>
      [c.nom, c.organisme, c.numero].some((field) => field.toLowerCase().includes(query))
    );
  }, [certifications, search]);

  function handleAdd() {
    setEditingCertification(undefined);
    setDialogOpen(true);
  }

  function handleEdit(certification: Certification) {
    setEditingCertification(certification);
    setDialogOpen(true);
  }

  async function handleSubmit(values: CertificationFormValues, imageStorageId?: Id<"_storage">) {
    try {
      if (editingCertification) {
        await update(editingCertification._id, values, imageStorageId);
        toast({ title: "Certification modifiée", description: "Les informations ont été mises à jour." });
      } else {
        await create(values, imageStorageId);
        toast({ title: "Certification ajoutée", description: "La nouvelle certification a été ajoutée." });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Réessaie.",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: Id<"certifications">) {
    try {
      await remove(id);
      toast({ title: "Certification supprimée" });
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
        title="Certifications"
        description="Gère les certifications obtenues par l'association et leur validité."
        action={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" /> Ajouter une certification
          </Button>
        }
      />

      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une certification…" />

      <CertificationTable
        certifications={filtered}
        isLoading={isLoading}
        hasSearch={search.trim().length > 0}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditCertificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        certification={editingCertification}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Certifications;
