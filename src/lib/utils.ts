import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne des classes Tailwind en résolvant les conflits (ex: "p-2" vs "p-4").
 * Utilisé par tous les composants UI shadcn.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate une date ISO (YYYY-MM-DD) en format français lisible (ex: 12 mars 2024). */
export function formatDate(value: string | number | undefined | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Renvoie les initiales (2 lettres max) à partir d'un nom et prénom, pour les avatars de repli. */
export function getInitials(...parts: Array<string | undefined>): string {
  const letters = parts
    .filter(Boolean)
    .map((part) => part!.trim().charAt(0).toUpperCase())
    .join("");
  return letters.slice(0, 2) || "?";
}

/** Tronque un texte à une longueur donnée en ajoutant une ellipse si nécessaire. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
