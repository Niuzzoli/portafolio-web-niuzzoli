// "Volver al inicio" desde /proyectos: la home vuelve a la sección de proyectos (en el paso "Ver todos")
// en vez de arrancar arriba con la intro. Vive en memoria: solo sirve para navegación dentro del sitio.
let pending = false;

export function requestReturnToProjects() {
  pending = true;
}

export function isReturningToProjects() {
  return pending;
}

// Lo lee la sección de proyectos una sola vez
export function consumeReturnToProjects() {
  const was = pending;
  pending = false;
  return was;
}
