"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Service = {
  title: string;
  description: string;
  // Ruta en /public, por ejemplo "/servicios/diseno.jpg". Sin imagen se ve el espacio reservado.
  image?: string;
  // Colores de la tarjeta
  tone: string;
  accent: string;
  // Dónde cae cada tarjeta al apilarse (en móvil solo una rotación chica)
  placement: string;
};

// Textos provisorios
const services: Service[] = [
  {
    title: "Diseño",
    image: "/servicios/diseno.jpg",
    description: "Interfaces e identidades pensadas para que tu marca se vea y se sienta a la altura.",
    tone: "bg-[#efe8df] text-[#140f10]",
    accent: "text-[#7f011f]",
    placement: "-rotate-2 translate-y-0 md:-translate-x-[45%] md:-translate-y-10 md:-rotate-6 lg:-translate-x-[62%]",
  },
  {
    title: "Desarrollo",
    image: "/servicios/desarrollo.jpg",
    description: "Webs y aplicaciones rápidas, responsive y hechas para crecer con tu proyecto.",
    tone: "bg-[#7f011f] text-[#f6eee6] selection-invert",
    accent: "text-[#ffb3a7]",
    placement: "rotate-1 translate-y-3 md:translate-x-0 md:translate-y-4 md:rotate-3",
  },
  {
    title: "Automatizaciones",
    image: "/servicios/automatizacion.jpg",
    description: "Procesos que trabajan solos para que vos te dediques a lo importante.",
    tone: "bg-[#1b1416] text-[#f6eee6] ring-1 ring-white/10",
    accent: "text-[#e0566c]",
    placement: "-rotate-1 translate-y-6 md:translate-x-[45%] md:translate-y-10 md:-rotate-3 lg:translate-x-[62%]",
  },
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Services() {
  const heading = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(heading.current!.children, {
        autoAlpha: 0,
        y: 48,
        stagger: 0.12,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: heading.current, start: "top 80%" },
      });
    },
    { scope: heading }
  );

  return (
    <section id="servicios" className="relative overflow-x-clip px-4 pt-16 text-white md:px-8 md:pt-8">
      <div ref={heading} className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* <span className="mb-8 rounded-full border border-white/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
          Servicios
        </span> */}
        <h2 className="text-[clamp(2.6rem,9vw,7.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.045em]">
          Ideas claras.
        </h2>
        {/* En la fuente de código: la mono es más ancha, así que va un poco más chica para que las dos líneas midan parecido */}
        <h2 className="font-mono text-[clamp(2.1rem,7.4vw,6.2rem)] font-bold uppercase leading-[0.95] tracking-[-0.07em]">
          Código limpio.
        </h2>
        <p className="mt-4 text-[clamp(1.6rem,4.5vw,3.5rem)] font-medium leading-none tracking-[-0.03em]">
          <span className="text-shine">
          Todo en un mismo lugar.</span>
        </p>
      </div>

      {/* Cada tarjeta es sticky: sube con el scroll y se queda arriba de la anterior.
          Todas se fijan a la misma altura y sin margen, así se sueltan juntas al final;
          la separación entre tarjetas va en espaciadores aparte. */}
      <ul className="relative mx-auto mt-24 max-w-6xl [--card-h:27rem] md:mt-40 md:[--card-h:29rem]">
        {services.map((service, i) => (
          <Fragment key={service.title}>
            {i > 0 && <li aria-hidden className="h-[45svh]" />}
            <li className="sticky top-[calc(50svh-var(--card-h)/2+1.5rem)] flex h-[var(--card-h)] justify-center md:top-[calc(50svh-var(--card-h)/2+2rem)]">
              <article
                className={cn(
                  "flex h-full w-full max-w-[22rem] flex-col rounded-[1.75rem] p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] md:w-[22rem]",
                  service.tone,
                  service.placement
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="relative aspect-square w-[52%] overflow-hidden rounded-[1.25rem] bg-current/10">
                    {service.image ? (
                      <Image src={service.image} alt={service.title} fill sizes="(min-width: 768px) 190px, 50vw" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-[0.2em] opacity-40">
                        Imagen
                      </span>
                    )}
                  </div>
                  {/* <span className={cn("grid size-10 place-items-center rounded-full bg-current/10", service.accent)}>
                    <Arrow />
                  </span> */}
                </div>
  
                <div className="mt-auto px-3 pb-3">
                  <span className="font-mono text-xs font-medium tabular-nums opacity-50">0{i + 1}</span>
                  <h3 className="mt-1 text-[1.75rem] font-bold uppercase leading-[0.95] tracking-[-0.04em]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-snug opacity-75">{service.description}</p>
                </div>
              </article>
            </li>
          </Fragment>
        ))}
        {/* Pausa con las tres tarjetas apiladas antes de que se vayan juntas */}
        <li aria-hidden className="h-[45svh]" />
      </ul>
    </section>
  );
}
