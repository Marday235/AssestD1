import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";





/** Grille des membres du bureau, style "Team" : photo ronde, nom, titre, bio. */
export function BureauGrid() {
  const membres = useQuery(api.bureau.getAll);



  return (
    <>
         <div className="mx-auto flex max-w-(--breakpoint-xl) items-center flex-col justify-center px-6 py-8 sm:pt-12 sm:pb-20 lg:px-8" id="team">
      <span className="font-semibold text-muted-foreground  text-sm uppercase">
       Bureau exécutif de l'ASEEST/D
      </span>

      <div className="mt-14 grid w-full grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 md:grid-cols-4 bg-transparent">
        {membres && membres?.map((member) => (
          <div key={member?.nom}>
            <img
              alt={member?.nom}
              className="h-20 w-20 m-5 rounded-full bg-transparent object-cover"
              height={120}
              src={member.photoUrl ?? ""}
              width={120}
            />
            <h3 className="mt-4 font-semibold text-sm">{member.prenom} {member.nom}</h3>
            <p className="text-muted-foreground text-sm">{member.role}</p>
            <p className="mt-3">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
