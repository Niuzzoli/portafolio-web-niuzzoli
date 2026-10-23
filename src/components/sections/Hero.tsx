"use client";

import { useEffect, useRef, useState } from "react";
import Dither from "@/components/Dither";
import CipherReveal, {
  type CipherRevealHandle,
} from "@/components/CipherReveal";
import SplitText from "@/components/SplitText";
import { INTRO_DONE_EVENT } from "@/components/SiteHeader";
import PillButton from "@/components/PillButton";
import { WHATSAPP_URL } from "@/lib/contact";
import { cn } from "@/lib/utils";

// Textos de ejemplo: reemplazar por los definitivos
const TITLE = "Diseño y desarrollo web a medida.";
const DESCRIPTION =
  "Sitios rápidos, animados y pensados para convertir. Del primer boceto al lanzamiento, todo en un mismo lugar.";

const descriptionClass =
  "max-w-md text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-white/70";

export default function Hero() {
  const title = useRef<CipherRevealHandle>(null);
  // Secuencia: intro del logo → título se descifra → descripción aparece → botón
  const [titleDone, setTitleDone] = useState(false);
  const [descriptionDone, setDescriptionDone] = useState(false);

  useEffect(() => {
    const start = () => title.current?.replay();
    if (document.documentElement.dataset.intro === "done") {
      start();
      return;
    }
    window.addEventListener(INTRO_DONE_EVENT, start, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, start);
  }, []);

  return (
    <section id="inicio" className="relative h-svh w-full overflow-hidden">
      <Dither
        waveColor="#7f011f"
        ditherMode="bayer2"
        scale={1.45}
        waveSpeed={0.04}
        waveAmplitude={0.6}
        mouseEffect="reveal"
        mouseRadius={0.2}
        trail={0.3}
        intro={false}
      />
      {/* Desvanece el dither hacia negro para que no se note el corte con la sección siguiente */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-black" />

      {/* Abajo a la izquierda: el separador se superpone al final del hero, pero su parte de arriba es transparente */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-[calc(12vw+2rem)] md:px-8 md:pb-[calc(4vw+2rem)]">
        <CipherReveal
          ref={title}
          as="h1"
          text={TITLE}
          trigger="manual"
          duration={1.6}
          scramble={0.45}
          scrambleColor="rgb(179, 179, 179)"
          scrambleOpacity={0.50}
          onComplete={() => setTitleDone(true)}
          className="pointer-events-auto max-w-[14ch] text-[clamp(2.75rem,7.5vw,7rem)] font-bold leading-[0.92] tracking-[-0.05em] text-[#f6eee6]"
        />

        {/* Descripción y botón lado a lado (en celular, el botón va abajo) */}
        <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-10 md:mt-8">
          {titleDone ? (
            <SplitText
              text={DESCRIPTION}
              tag="p"
              effect="rise"
              hoverEffect="none"
              trigger="load"
              staggerFrom="start"
              splitType="chars"
              delay={12}
              duration={0.9}
              textAlign="left"
              onLetterAnimationComplete={() => setDescriptionDone(true)}
              className={descriptionClass}
            />
          ) : (
            // Ocupa el mismo lugar mientras tanto, así el botón no salta cuando aparece el texto
            <p aria-hidden className={cn(descriptionClass, "invisible")}>
              {DESCRIPTION}
            </p>
          )}

          <PillButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            label="Hablemos"
            accentClassName="bg-[#7f011f] text-[#f6eee6]"
            hoverTextClassName="group-hover:text-[#f6eee6] group-focus-visible:text-[#f6eee6]"
            className={cn(
              "pointer-events-auto shrink-0 bg-[#f6eee6] text-black transition-[opacity,translate,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              descriptionDone
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0",
            )}
          />
        </div>
      </div>
    </section>
  );
}
