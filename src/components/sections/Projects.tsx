"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Project = {
  title: string;
  description: string;
  // Ruta en /public, por ejemplo "/proyectos/proyecto-1.jpg". Sin imagen se ve el espacio reservado.
  image?: string;
  href?: string;
};

const projects: Project[] = [
  {
    title: "Agendo",
    description: "Asistente que responde consultas y agenda turnos solo, mientras el negocio sigue trabajando.",
    image: "/proyectos/proyecto1.png",
    href: "https://agendobot.vercel.app",
  },
  {
    title: "Proa Energy",
    description: "Web institucional para una consultora de petróleo, gas y eficiencia energética.",
    image: "/proyectos/proyecto2.png",
    href: "https://proaenergy.com.ar",
  },
  {
    title: "Noir Barbería",
    description: "Sitio para una barbería con servicios, equipo, galería y reserva de turnos online.",
    image: "/proyectos/proyecto3.png",
    href: "https://barberianoir.vercel.app",
  },
  {
    title: "Detective",
    description: "Juego de investigación: casos con evidencias, sospechosos y líneas de tiempo para resolver.",
    image: "/proyectos/proyecto4.png",
    href: "https://detectiveando.vercel.app",
  },
  {
    title: "Daily Puzzles",
    description: "Un puzzle nuevo cada día: Wordle, Sudoku y Connections con rachas y estadísticas.",
    image: "/proyectos/proyecto5.png",
    href: "https://minipuzzles.vercel.app",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.from(heading.current, {
        autoAlpha: 0,
        y: 60,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: section.current, start: "top 75%" },
      });

      // Con "reducir movimiento" los proyectos quedan uno debajo del otro, sin pin
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current!.scrollWidth - track.current!.clientWidth;

        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const current = Math.round(self.progress * (projects.length - 1)) + 1;
              if (counter.current) counter.current.textContent = pad(current);
            },
          },
        });

        // La imagen se mueve un poco más lento que su tarjeta (parallax)
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: media.parentElement,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
    },
    { scope: section }
  );

  return (
    <section
      id="proyectos"
      ref={section}
      className="relative flex flex-col pt-24 text-white motion-safe:h-svh md:pt-28"
    >
      <div className="flex items-end justify-between gap-6 px-4 pb-4 md:px-8 md:pb-6">
        <h2
          ref={heading}
          className="text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-[-0.055em]"
        >
          Proyectos<span className="text-[#c4314b]">.</span>
        </h2>
        <p className="mb-1 hidden font-mono text-sm font-medium tabular-nums text-white/50 motion-safe:block md:mb-3">
          <span ref={counter} className="text-white">01</span> / {pad(projects.length)}
        </p>
      </div>

      <div className="min-h-0 overflow-hidden motion-safe:flex-1">
        <div ref={track} className="flex h-full flex-col motion-safe:flex-row">
          {projects.map((project, i) => (
            <div key={project.title} className="h-[80svh] w-full shrink-0 p-2 motion-safe:h-full md:p-3">
              <a
                href={project.href ?? "#proyectos"}
                // Los links a otros sitios abren en una pestaña aparte
                {...(project.href?.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                className="group relative flex size-full flex-col justify-end overflow-hidden rounded-[1.5rem] bg-[#120d0f] md:rounded-[2rem]"
              >
                <div data-parallax className="absolute -inset-x-[10%] inset-y-0">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`Captura de la web de ${project.title}`}
                      fill
                      sizes="100vw"
                      className="object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_70%_30%,#3a0712_0%,#120d0f_60%)]">
                      <span className="rounded-full border border-dashed border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
                        Imagen del proyecto
                      </span>
                    </div>
                  )}
                </div>
                {/* Oscurece la base para que el texto se lea sobre cualquier imagen */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="relative flex items-end justify-between gap-6 p-5 md:p-10">
                  <div className="max-w-3xl">
                    <span className="font-mono text-sm font-medium tabular-nums text-white/50">{pad(i + 1)}</span>
                    <h3 className="mt-2 text-[clamp(2.2rem,6vw,5rem)] font-bold leading-[0.9] tracking-[-0.05em]">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[clamp(1rem,1.8vw,1.5rem)] font-medium leading-tight tracking-[-0.02em] text-white/60">
                      {project.description}
                    </p>
                  </div>
                  <span className="hidden size-14 shrink-0 place-items-center rounded-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:translate-x-1 md:grid">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-6" aria-hidden>
                      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
