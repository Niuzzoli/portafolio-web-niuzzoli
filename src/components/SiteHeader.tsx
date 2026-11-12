"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import Logo from "@/components/Logo";
import {
  SpotlightNavbar,
  type NavItem,
} from "@/components/ui/spotlight-navbar";
import PillButton from "@/components/PillButton";
import PillNav, { type PillNavItem } from "@/components/PillNav";
import { isReturningToProjects } from "@/lib/return-to-projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const INTRO_DONE_EVENT = "intro:done";

// La intro se ve una sola vez por visita. Al volver a la home desde otra página
// (que Next deja guardada y vuelve a mostrar) no se repite.
let introPlayed = false;

const navItems: NavItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Proceso", href: "#proceso" },
];

// Contacto va en su propia pastilla a la derecha, fuera del nav
const CONTACT_HREF = "#contacto";
const sections = [...navItems.map((item) => item.href), CONTACT_HREF];

// Menú hamburguesa (celular y tablet chica): todas las secciones en lista, incluido contacto
const mobileItems: PillNavItem[] = [
  ...navItems.map(({ label, href }) => ({ label, href })),
  { label: "Contacto", href: CONTACT_HREF },
];

// Links del menú móvil: los "#seccion" scrollean suave con Lenis en vez de saltar
function SmoothLink({ href, onClick, ...props }: ComponentProps<"a">) {
  const lenis = useLenis();
  return (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (!href?.startsWith("#")) return;
        e.preventDefault();
        lenis?.scrollTo(href, { duration: 1.4 });
      }}
    />
  );
}

// Sección activa: la última cuyo borde superior ya pasó la mitad de la pantalla
function currentSection() {
  const middle = window.innerHeight / 2;
  let index = 0;
  sections.forEach((href, i) => {
    const el = document.querySelector(href);
    if (el && el.getBoundingClientRect().top <= middle) index = i;
  });
  return sections[index];
}

// Tiempo mínimo que el logo queda a pantalla completa, aunque todo cargue antes
const MIN_INTRO_MS = 500;
// Si algo tarda demasiado en cargar, la intro sigue igual
const MAX_WAIT_MS = 3500;

function pageLoaded() {
  const load = new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
  return Promise.race([
    Promise.all([load, document.fonts.ready]),
    new Promise((r) => setTimeout(r, MAX_WAIT_MS)),
  ]);
}

export default function SiteHeader() {
  const [introDone, setIntroDone] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0]);
  const inContact = activeSection === CONTACT_HREF;
  const lenis = useLenis(() => setActiveSection(currentSection()));

  const scope = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const flyLogo = useRef<HTMLDivElement>(null);
  const logoPill = useRef<HTMLAnchorElement>(null);
  const navLogo = useRef<HTMLSpanElement>(null);
  const navPill = useRef<HTMLDivElement>(null);
  const contactPill = useRef<HTMLAnchorElement>(null);
  const mobileNav = useRef<HTMLDivElement>(null);
  const mobileLogo = useRef<HTMLSpanElement>(null);

  // Sin scroll mientras dura la intro
  useEffect(() => {
    if (!lenis) return;
    if (!introDone) {
      lenis.stop();
      return;
    }
    lenis.start();
    // Con el scroll bloqueado no hay barra vertical: las secciones fijadas (Proyectos) se midieron
    // con el ancho de la ventana entera y sobraba scroll horizontal. Al aparecer la barra se vuelve a medir.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [lenis, introDone]);

  useGSAP(
    () => {
      history.scrollRestoration = "manual";
      const skipIntro = introPlayed || isReturningToProjects();
      if (!skipIntro) window.scrollTo(0, 0);

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let cancelled = false;

      const finish = () => {
        gsap.set(
          [
            logoPill.current,
            navPill.current,
            contactPill.current,
            mobileNav.current,
          ],
          { autoAlpha: 1 },
        );
        gsap.set([navLogo.current, mobileLogo.current], { autoAlpha: 1 });
        gsap.set([flyLogo.current, backdrop.current], { autoAlpha: 0 });
        introPlayed = true;
        setIntroDone(true);
        startHero();
      };

      // Aviso para el hero: el título arranca a la vez que entra la nav (una sola vez)
      let heroStarted = false;
      const startHero = () => {
        if (heroStarted) return;
        heroStarted = true;
        document.documentElement.dataset.intro = "done";
        window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      };

      // Ya se vio (o se vuelve a proyectos): todo directo a su estado final, sin animar
      if (skipIntro) {
        finish();
        return;
      }

      gsap.fromTo(
        flyLogo.current,
        { autoAlpha: 0, yPercent: 12 },
        { autoAlpha: 1, yPercent: 0, duration: 1, ease: "expo.out" },
      );

      Promise.all([
        pageLoaded(),
        new Promise((r) => setTimeout(r, MIN_INTRO_MS)),
      ]).then(() => {
        if (cancelled) return;

        if (reduce) {
          gsap.to([flyLogo.current, backdrop.current], {
            autoAlpha: 0,
            duration: 0.4,
            onComplete: finish,
          });
          gsap.to(
            [
              logoPill.current,
              navPill.current,
              contactPill.current,
              mobileNav.current,
            ],
            {
              autoAlpha: 1,
              duration: 0.4,
            },
          );
          return;
        }

        // Se mide antes de tocar escalas: el logo gigante viaja hasta el lugar exacto del logo chico.
        // El destino es el logo que se ve: el de la nav de escritorio o el del menú móvil.
        // Se corta el fade-in por si seguía en curso: si no, pisaba el autoAlpha del final y el logo quedaba duplicado
        gsap.killTweensOf(flyLogo.current);
        gsap.set(flyLogo.current, { autoAlpha: 1, yPercent: 0 });
        const target = navLogo.current!.offsetParent
          ? navLogo.current!
          : mobileLogo.current!;
        const from = flyLogo.current!.getBoundingClientRect();
        const to = target.getBoundingClientRect();

        gsap
          .timeline({ onComplete: finish })
          .to(flyLogo.current, {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
            duration: 1.1,
            ease: "expo.inOut",
          })
          .to(
            backdrop.current,
            { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" },
            0.15,
          )
          .fromTo(
            logoPill.current,
            { autoAlpha: 0, scale: 0.6 },
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
            0.5,
          )
          .call(startHero, [], 0.55)
          .fromTo(
            navPill.current,
            { autoAlpha: 0, y: -16 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" },
            0.55,
          )
          .fromTo(
            contactPill.current,
            { autoAlpha: 0, scale: 0.6 },
            { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
            0.6,
          )
          .fromTo(
            mobileNav.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
            0.55,
          );
      });

      return () => {
        cancelled = true;
      };
    },
    { scope },
  );

  const scrollTo = (href: string) => lenis?.scrollTo(href, { duration: 1.4 });

  return (
    <div ref={scope}>
      {/* Escritorio y tablet (768px+): logo, nav y contacto en pastillas separadas */}
      <header className="fixed inset-x-0 top-0 z-50 hidden items-center gap-3 px-8 pt-8 md:grid md:grid-cols-[1fr_auto_1fr]">
        <a
          ref={logoPill}
          href="#inicio"
          aria-label="Ir al inicio"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#inicio");
          }}
          className="spotlight-nav-bg glass-border spotlight-nav-shadow invisible flex h-11 items-center justify-self-start rounded-full px-5 text-white"
        >
          <span ref={navLogo} className="invisible flex">
            <Logo className="text-[1.375rem]" />
          </span>
        </a>

        <div ref={navPill} className="invisible">
          <SpotlightNavbar
            items={navItems}
            // En contacto ningún ítem del nav queda activo (la línea se apaga)
            activeIndex={navItems.findIndex(
              (item) => item.href === activeSection,
            )}
            className="pt-0"
            onItemClick={(item) => scrollTo(item.href)}
          />
        </div>

        <PillButton
          ref={contactPill}
          href={CONTACT_HREF}
          size="sm"
          label="Contacto"
          aria-current={inContact ? "location" : undefined}
          onClick={(e) => {
            e.preventDefault();
            scrollTo(CONTACT_HREF);
          }}
          // En la sección de contacto el círculo pasa a crema (y el relleno del hover también)
          accentClassName={
            inContact
              ? "bg-[#f6eee6] text-[#7f011f]"
              : "bg-[#7f011f] text-[#f6eee6]"
          }
          hoverTextClassName={
            inContact
              ? "group-hover:text-[#7f011f] group-focus-visible:text-[#7f011f]"
              : "group-hover:text-[#f6eee6] group-focus-visible:text-[#f6eee6]"
          }
          className="spotlight-nav-bg glass-border spotlight-nav-shadow invisible justify-self-end text-white"
        />
      </header>

      {/* Celular: logo a la izquierda y hamburguesa a la derecha; al abrir se unen en una lista */}
      <div
        ref={mobileNav}
        className="invisible fixed inset-x-0 top-0 z-50 px-4 pt-4 md:hidden"
      >
        <PillNav
          collapse="always"
          intro={false}
          logo={
            <span ref={mobileLogo} className="invisible flex text-white">
              <Logo className="text-[1.05rem]" />
            </span>
          }
          logoAlt="Ir al inicio"
          logoHref="#inicio"
          items={mobileItems}
          activeHref={activeSection}
          linkComponent={SmoothLink}
          barColor="rgba(10, 10, 10, 0.88)"
          textColor="#f6eee6"
          highlightColor="#7f011f"
          highlightTextColor="#f6eee6"
          ariaLabel="Menú"
        />
      </div>

      {/* Intro: el logo cubre la pantalla mientras carga todo y después viaja a su pastilla */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
        <div ref={backdrop} className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={flyLogo}
            className="invisible flex text-white will-change-transform"
          >
            <Logo className="text-[clamp(7rem,30vw,15rem)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
