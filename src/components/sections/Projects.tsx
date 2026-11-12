"use client";

import { useEffect, useRef, type FocusEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { featuredProjects, projects } from "@/data/projects";
import { consumeReturnToProjects, isReturningToProjects } from "@/lib/return-to-projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Carrusel fijado de la home: muestra los proyectos destacados y termina en un paso "Ver todos"
// que lleva a /proyectos. Los datos salen de src/data/projects.ts.

const pad = (n: number) => String(n).padStart(2, "0");

// Proyectos destacados + la tarjeta "Ver todos"
const STEPS = featuredProjects.length + 1;
const MORE = projects.length - featuredProjects.length;

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const FOCUS_RING =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const slideTrigger = useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // Cuánto se desliza el carril para dejar cada tarjeta a la izquierda (la última queda a tope)
  const stops = () => {
    const el = track.current!;
    const distance = el.scrollWidth - el.clientWidth;
    const cards = Array.from(el.children) as HTMLElement[];
    const first = cards[0]?.offsetLeft ?? 0;
    return { distance, positions: cards.map((card) => Math.min(card.offsetLeft - first, distance)) };
  };

  // Índice de la tarjeta más cercana a un desplazamiento dado
  const nearest = (x: number, positions: number[]) =>
    positions.reduce((best, pos, i) => (Math.abs(pos - x) < Math.abs(positions[best] - x) ? i : best), 0);

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
        const distance = () => stops().distance;

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
              const { distance, positions } = stops();
              const current = nearest(self.progress * distance, positions) + 1;
              if (counter.current) counter.current.textContent = pad(current);
            },
          },
        });
        slideTrigger.current = slide.scrollTrigger ?? null;

        // La imagen se mueve un poco más lento que su tarjeta (parallax)
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((media) => {
          gsap.fromTo(
            media,
            // Recorrido igual al margen del contenedor (-inset-x-[5%]), así no se ven los bordes
            { xPercent: -4.5 },
            {
              xPercent: 4.5,
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

        return () => {
          slideTrigger.current = null;
        };
      });

      // Volviendo desde /proyectos: directo al último paso ("Ver todos"), sin animar
      // (se consume adentro del frame: en desarrollo React corre el efecto dos veces y cancela el primero)
      if (isReturningToProjects()) {
        const frame = requestAnimationFrame(() => {
          consumeReturnToProjects();
          ScrollTrigger.refresh();
          const st = slideTrigger.current;
          const last = track.current!.lastElementChild as HTMLElement;
          const target = st ? st.end : last.getBoundingClientRect().top + window.scrollY - 96;
          const smooth = lenisRef.current;
          if (smooth) {
            // Lenis puede tener guardado el alto de /proyectos (más corta) y recortaría el destino
            smooth.resize();
            smooth.scrollTo(target, { immediate: true, force: true });
          } else {
            window.scrollTo(0, target);
          }
        });
        return () => cancelAnimationFrame(frame);
      }
    },
    { scope: section }
  );

  // Teclado: al llegar con Tab a una tarjeta que está fuera de pantalla, se scrollea hasta ella
  // (en vez de que el navegador corra el carril de costado y desarme el efecto)
  const onCardFocus = (e: FocusEvent<HTMLElement>) => {
    if (viewport.current) viewport.current.scrollLeft = 0;
    const st = slideTrigger.current;
    if (!st) return;
    const card = e.currentTarget.parentElement!;
    const index = Array.from(track.current!.children).indexOf(card);
    const { distance, positions } = stops();
    if (index < 0 || distance <= 0) return;
    const target = st.start + (positions[index] / distance) * (st.end - st.start);
    if (lenis) lenis.scrollTo(target, { duration: 0.8 });
    else window.scrollTo(0, target);
  };

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
        <p
          aria-hidden
          className="mb-1 hidden font-mono text-sm font-medium tabular-nums text-white/50 motion-safe:block md:mb-3"
        >
          <span ref={counter} className="text-white">01</span> / {pad(STEPS)}
        </p>
      </div>

      <div ref={viewport} className="min-h-0 overflow-hidden motion-safe:flex-1">
        <div ref={track} className="flex h-full flex-col motion-safe:flex-row motion-safe:px-2 md:motion-safe:px-5">
          {featuredProjects.map((project, i) => (
            <div
              key={project.title}
              className="h-[80svh] w-full shrink-0 p-2 motion-safe:h-full motion-safe:w-[88%] md:p-3 md:motion-safe:w-[74%]"
            >
              <a
                href={project.href ?? "#proyectos"}
                // Los links a otros sitios abren en una pestaña aparte
                {...(project.href?.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
                onFocus={onCardFocus}
                className={`group relative flex size-full flex-col justify-end overflow-hidden rounded-[1.5rem] bg-[#120d0f] md:rounded-[2rem] ${FOCUS_RING}`}
              >
                <div data-parallax className="absolute -inset-x-[5%] inset-y-0">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`Captura de la web de ${project.title}`}
                      fill
                      sizes="(min-width: 768px) 78vw, 92vw"
                      style={{ objectPosition: `${project.focus ?? "50%"} top` }}
                      // Celular y tablet: tarjeta vertical, sin cover la imagen se aplasta. Escritorio: se ve entera.
                      className={`object-cover lg:object-fill transition-transform duration-1000 ${EASE} group-hover:scale-[1.03]`}
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
                    <h3 className="mt-2 text-[clamp(2.2rem,5.5vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.05em]">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[clamp(1rem,1.6vw,1.375rem)] font-medium leading-tight tracking-[-0.02em] text-white/60">
                      {project.description}
                    </p>
                  </div>
                  <span
                    className={`hidden size-14 shrink-0 place-items-center rounded-full bg-white/10 transition-transform duration-500 ${EASE} group-hover:-translate-y-1 group-hover:translate-x-1 md:grid`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-6" aria-hidden>
                      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          ))}

          {/* Paso final: lleva a la página con todos los proyectos */}
          <div className="h-[45svh] w-full shrink-0 p-2 motion-safe:h-full motion-safe:w-[72%] md:p-3 md:motion-safe:w-[36%]">
            <Link
              href="/proyectos"
              onFocus={onCardFocus}
              className={`group relative flex size-full flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[radial-gradient(ellipse_at_70%_20%,#3a0712_0%,#120d0f_65%)] p-5 md:rounded-[2rem] md:p-10 ${FOCUS_RING}`}
            >
              <span className="font-mono text-sm font-medium tabular-nums text-white/50">{pad(STEPS)}</span>

              <div>
                {MORE > 0 && (
                  <p className="text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.8] tracking-[-0.06em] text-[#c4314b]">
                    +{MORE}
                  </p>
                )}
                <h3 className="mt-4 text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.05em]">
                  Ver todos
                </h3>
                <p className="mt-3 flex items-center gap-3 text-[clamp(1rem,1.6vw,1.375rem)] font-medium leading-tight tracking-[-0.02em] text-white/60">
                  {MORE > 0
                    ? `${MORE} ${MORE === 1 ? "proyecto más" : "proyectos más"}`
                    : "Todos los proyectos"}
                  <span
                    aria-hidden
                    className={`inline-block transition-transform duration-500 ${EASE} group-hover:translate-x-2`}
                  >
                    →
                  </span>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
