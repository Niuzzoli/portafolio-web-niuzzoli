"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { CATEGORY_LABELS, projects, type ProjectCategory } from "@/data/projects";
import { requestReturnToProjects } from "@/lib/return-to-projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Grilla de /proyectos con todos los proyectos y filtros por categoría.

type Filter = "todos" | ProjectCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  ...(Object.keys(CATEGORY_LABELS) as ProjectCategory[]).map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  })),
];

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const FOCUS_RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>("todos");
  const scope = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const lenis = useLenis();

  const visible = filter === "todos" ? projects : projects.filter((p) => p.category === filter);

  // Al entrar desde la home se arranca arriba de todo (si no, puede quedar la posición del pin)
  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [lenis]);

  // Título: misma entrada que en la home
  useGSAP(
    () => {
      gsap.from(heading.current, { autoAlpha: 0, y: 60, duration: 1.2, ease: "expo.out" });
    },
    { scope }
  );

  // Tarjetas: suben y aparecen al entrar en pantalla. Se rearma con cada filtro.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        gsap.set(cards, { autoAlpha: 0, y: 60 });
        ScrollTrigger.batch(cards, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
        // La imagen arranca un poco agrandada y se asienta (como el hover de la home, al revés)
        gsap.utils.toArray<HTMLElement>("[data-card-media]").forEach((media) => {
          gsap.fromTo(
            media,
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: media, start: "top bottom", end: "bottom 60%", scrub: true },
            }
          );
        });
      });
      // El alto de la página cambió: recalcular el resto de los triggers (por ejemplo, el footer)
      ScrollTrigger.refresh();
    },
    { scope, dependencies: [filter], revertOnUpdate: true }
  );

  return (
    <div ref={scope} className="px-4 pb-24 pt-28 text-white md:px-8 md:pb-32 md:pt-36">
      {/* Única navegación de la página: fija arriba a la izquierda, con el estilo de las pastillas del header.
        Vuelve a la home en la sección de proyectos (no arriba de todo). */}
      <Link
        href="/"
        scroll={false}
        onClick={requestReturnToProjects}
        className={`spotlight-nav-bg glass-border spotlight-nav-shadow group fixed left-4 top-4 z-50 flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium text-white/80 transition-colors hover:text-white md:left-8 md:top-8 ${FOCUS_RING}`}
      >
        <span aria-hidden className={`transition-transform duration-500 ${EASE} group-hover:-translate-x-1`}>
          ←
        </span>
        Volver al inicio
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1
          ref={heading}
          className="text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-[-0.055em]"
        >
          Proyectos<span className="text-[#c4314b]">.</span>
        </h1>

        <div role="group" aria-label="Filtrar proyectos por categoría" className="flex flex-wrap gap-2 md:mb-3">
          {FILTERS.map(({ value, label }) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(value)}
                className={`h-10 rounded-full px-4 text-sm font-medium transition-colors duration-300 ${FOCUS_RING} ${
                  active
                    ? "bg-[#7f011f] text-[#f6eee6]"
                    : "border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lectores de pantalla: avisa cuántos quedaron al filtrar */}
      <p aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "proyecto" : "proyectos"}
      </p>

      <ul className="mt-10 grid gap-x-4 gap-y-10 md:mt-14 md:grid-cols-2 md:gap-x-6 md:gap-y-14 xl:grid-cols-3">
        {visible.map((project) => {
          const number = projects.indexOf(project) + 1;
          return (
            <li key={project.title} data-card>
              <a
                href={project.href ?? "/proyectos"}
                {...(project.href?.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                className={`group block rounded-[1.5rem] ${FOCUS_RING}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-[#120d0f] md:rounded-[2rem]">
                  <div data-card-media className="absolute inset-0">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={`Captura de la web de ${project.title}`}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        style={{ objectPosition: `${project.focus ?? "50%"} top` }}
                        className={`object-cover transition-transform duration-1000 ${EASE} group-hover:scale-[1.04]`}
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_70%_30%,#3a0712_0%,#120d0f_60%)]">
                        <span className="rounded-full border border-dashed border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
                          Imagen del proyecto
                        </span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur-sm transition-transform duration-500 ${EASE} group-hover:-translate-y-1 group-hover:translate-x-1`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-5" aria-hidden>
                      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
                  <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[0.95] tracking-[-0.05em]">
                    {project.title}
                  </h2>
                  <span className="shrink-0 font-mono text-xs font-medium uppercase tracking-[0.15em] text-white/50">
                    <span className="tabular-nums">{pad(number)}</span> · {CATEGORY_LABELS[project.category]}
                  </span>
                </div>
                <p className="mt-2 max-w-xl px-1 text-base font-medium leading-snug tracking-[-0.01em] text-white/60 md:text-lg">
                  {project.description}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
