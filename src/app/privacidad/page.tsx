import type { Metadata } from "next";

// Página pública solo para validación de Meta (WhatsApp Business): no tiene links desde el sitio,
// no está en el sitemap y lleva noindex (Meta igual la puede visitar).
export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de Privacidad de Serdigital: cómo tratamos los datos personales en el asistente de turnos por WhatsApp para barberías.",
  alternates: { canonical: "/privacidad" },
  openGraph: { url: "/privacidad" },
  robots: { index: false, follow: false },
};

const EMAIL = "ignaiuzzolino@gmail.com";

const secciones: { titulo: string; contenido: React.ReactNode }[] = [
  {
    titulo: "1. Quiénes somos",
    contenido: (
      <>
        <p>
          Somos Serdigital, de Cipolletti, Río Negro, Argentina. Podés escribirnos a{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
        <p>
          Serdigital desarrolla y opera un asistente automatizado de turnos por WhatsApp para
          barberías. La barbería es quien atiende al cliente; Serdigital provee la herramienta
          tecnológica y procesa los datos por cuenta de la barbería.
        </p>
      </>
    ),
  },
  {
    titulo: "2. Qué datos tratamos",
    contenido: (
      <>
        <p>Cuando usás el asistente, tratamos:</p>
        <ul>
          <li>Tu número de teléfono de WhatsApp.</li>
          <li>El nombre de tu perfil de WhatsApp.</li>
          <li>
            El contenido de los mensajes (texto y notas de voz) que le enviás al asistente.
          </li>
          <li>
            Los datos del turno: nombre y apellido que indiques, fecha, hora y barbero elegido.
          </li>
        </ul>
      </>
    ),
  },
  {
    titulo: "3. Para qué los usamos",
    contenido: (
      <>
        <p>
          Usamos tus datos únicamente para consultar disponibilidad, reservar, modificar y
          cancelar turnos, y para responder consultas sobre la barbería (precios, horarios,
          ubicación).
        </p>
        <p>
          No vendemos tus datos, no hacemos publicidad con ellos ni los usamos para perfilar
          personas.
        </p>
      </>
    ),
  },
  {
    titulo: "4. Con quién se comparten",
    contenido: (
      <>
        <p>Para prestar el servicio intervienen los siguientes proveedores:</p>
        <ul>
          <li>Meta (plataforma WhatsApp Business), para enviar y recibir mensajes.</li>
          <li>
            Google (Google Calendar y Google Sheets), donde se guardan los turnos y la
            configuración de la barbería.
          </li>
          <li>
            Un proveedor de inteligencia artificial (OpenAI), que procesa el texto de los
            mensajes y transcribe las notas de voz para entenderlas y responder.
          </li>
          <li>El servidor propio donde corre la automatización.</li>
        </ul>
        <p>
          Solo se comparte lo necesario para prestar el servicio. Podemos revelar información si
          una ley o una orden judicial lo exige.
        </p>
      </>
    ),
  },
  {
    titulo: "5. Cuánto tiempo se conservan",
    contenido: (
      <>
        <p>
          Los turnos se guardan en el calendario de la barbería mientras sean necesarios para la
          gestión del negocio.
        </p>
        <p>
          El historial de conversación que usa el asistente es temporal y se limita a los últimos
          mensajes. No guardamos las notas de voz una vez transcriptas.
        </p>
      </>
    ),
  },
  {
    titulo: "6. Tus derechos",
    contenido: (
      <>
        <p>
          Tenés derecho a acceder a tus datos, rectificarlos y pedir su supresión. Para ejercerlos,
          escribinos a <a href={`mailto:${EMAIL}`}>{EMAIL}</a> indicando el número de WhatsApp que
          usaste; te respondemos en un plazo razonable.
        </p>
        <p>
          Esta política se rige por la Ley 25.326 de Protección de Datos Personales de Argentina.
          La Agencia de Acceso a la Información Pública es el órgano de control de esa ley, y ante
          ella podés presentar reclamos.
        </p>
      </>
    ),
  },
  {
    titulo: "7. Seguridad",
    contenido: (
      <p>
        Aplicamos medidas razonables para proteger tus datos. Aun así, ninguna transmisión por
        Internet es 100% segura, por lo que no podemos garantizar seguridad absoluta.
      </p>
    ),
  },
  {
    titulo: "8. Cambios en esta política",
    contenido: (
      <p>
        Podemos actualizar esta política. La versión vigente estará siempre en esta página, con su
        fecha de entrada en vigor.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Política de Privacidad</h1>
        <p className="mt-4 text-sm text-foreground/60">
          Entrada en vigor: 5 de noviembre de 2026
        </p>
      </header>

      <div className="space-y-10">
        {secciones.map(({ titulo, contenido }) => (
          <section key={titulo}>
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">{titulo}</h2>
            <div className="space-y-3 leading-relaxed text-foreground/80 [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6">
              {contenido}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
