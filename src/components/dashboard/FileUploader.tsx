import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { api } from "./../../../convex/_generated/api";
import type { Id } from "./../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  /** Nom du fichier déjà présent (édition d'un élément existant). */
  currentFileName?: string | null;
  /** URL actuelle du fichier déjà présent, pour le bouton "Voir le fichier". */
  currentFileUrl?: string | null;
  /** Appelé avec le storageId une fois l'upload terminé vers Convex Storage. */
  onUploaded: (storageId: Id<"_storage">, fileName: string) => void;
  /** Appelé quand l'utilisateur retire le fichier sélectionné. */
  onClear?: () => void;
  label?: string;
  className?: string;
}

/**
 * Composant d'upload de document (PDF) réutilisable, branché sur Convex Storage.
 * Même flux que ImageUploader : génère une URL d'upload signée -> POST direct -> récupère le storageId.
 */
export function FileUploader({
  currentFileName,
  currentFileUrl,
  onUploaded,
  onClear,
  label = "Choisir un fichier PDF",
  className,
}: FileUploaderProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(currentFileName ?? null);
  const [fileUrl, setFileUrl] = useState<string | null>(currentFileUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== "application/pdf") {
      setError("Le fichier doit être un PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 10 Mo.");
      return;
    }

    setFileName(file.name);
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
      setFileUrl(null);
      onUploaded(storageId, file.name);
    } catch {
      setError("L'upload a échoué. Réessaie.");
      setFileName(currentFileName ?? null);
    } finally {
      setIsUploading(false);
    }
  }

  function handleClear() {
    setFileName(null);
    setFileUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-lg border-2 border-dashed border-input bg-muted/40 p-3 transition-colors",
          fileName && "border-solid border-border"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          {fileName ? (
            <>
              <p className="truncate text-sm font-medium">{fileName}</p>
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Voir le fichier
                </a>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun fichier sélectionné</p>
          )}
        </div>

        {isUploading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}

        {fileName && !isUploading && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Retirer le fichier"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
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
            <Upload className="h-3.5 w-3.5" /> {label}
          </>
        )}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
