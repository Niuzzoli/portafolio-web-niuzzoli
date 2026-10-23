"use client";

import { useRef, useState, type ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { CircleCheck, MessagesSquare, Monitor, PanelsTopLeft, Rocket, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

// Scroll (en altos de pantalla) que dura cada paso mientras la sección está fijada
const SCROLL_PER_STEP = 0.8;

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function PanelHead({ icon: Icon, title }: { icon: ComponentType<LucideProps>; title: string }) {
  return (
    <div className="short:hidden">
      <Icon className="size-5 text-white/80" strokeWidth={1.5} aria-hidden />
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] md:mt-4">{title}</h3>
      <div className="my-4 h-px bg-white/10 md:my-5" />
    </div>
  );
}

function BriefPanel() {
  return (
    <>
      <PanelHead icon={MessagesSquare} title="El brief" />
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.15em] text-white/45">Objetivo del proyecto</p>
      <motion.ul variants={list} initial="hidden" animate="show" className="space-y-2">
        {["¿Qué queremos resolver?", "¿A quién está dirigido?", "¿Qué resultado buscamos?"].map((q) => (
          <motion.li key={q} variants={item} className="rounded-xl bg-white/[0.06] px-4 py-3 text-sm text-white/85">
            {q}
          </motion.li>
        ))}
      </motion.ul>
    </>
  );
}

function PlanPanel() {
  const tasks = ["Estructura y objetivos", "Diseño y funcionalidades", "Plan de desarrollo"];
  return (
    <>
      <PanelHead icon={PanelsTopLeft} title="El plan" />
      <motion.ul variants={list} initial="hidden" animate="show" className="space-y-3.5 rounded-xl border border-white/10 p-4">
        {tasks.map((task, i) => {
          const done = i < tasks.length - 1;
          return (
            <motion.li key={task} variants={item} className="flex items-center gap-3 text-sm text-white/85">
              {done ? (
                <CircleCheck className="size-[18px] text-emerald-400/90" strokeWidth={1.5} aria-hidden />
              ) : (
                <span className="relative grid size-[18px] place-items-center" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
                  <span className="size-[14px] rounded-full bg-white/85" />
                </span>
              )}
              {task}
            </motion.li>
          );
        })}
      </motion.ul>
    </>
  );
}

// La vista previa se "arma" con el scroll: usa --step-p (0 a 1, avance dentro del paso)
function BuildPanel() {
  const grow = (start: number) => ({
    transform: `scaleX(clamp(0.08, calc((var(--step-p) - ${start}) * 2.2), 1))`,
  });
  const appear = (start: number) => ({
    opacity: `clamp(0.2, calc((var(--step-p) - ${start}) * 3 + 0.2), 1)`,
    transform: `translateY(calc(clamp(0, 1 - (var(--step-p) - ${start}) * 3, 1) * 10px))`,
  });

  return (
    <>
      <PanelHead icon={Monitor} title="El producto tomando forma" />
      <div className="rounded-xl border border-white/10 bg-[#1a1114] p-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-[#c4314b]" />
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
        </div>
        <div className="mt-3 space-y-2.5 rounded-lg bg-[#3a1d25] p-4">
          <div className="h-1.5 w-[78%] origin-left rounded-full bg-[#eab0bd]" style={grow(0)} />
          <div className="h-1 w-[90%] origin-left rounded-full bg-white/25" style={grow(0.15)} />
          <div className="h-1 w-[58%] origin-left rounded-full bg-white/25" style={grow(0.25)} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="h-12 rounded-lg bg-[#3a1d25] md:h-14" style={appear(0.35)} />
          <div className="h-12 rounded-lg bg-[#3a1d25] md:h-14" style={appear(0.5)} />
        </div>
      </div>
      <p className="mt-3 text-[13px] text-white/50">Avances visibles en cada etapa del desarrollo.</p>
    </>
  );
}

function LaunchPanel() {
  return (
    <>
      <PanelHead icon={Rocket} title="Lanzamiento" />
      <div className="flex flex-col items-center pt-2 text-center md:pt-4">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="relative grid size-16 place-items-center rounded-full bg-emerald-500/20"
        >
          <motion.span
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 rounded-full bg-emerald-500/30"
          />
          <svg viewBox="0 0 24 24" fill="none" className="size-7 text-emerald-300" aria-hidden>
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.35 }}
            />
          </svg>
        </motion.span>
        <motion.div variants={list} initial="hidden" animate="show">
          <motion.p variants={item} className="mt-5 text-lg font-semibold tracking-[-0.02em]">
            Proyecto publicado
          </motion.p>
          <motion.p variants={item} className="mt-2 text-[13px] text-white/55">
            Validaciones completas · Listo para usar
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}

// Textos provisorios
const steps = [
  {
    title: "Brief",
    meta: "Día 1",
    label: "El brief",
    description: "Entendemos qué querés lograr, para quién es y cómo vamos a medir el resultado.",
    Panel: BriefPanel,
  },
  {
    title: "Plan",
    meta: "Semana 1",
    label: "El plan",
    description: "Definimos estructura, diseño y funcionalidades antes de escribir una línea de código.",
    Panel: PlanPanel,
  },
  {
    title: "Diseño y desarrollo",
    meta: "Por etapas",
    label: "En desarrollo",
    description: "Construimos por etapas, con avances que podés ver y probar en cada entrega.",
    Panel: BuildPanel,
  },
  {
    title: "Lanzamiento",
    meta: "Listo",
    label: "Lanzamiento",
    description: "Probamos todo, publicamos y te acompañamos después de salir.",
    Panel: LaunchPanel,
  },
];

export default function Process() {
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // En escritorio se fija todo (título + pasos + caja); en tablet/móvil el título pasa y se fijan pasos + caja
      mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (ctx) => {
        const target = ctx.conditions!.desktop ? inner.current : stage.current;
        trigger.current = ScrollTrigger.create({
          trigger: target,
          start: "top top",
          end: () => `+=${window.innerHeight * SCROLL_PER_STEP * steps.length}`,
          pin: target,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const raw = self.progress * steps.length;
            const index = Math.min(steps.length - 1, Math.floor(raw));
            setActive(index);
            root.current?.style.setProperty("--step-p", String(Math.min(1, raw - index)));
          },
        });
      });
    },
    { scope: root }
  );

  // Clic en un paso: scrollea hasta el medio de ese paso
  const goTo = (index: number) => {
    const st = trigger.current;
    if (!st) return;
    lenis?.scrollTo(st.start + ((st.end - st.start) * (index + 0.5)) / steps.length, { duration: 1.2 });
  };

  const { Panel, label } = steps[active];

  return (
    <section id="proceso" ref={root} className="relative text-white [--step-p:0]">
      <div
        ref={inner}
        className="mx-auto max-w-6xl px-4 pt-28 md:px-8 lg:grid lg:h-svh lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-20 lg:pt-24"
      >
        <div className="lg:col-start-1 lg:row-start-1">
          <span className="mb-6 inline-block rounded-full border border-white/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
            Cómo trabajamos
          </span>
          <h2 className="max-w-[14ch] text-[clamp(2.4rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            De la idea al lanzamiento en cuatro pasos.
          </h2>
          <p className="mt-5 max-w-md text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-white/55">
            Un proceso claro y a la vista en cada etapa: sabés qué se está haciendo, por qué y qué viene después.
          </p>
        </div>

        {/* En escritorio este contenedor "desaparece" (contents) y sus hijos van a la grilla */}
        <div
          ref={stage}
          className="flex h-svh flex-col justify-center gap-5 pb-4 pt-20 short:gap-3 short:pt-16 lg:contents"
        >
          <ol className="lg:col-start-1 lg:row-start-2 lg:mt-8">
            {steps.map((step, i) => {
              const isActive = active === i;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "w-full rounded-2xl px-4 py-3.5 text-left transition-colors duration-500 short:py-2.5 md:px-5 md:py-4",
                      isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    )}
                  >
                    <span className="flex items-baseline gap-4">
                      <span
                        className={cn(
                          "w-5 font-mono text-xs tabular-nums transition-colors duration-500",
                          isActive ? "text-[#e0566c]" : "text-white/30"
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-base font-semibold tracking-[-0.02em] transition-colors duration-500 md:text-[17px]",
                          isActive ? "text-white" : "text-white/45"
                        )}
                      >
                        {step.title}
                      </span>
                      <span className="font-mono text-[11px] text-white/30">{step.meta}</span>
                    </span>
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <span className="overflow-hidden pl-9">
                        <span className="block pt-2 text-[13px] leading-relaxed text-white/55 md:text-sm">
                          {step.description}
                        </span>
                        {/* Avance dentro del paso */}
                        <span className="mt-3 block h-px overflow-hidden bg-white/10">
                          <span
                            className="block h-full origin-left bg-[#c4314b]"
                            style={{ transform: isActive ? "scaleX(var(--step-p))" : "scaleX(0)" }}
                          />
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-1.5">
              <div className="flex items-center justify-between px-4 pb-2.5 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 md:text-[11px]">
                <span>{label}</span>
                <span className="normal-case tracking-normal text-white/30">
                  Paso {active + 1} de {steps.length}
                </span>
              </div>
              <div className="relative min-h-[20.5rem] overflow-hidden rounded-[1.375rem] border border-white/[0.06] bg-[#0b0809] p-5 short:min-h-[15rem] md:min-h-[23rem] md:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <Panel />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
