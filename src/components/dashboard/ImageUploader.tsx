import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { api } from "./../../../convex/_generated/api";
import type { Id } from "./../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  /** URL actuelle à prévisualiser (édition d'un élément existant). */
  currentImageUrl?: string | null;
  /** Appelé avec le storageId une fois l'upload terminé vers Convex Storage. */
  onUploaded: (storageId: Id<"_storage">) => void;
  /** Appelé quand l'utilisateur retire l'image sélectionnée. */
  onClear?: () => void;
  label?: string;
  /** Forme de la zone de prévisualisation. */
  shape?: "square" | "circle" | "wide";
  className?: string;
}

/**
 * Composant d'upload d'image réutilisable, branché sur Convex Storage.
 * Flux : génère une URL d'upload signée -> POST direct du fichier -> récupère le storageId.
 */
export function ImageUploader({
  currentImageUrl,
  onUploaded,
  onClear,
  label = "Choisir une image",
  shape = "square",
  className,
}: ImageUploaderProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Échec de l'upload.");
      }

      const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };
      onUploaded(storageId);
    } catch {
      setError("L'upload a échoué. Réessaie.");
      setPreview(currentImageUrl ?? null);
    } finally {
      setIsUploading(false);
    }
  }

  function handleClear() {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  }

  const shapeClasses = {
    square: "h-32 w-32 rounded-lg",
    circle: "h-24 w-24 rounded-full",
    wide: "h-40 w-full rounded-lg",
  }[shape];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden border-2 border-dashed border-input bg-muted/40 transition-colors",
          shapeClasses,
          preview && "border-solid border-border"
        )}
      >
        {preview ? (
          <img src={preview} alt="Aperçu" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-6 w-6 text-muted-foreground" />
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <Loader2 className="h-5 w-5 animate-spin text-background" />
          </div>
        )}

        {preview && !isUploading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background transition-colors hover:bg-destructive"
            aria-label="Retirer l'image"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-fit"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Envoi en cours…
          </>
        ) : (
          <>
            <ImagePlus className="h-3.5 w-3.5" /> {label}
          </>
        )}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
