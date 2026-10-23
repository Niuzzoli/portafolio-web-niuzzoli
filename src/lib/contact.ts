// Datos provisorios: reemplazar por los tuyos.
// Número en formato internacional, solo dígitos (ej. Argentina: 549 + característica + número)
export const WHATSAPP_NUMBER = "+5491130613250";
const WHATSAPP_MESSAGE = "¡Hola! Vi tu portafolio y quiero hablar de un proyecto.";

// wa.me solo acepta dígitos: el "+" y los espacios se sacan solos
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
