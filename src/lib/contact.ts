// Datos provisorios: reemplazar por los tuyos.
// Número en formato internacional, solo dígitos (ej. Argentina: 549 + característica + número)
export const WHATSAPP_NUMBER = "+5491130613250";
const WHATSAPP_MESSAGE =
  "¡Hola! Vi tu portafolio y quiero hablar de un proyecto.";

// wa.me solo acepta dígitos: el "+" y los espacios se sacan solos
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const CONTACT_EMAIL = "ignaiuzzolino@gmail.com";

// Se usa en la sección de contacto y en los datos estructurados para Google
export const LOCATION = {
  label: "Cipolletti, Río Negro, Argentina",
  city: "Cipolletti",
  region: "Río Negro",
  country: "AR",
};

export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/nacho_iuzzo/" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nacho-iuzzolino-846684321/",
  },
  { label: "GitHub", href: "https://www.github.com/niuzzoli/" },
];
