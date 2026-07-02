import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

/** En-tête de section uniforme (titre + description + bouton d'action) utilisé par chaque module. */
export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Barre de recherche réutilisable pour filtrer les listes/tableaux des modules. */
export function SearchBar({ value, onChange, placeholder = "Rechercher…", className }: SearchBarProps) {
  return (
    <div className={cn("relative max-w-sm", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8"
      />
    </div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

/** État vide uniforme affiché quand une liste/tableau ne contient aucun élément (ou aucun résultat de recherche). */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <div className="rounded-full bg-muted p-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
