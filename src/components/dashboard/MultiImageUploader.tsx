import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedImage {
  previewUrl: string;
  storageId: Id<"_storage"> | null;
  uploading: boolean;
  error: string | null;
  file: File;
}

interface MultiImageUploaderProps {
  /** Appelé avec la liste finale des storageIds une fois tous les uploads terminés. */
  onUploaded: (storageIds: Id<"_storage">[]) => void;
  className?: string;
}

/**
 * Composant d'upload multiple d'images vers Convex Storage.
 * - Sélection de N images en une seule action
 * - Prévisualisation instantanée de toutes les images
 * - Upload parallèle avec indicateur d'état par image
 * - Possibilité de retirer une image avant/après upload
 */
export function MultiImageUploader({ onUploaded, className }: MultiImageUploaderProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);

  async function uploadSingleFile(file: File, index: number) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, uploading: true, error: null } : img))
    );

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload échoué");

      const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };

      setImages((prev) => {
        const updated = prev.map((img, i) =>
          i === index ? { ...img, storageId, uploading: false } : img
        );
        // Notifier le parent avec tous les storageIds valides
        const valides = updated.filter((img) => img.storageId).map((img) => img.storageId!);
        onUploaded(valides);
        return updated;
      });
    } catch {
      setImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, uploading: false, error: "Échec de l'upload" } : img
        )
      );
    }
  }

  async function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const invalides = files.filter(
      (f) => !f.type.startsWith("image/") || f.size > 5 * 1024 * 1024
    );
    if (invalides.length > 0) {
      alert("Certains fichiers sont invalides (pas une image ou > 5 Mo) et ont été ignorés.");
    }

    const valides = files.filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );

    const offset = images.length;
    const nouvellesImages: UploadedImage[] = valides.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      storageId: null,
      uploading: false,
      error: null,
    }));

    setImages((prev) => [...prev, ...nouvellesImages]);

    // Upload en parallèle
    await Promise.all(valides.map((_, i) => uploadSingleFile(valides[i]!, offset + i)));

    // Reset input pour permettre la re-sélection des mêmes fichiers
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove(index: number) {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const valides = updated.filter((img) => img.storageId).map((img) => img.storageId!);
      onUploaded(valides);
      return updated;
    });
  }

  const isUploading = images.some((img) => img.uploading);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFilesChange}
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full border-dashed py-6 text-muted-foreground hover:text-foreground"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Upload en cours…
          </>
        ) : (
          <>
            <ImagePlus className="h-2 w-2" />
            {images.length === 0
              ? "Sélectionner des photos"
              : "Ajouter d'autres photos"}
          </>
        )}
      </Button>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
              <img
                src={img.previewUrl}
                alt={`Photo ${index + 1}`}
                className={cn(
                  "h-full w-full object-cover transition-opacity",
                  (img.uploading || img.error) && "opacity-50"
                )}
              />

              {/* Indicateur d'état superposé */}
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-white drop-shadow" />
                </div>
              )}
              {img.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/60">
                  <span className="text-center text-xs font-medium text-white px-1">
                    Échec
                  </span>
                </div>
              )}
              {!img.uploading && img.storageId && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-success" />
              )}

              {/* Bouton de suppression */}
              {!img.uploading && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-1 top-1 rounded-full bg-foreground/70 p-0.5 text-background opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Retirer cette photo"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.filter((i) => i.storageId).length} / {images.length} photo
          {images.length > 1 ? "s" : ""} téléchargée
          {images.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
