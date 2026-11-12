// Lista única de proyectos.
// - La home (Projects) muestra solo los que tienen `destacado: true`, en este orden.
// - La página /proyectos muestra todos.
// Para sumar un proyecto nuevo, agregá un objeto a la lista (la imagen va en /public/proyectos).

export type ProjectCategory = "web" | "automatizacion" | "interactivo";

// Texto de cada categoría en los filtros y en las tarjetas
export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  web: "Web",
  automatizacion: "Automatización",
  interactivo: "Interactivo",
};

export type Project = {
  title: string;
  description: string;
  // Ruta en /public, por ejemplo "/proyectos/proyecto-1.png". Sin imagen se ve el espacio reservado.
  image?: string;
  // Dónde está lo importante de la imagen, de izquierda (0%) a derecha (100%).
  // En el celular la tarjeta es vertical y solo entra una franja de la imagen: esto elige cuál.
  focus?: string;
  href?: string;
  category: ProjectCategory;
  destacado: boolean;
};

export const projects: Project[] = [
  {
    title: "Agendo",
    description: "Asistente que responde consultas y agenda turnos solo, mientras el negocio sigue trabajando.",
    image: "/proyectos/agendobot.png",
    focus: "50%",
    href: "https://agendobot.vercel.app",
    category: "automatizacion",
    destacado: true,
  },
  {
    title: "Proa Energy",
    description: "Web institucional para una consultora de petróleo, gas y eficiencia energética.",
    image: "/proyectos/proa.png",
    focus: "85%",
    href: "https://proaenergy.com.ar",
    category: "web",
    destacado: true,
  },
  {
    title: "Serdigital",
    description: "Consultora de transformación digital que desarrolla software a medida y brinda soluciones de seguridad informática para empresas.",
    image: "/proyectos/serdigital.png",
    focus: "90%",
    href: "https://serdigital.com.ar",
    category: "web",
    destacado: true,
  },
  {
    title: "Noir Barbería",
    description: "Sitio para una barbería con servicios, equipo, galería y reserva de turnos online.",
    image: "/proyectos/barberia.png",
    focus: "75%",
    href: "https://barberianoir.vercel.app",
    category: "web",
    destacado: false,
  },
  {
    title: "750s",
    description: "Experiencia interactiva dedicada al McLaren 750S, con animaciones, modelo 3D explorable y detalles sobre su diseño e ingeniería.",
    image: "/proyectos/mclaren.png",
    focus: "55%",
    href: "https://750s.vercel.app",
    category: "interactivo",
    destacado: true,
  },
  {
    title: "Detective",
    description: "Juego de investigación: casos con evidencias, sospechosos y líneas de tiempo para resolver.",
    image: "/proyectos/detectiveando.png",
    focus: "75%",
    href: "https://detectiveando.vercel.app",
    category: "interactivo",
    destacado: false,
  },
  {
    title: "Daily Puzzles",
    description: "Un puzzle nuevo cada día: Wordle, Sudoku y Connections con rachas y estadísticas.",
    image: "/proyectos/minipuzzles.png",
    focus: "65%",
    href: "https://minipuzzles.vercel.app",
    category: "interactivo",
    destacado: false,
  },
];

export const featuredProjects = projects.filter((project) => project.destacado);
