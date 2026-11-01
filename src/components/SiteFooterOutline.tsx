"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatedFooter } from "@/components/ui/animated-footer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DESKTOP_QUERY = "(min-width: 768px)";

// PRUEBA: variante del footer con el nombre gigante en contorno (como el footer-8 de React Bits),
// cortado a la mitad por el borde de abajo. Las letras aparecen desde el centro hacia los extremos
// y las manos quedan en la franja de arriba, sin pisar el nombre.
// El footer original sigue en SiteFooter.tsx por si preferimos volver a él.
export default function SiteFooterOutline() {
  const [revealed, setRevealed] = useState(false);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#contenido",
      start: "bottom 95%",
      onEnter: () => setRevealed(true),
      onLeaveBack: () => setRevealed(false),
    });
  });

  // Arrancan escondidas (gsap maneja el yPercent, así no se mezcla con transforms en px)
  useGSAP(
    () => {
      gsap.set(gsap.utils.toArray("[data-char]", nameRef.current), { yPercent: 125 });
    },
    { scope: nameRef },
  );

  // Letras escondidas debajo de la máscara del título; entran desde el medio hacia los costados
  useGSAP(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>("[data-char]", nameRef.current);
      if (revealed) {
        gsap.to(chars, {
          yPercent: 0,
          duration: 1,
          ease: "power3.out",
          stagger: { each: 0.04, from: "center" },
          overwrite: true,
        });
      } else {
        gsap.to(chars, {
          yPercent: 125,
          duration: 0.4,
          ease: "power2.in",
          stagger: { each: 0.01, from: "center" },
          overwrite: true,
        });
      }
    },
    { dependencies: [revealed] },
  );

  return (
    <div className="sticky bottom-0 z-0 h-[75svh] overflow-hidden bg-black md:h-[80svh]">
      {/* Las manos ocupan solo la franja de arriba: el nombre queda libre abajo */}
      <div className="absolute inset-x-0 top-0 bottom-0 md:bottom-[10vw]">
        {desktop !== null && (
          <AnimatedFooter
            key={desktop ? "desktop" : "mobile"}
            headingLines={[]}
            columns={desktop ? 80 : 45}
            background="#000000"
            textColor="#f6eee6"
            charColor="#7f011f"
            hoverColor="#c4314b"
            hoverCharColor="#000000"
            revealed={revealed}
          />
        )}
      </div>

      {/* Nombre en contorno, cortado a la mitad por el borde de abajo y con fundido */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <h2
          ref={nameRef}
          aria-label="Niuzzoli"
          className="translate-y-[50%] select-none overflow-hidden whitespace-nowrap pb-[0.15em] font-bold leading-none tracking-tight"
          style={{
            fontSize: "22vw",
            color: "transparent",
            WebkitTextStroke: "2px rgba(246, 238, 230, 0.6)",
            maskImage: "linear-gradient(to bottom, #000 30%, rgba(0,0,0,0.2) 50%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 30%, rgba(0,0,0,0.2) 50%)",
          }}
        >
          {Array.from("Niuzzoli").map((ch, i) => (
            <span
              key={i}
              data-char
              aria-hidden="true"
              className="inline-block"
            >
              {ch}
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
}
