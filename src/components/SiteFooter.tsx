"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatedFooter } from "@/components/ui/animated-footer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DESKTOP_QUERY = "(min-width: 768px)";

// El footer queda pegado al fondo de la pantalla (sticky) por debajo del contenido,
// que es opaco: cuando el contacto termina, lo va descubriendo desde abajo.
// Es más bajo que la pantalla, así al final se sigue viendo el borde del contacto.
export default function SiteFooter() {
  const [revealed, setRevealed] = useState(false);
  // En celular las manos se arman con menos columnas (45 en vez de 80) para que los
  // caracteres se lean. Se decide antes de montar el footer para no dibujarlas dos veces.
  const [desktop, setDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // El footer está siempre "en pantalla" (sticky), así que su propio observer no sirve:
  // las letras entran cuando el final del contenido empieza a subir.
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#contenido",
      start: "bottom 95%",
      onEnter: () => setRevealed(true),
      onLeaveBack: () => setRevealed(false),
    });
  });

  return (
    <div className="sticky bottom-0 z-0 h-[75svh] md:h-[80svh]">
      {desktop !== null && (
        <AnimatedFooter
          key={desktop ? "desktop" : "mobile"}
          headingLines={["Niuzzoli"]}
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
  );
}
