"use server";

import { Resend } from "resend";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// Sin dominio propio verificado en Resend, solo se puede enviar desde onboarding@resend.dev
// y únicamente al mail de la cuenta. Con dominio propio: CONTACT_FROM_EMAIL="Portafolio <hola@tudominio.com>"
const FROM =
  process.env.CONTACT_FROM_EMAIL ?? "Portafolio <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const field = (data: FormData, name: string, max: number) =>
  String(data.get(name) ?? "")
    .trim()
    .slice(0, max);

export async function sendContact(
  _prev: ContactState,
  data: FormData,
): Promise<ContactState> {
  // Campo trampa: invisible para personas, los bots lo completan. Se finge éxito para no darles pistas.
  if (field(data, "company", 200)) return { status: "success" };

  const name = field(data, "name", 120);
  const email = field(data, "email", 200);
  const message = field(data, "message", 5000);
  const services = data
    .getAll("services")
    .map((s) => String(s).slice(0, 40))
    .slice(0, 10);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return { status: "error", message: "Revisá tu nombre, email y mensaje." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error(
      "Formulario de contacto: faltan RESEND_API_KEY o CONTACT_TO_EMAIL",
    );
    return {
      status: "error",
      message: "No se pudo enviar. Probá de nuevo en un rato.",
    };
  }

  const lines = [`Nombre: ${name}`, `Email: ${email}`];
  if (services.length) lines.push(`Servicios: ${services.join(", ")}`);

  const { error } = await new Resend(apiKey).emails.send({
    from: FROM,
    to,
    // "Responder" en tu mail le contesta directo al visitante
    replyTo: email,
    subject: `Nuevo proyecto · ${name}`,
    text: [...lines, "", message].join("\n"),
    html: `${lines.map((l) => `<p style="margin:0 0 4px">${escapeHtml(l)}</p>`).join("")}
      <p style="margin:16px 0 0;white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });

  if (error) {
    console.error("Formulario de contacto: Resend devolvió un error", error);
    return {
      status: "error",
      message: "No se pudo enviar. Probá de nuevo en un rato.",
    };
  }

  return { status: "success" };
}
