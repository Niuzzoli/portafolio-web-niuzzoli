// Datos del sitio para SEO: metadatos, sitemap, robots, imagen para compartir y datos estructurados.

// Dirección pública del sitio. Con dominio propio: NEXT_PUBLIC_SITE_URL="https://tudominio.com".
// Sin eso, en Vercel se usa sola la URL de producción del proyecto.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "Niuzzoli Dev";
export const AUTHOR = "Nacho Iuzzolino";

// Lo que aparece en la pestaña y como título azul en Google (ideal: menos de 60 caracteres)
export const SITE_TITLE = "Niuzzoli Dev · Diseño y desarrollo web a medida";

// El texto gris debajo del título en Google (ideal: entre 120 y 160 caracteres)
export const SITE_DESCRIPTION =
  "Diseño y desarrollo de sitios web rápidos y a medida, más automatizaciones para negocios. Desde Cipolletti, Río Negro, para todo el país.";

export const KEYWORDS = [
  "diseño web",
  "desarrollo web",
  "páginas web a medida",
  "automatizaciones",
  "desarrollador web freelance",
  "diseño web Cipolletti",
  "desarrollo web Neuquén",
  "páginas web Río Negro",
  "Next.js",
];

export const THEME_COLOR = "#000000";
