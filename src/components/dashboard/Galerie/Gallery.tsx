import { cn } from "@/lib/utils";
import type { PhotoAvecUrl } from "@/components/dashboard/Galerie/galerie.types";

interface GallerySection {
  type?: "grid";
  images: { src: string; alt: string }[];
}

/**
 * Découpe une liste de photos en sections façon "Explore our Gallery" :
 * alternance d'une grande image pleine largeur puis d'une grille 2x2,
 * en boucle jusqu'à épuisement des photos.
 */
function buildGallerySections(photos: PhotoAvecUrl[]): GallerySection[] {
  console.log(photos);
  
  
  const sections: GallerySection[] = [];
  let i = 0;
  let large = true;

  while (i < photos?.length) {
    if (large) {
      const photo = photos[i];
      if (photo) {
        sections.push({
          images: [{ src: photo.imageUrl ?? "", alt: 'even — photo ' }],
        });
      }
      i += 1;
    } else {
      const groupe = photos.slice(i, i + 4);
      sections.push({
        type: "grid",
        images: groupe.map((photo) => ({
          src: photo.imageUrl ?? "",
          alt: 'even — photo ',
        })),
      });
      i += groupe.length;
    }
    large = !large;
  }

  return sections;
}

interface GalleryProps {
  photos: PhotoAvecUrl[];
}

/** Section galerie pour un événement, reproduisant le design "Explore our Gallery". */
export function Gallery({  photos }: GalleryProps) {

  
  const gallerySections = buildGallerySections(photos);
  console.log(gallerySections);
  if (gallerySections.length === 0) return null;

  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            <span className="relative z-1">
           Galerie de
              <span
                className="bg-primary absolute bottom-1 left-0 -z-1 h-px w-full"
                aria-hidden="true"
              ></span>
            </span>{" "}
            l'ASEEST/D
          </h2>
          <p className="text-muted-foreground text-xl">
            Quelques moments capturés lors de ces événements.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {gallerySections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={cn({ "grid grid-cols-2 gap-6": section.type === "grid" }, "space-y-4")}
            >
              {section.images.map((image, imageIndex) => (
                <img
                  key={imageIndex}
                  src={image.src}
                  alt={image.alt}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
