import type { Metadata } from "next";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import SiteFooter from "@/components/SiteFooter";

// Página con todos los proyectos (los datos salen de src/data/projects.ts)
export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Todos los proyectos de Niuzzoli Dev: sitios web, automatizaciones y experiencias interactivas.",
  alternates: { canonical: "/proyectos" },
  openGraph: { url: "/proyectos" },
};

export default function ProyectosPage() {
  return (
    <main className="bg-black text-white">
      {/* Misma estructura que la home: el contenido opaco va encima y descubre el footer al final */}
      <div id="contenido" className="relative z-10 min-h-svh bg-black">
        <ProjectsGrid />
      </div>

      <SiteFooter />
    </main>
  );
}
