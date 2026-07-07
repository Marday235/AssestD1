import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp,  Users } from "lucide-react";
import { Skeleton } from "@/components/dashboard/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/shared";
import { getPosteRank } from "@/components/dashboard/Bureau/bureau.types";
import { useBureau } from "@/hooks/useBureau";

const INITIAL_COUNT = 10;



/** Grille des membres du bureau triée par poste officiel, 10 premiers + bouton Voir plus. */
export function BureauGridPage() {
  const [showAll, setShowAll] = useState(false);
  const { membres, isLoading} = useBureau();


   // Tri par rang de poste (ordre officiel), puis alphabétique à rang égal
   const sortedMembres = useMemo(() => {
    return [...(membres ?? [])].sort((a, b) => {
      const diff = getPosteRank(a.role) - getPosteRank(b.role);
  
      if (diff !== 0) {
        return diff;
      }
  
      return a.nom.localeCompare(b.nom, "fr", {
        sensitivity: "base",
      });
    });
  }, [membres]);
  const visible = showAll ? sortedMembres : sortedMembres.slice(0, INITIAL_COUNT);
  const hasMore = sortedMembres.length > INITIAL_COUNT;

  if (isLoading) {
    return (
      <>
       <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            <span className="relative z-1">
           Bureau exécutif de
              <span
                className="bg-primary absolute bottom-1 left-0 -z-1 h-px w-full"
                aria-hidden="true"
              ></span>
            </span>{" "}
            l'ASEEST/D
          </h2>
        </div>
      <div className="mt-2 grid w-full grid-cols-2 gap-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-24" />
            <Skeleton className="mt-3 h-12 w-full" />
          </div>
        ))}
      </div>
      /</>
    );
  }

  if (!membres || membres.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title= "Aucun membre pour l'instant"
        description=""
      />
    );
  }


 




  return (
    <>
      {/* Grille : 2 colonnes mobile, 4 colonnes desktop */}
      <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            <span className="relative z-1">
           Bureau exécutif de
              <span
                className="bg-primary absolute bottom-1 left-0 -z-1 h-px w-full"
                aria-hidden="true"
              ></span>
            </span>{" "}
            l'ASEEST/D
          </h2>
        </div>
      <div className="grid w-full grid-cols-2 gap-4 m-6 md:grid-cols-4 bg-transparent">
        
        {visible.map((membre) => (
          <div key={membre._id} className="group relative">
            <img
              alt={membre.prenom}
              className="h-20 w-20 m-5 rounded-full bg-transparent object-cover"
              height={120}
              src={membre.photoUrl ?? undefined}
              width={120}
            />
            <h3 className="mt-4 font-semibold text-lg leading-tight">
              {membre.prenom} {membre.nom}
            </h3>
            <p className="text-muted-foreground text-sm">{membre.role}</p>
            <p className="mt-3 text-sm">{membre.bio}</p>
          </div>
        ))}
      </div>

      {/* Bouton Voir plus / Réduire — affiché seulement si nécessaire */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? (
              <><ChevronUp className="h-4 w-4" /> Réduire</>
            ) : (
              <><ChevronDown className="h-4 w-4" /> Voir les {sortedMembres.length - INITIAL_COUNT} autres membres</>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
