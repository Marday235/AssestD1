import { Award, Building2, GraduationCap ,Images, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";
import { Bureau } from "@/components/dashboard/Bureau/Bureau";
import { Collaborateurs } from "@/components/dashboard/Collaborateurs/Collaborateurs";
import { Galerie } from "@/components/dashboard/Galerie/Galerie";
import { Certifications } from "@/components/dashboard/Certifications/Certifications";
import '../styles/admin.css'
import Stage from "@/components/dashboard/Stage/Stage";
const TABS = [
  { value: "bureau", label: "Bureau", icon: Users },
  { value: "collaborateurs", label: "Collaborateurs", icon: Building2 },
  { value: "galerie", label: "Galerie", icon: Images },
  { value: "certifications", label: "Certifications", icon: Award },
    { value: "stage", label: "Stage", icon: GraduationCap },
] as const;

/**
 * Page d'administration unique de la plateforme. Regroupe les 4 modules
 * de gestion (Bureau, Collaborateurs, Galerie, Certifications) via des Tabs.
 */
export default function AdminPage() {
  return (
    <div className="min-h-screen w-100% bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between py-5">
          <div className="seal-mark flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold leading-tight">Espace Admin</h1>
              <p className="text-xs text-muted-foreground">Gestion de l'ASEEST/D</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="bureau">
          <TabsList className="flex-wrap">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value}>
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="bureau">
            <Bureau />
          </TabsContent>
          <TabsContent value="collaborateurs">
            <Collaborateurs />
          </TabsContent>
          <TabsContent value="galerie">
            <Galerie />
          </TabsContent>
          <TabsContent value="certifications">
            <Certifications />
          </TabsContent>
             <TabsContent value="stage">
                      <Stage />
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
