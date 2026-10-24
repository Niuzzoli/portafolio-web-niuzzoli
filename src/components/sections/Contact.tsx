"use client";

import {
  startTransition,
  useActionState,
  useRef,
  useState,
  type FormEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillButton from "@/components/PillButton";
import { CONTACT_EMAIL, LOCATION, SOCIALS, WHATSAPP_URL } from "@/lib/contact";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const contactInfo = [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "Ubicación", value: LOCATION.label },
];
const socials = [...SOCIALS, { label: "WhatsApp", href: WHATSAPP_URL }];
const services = ["Diseño", "Desarrollo", "Automatizaciones", "Otro"];

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path
        d="M7 17 17 7M8 7h9v9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const fieldClass =
  "w-full border-b border-[#f6eee6]/25 bg-transparent py-3 text-base text-[#f6eee6] outline-none transition-colors duration-300 placeholder:text-[#f6eee6]/35 focus:border-[#f6eee6]";
const labelClass =
  "font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#f6eee6]/60";

export default function Contact() {
  const section = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState(
    async (prev: ContactState, data: FormData) => {
      const result = await sendContact(prev, data);
      // Solo se vacía si salió bien: si falla, el visitante no pierde lo que escribió
      if (result.status === "success") {
        form.current?.reset();
        setSelected([]);
      }
      return result;
    },
    { status: "idle" },
  );

  useGSAP(
    () => {
      // La tarjeta entra un poco más angosta y se expande mientras sube
      gsap.fromTo(
        card.current,
        { scale: 0.92, y: 80 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card.current,
            start: "top bottom",
            end: "top 25%",
            scrub: true,
          },
        },
      );
      gsap.from("[data-reveal]", {
        autoAlpha: 0,
        y: 40,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: card.current, start: "top 60%" },
      });
    },
    { scope: section },
  );

  const toggle = (service: string) =>
    setSelected((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );

  // Con onSubmit (y no action) React no vacía el formulario cuando el envío falla
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    selected.forEach((service) => data.append("services", service));
    startTransition(() => formAction(data));
  };

  return (
    <section
      id="contacto"
      ref={section}
      className="relative px-2 pb-2 pt-32 md:px-3 md:pb-3 md:pt-48"
    >
      <div
        ref={card}
        className="origin-top overflow-clip rounded-[1.75rem] bg-[#7f011f] text-[#f6eee6] selection-invert will-change-transform md:rounded-[2.5rem]"
      >
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:px-16 lg:py-28">
          {/* Izquierda: título, datos y redes */}
          <div className="flex flex-col">
            {/* <span
              data-reveal
              className="mb-8 w-fit rounded-full border border-[#f6eee6]/25 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#f6eee6]/70"
            >
              Contacto
            </span> */}
            <h2
              data-reveal
              className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.88] tracking-[-0.055em]"
            >
              Hablemos de <span className="text-shine-light">tu proyecto.</span>
            </h2>
            <p
              data-reveal
              className="mt-6 max-w-sm text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-[#f6eee6]/70"
            >
              Contame qué tenés en mente y te respondo en menos de 24 horas.
            </p>

            <dl
              data-reveal
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-auto lg:pt-16"
            >
              {contactInfo.map((info) => (
                <div key={info.label}>
                  <dt className={labelClass}>{info.label}</dt>
                  <dd className="mt-2 text-base font-medium">
                    {info.href ? (
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-4 hover:underline"
                      >
                        {info.value}
                      </a>
                    ) : (
                      info.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <ul data-reveal className="mt-10 border-t border-[#f6eee6]/20">
              {socials.map((social) => (
                <li key={social.label} className="border-b border-[#f6eee6]/20">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between py-4 text-[15px] font-medium"
                  >
                    {social.label}
                    <ArrowUpRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Derecha: formulario */}
          <form
            ref={form}
            data-reveal
            onSubmit={onSubmit}
            className="flex flex-col gap-9 lg:pt-4"
          >
            {/* Campo trampa para bots: oculto para personas y lectores de pantalla */}
            <input
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] size-px opacity-0"
            />

            <div className="grid gap-9 sm:grid-cols-2 sm:gap-6">
              <label className="block">
                <span className={labelClass}>Nombre</span>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className={fieldClass}
                />
              </label>
            </div>

            <fieldset>
              <legend className={labelClass}>¿Qué necesitás?</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {services.map((service) => {
                  const on = selected.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(service)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 active:scale-[0.98]",
                        on
                          ? "border-[#f6eee6] bg-[#f6eee6] text-[#7f011f]"
                          : "border-[#f6eee6]/30 text-[#f6eee6]/85 hover:border-[#f6eee6]/70",
                      )}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="block">
              <span className={labelClass}>Mensaje</span>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Contame sobre tu proyecto, plazos y lo que tengas en mente."
                className={cn(fieldClass, "resize-none")}
              />
            </label>

            {/* Mismo hover que Hablemos y Contacto. El relleno es del mismo bordó que la tarjeta,
              así que un borde crema marca el contorno del botón mientras está lleno */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <PillButton
                type="submit"
                disabled={pending}
                aria-disabled={pending}
                label={pending ? "Enviando…" : "Enviar mensaje"}
                accentClassName="bg-[#7f011f] text-[#f6eee6]"
                hoverTextClassName="group-hover:text-[#f6eee6] group-focus-visible:text-[#f6eee6]"
                className="w-fit bg-[#f6eee6] text-[#7f011f] ring-1 ring-transparent transition-[scale,box-shadow] hover:ring-[#f6eee6]/60 focus-visible:ring-[#f6eee6]/60 disabled:pointer-events-none disabled:opacity-70"
              />
              <p
                aria-live="polite"
                className="text-sm font-medium text-[#f6eee6]/85"
              >
                {!pending &&
                  state.status === "success" &&
                  "¡Gracias! Te respondo en menos de 24 horas."}
                {!pending && state.status === "error" && state.message}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
