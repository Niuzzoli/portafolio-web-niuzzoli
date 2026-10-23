import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Botón pastilla con flecha (Hablemos del hero, Contacto del nav y Enviar del formulario).
// Con href es un link; sin href, un <button> (por ejemplo, el submit del formulario).
// Hover: el círculo de la flecha crece hasta llenar la pastilla, el texto rueda
// hacia arriba y la flecha sale en diagonal mientras entra otra desde abajo.

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const sizes = {
  sm: {
    pill: "h-11 gap-3 pl-5 pr-1.5 text-sm font-medium",
    dot: "size-8",
    arrow: "size-3.5",
  },
  md: {
    pill: "gap-4 py-1.5 pl-6 pr-1.5 text-[15px] font-semibold",
    dot: "size-9",
    arrow: "size-4",
  },
};

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

type PillButtonProps = {
  label: string;
  size?: keyof typeof sizes;
  /** Fondo y color de la flecha del círculo (y del relleno que crece en el hover) */
  accentClassName: string;
  /** Color del texto cuando el relleno cubre la pastilla */
  hoverTextClassName: string;
} & (
  | (ComponentProps<"a"> & { href: string })
  | (ComponentProps<"button"> & { href?: undefined })
);

export default function PillButton({
  label,
  size = "md",
  accentClassName,
  hoverTextClassName,
  className,
  ...props
}: PillButtonProps) {
  const s = sizes[size];
  const hovered = "group-hover:scale-[10] group-focus-visible:scale-[10]";

  const classes = cn(
    "group relative isolate flex w-fit items-center overflow-hidden rounded-full outline-none transition-[scale] duration-300 active:scale-[0.97]",
    s.pill,
    className,
  );

  const content = (
    <>
      {/* Relleno: arranca escondido detrás del círculo y se expande desde ahí */}
      <span
        aria-hidden
        className={cn(
          "absolute right-1.5 top-1/2 -z-10 -translate-y-1/2 rounded-full transition-transform duration-700",
          EASE,
          s.dot,
          accentClassName,
          hovered,
        )}
      />

      {/* Texto que rueda: sale hacia arriba y entra la copia desde abajo */}
      <span
        className={cn(
          "relative block overflow-hidden transition-colors duration-500",
          hoverTextClassName,
        )}
      >
        <span
          className={cn(
            "block transition-transform duration-500 group-hover:-translate-y-full group-focus-visible:-translate-y-full",
            EASE,
          )}
        >
          {label}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0",
            EASE,
          )}
        >
          {label}
        </span>
      </span>

      {/* Flecha que se va en diagonal y es reemplazada por otra */}
      <span
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden rounded-full transition-transform duration-500 group-hover:rotate-45 group-focus-visible:rotate-45",
          EASE,
          s.dot,
          accentClassName,
        )}
      >
        <ArrowUpRight
          className={cn(
            s.arrow,
            "transition-transform duration-500 group-hover:translate-x-[180%] group-hover:-translate-y-[180%] group-focus-visible:translate-x-[180%] group-focus-visible:-translate-y-[180%]",
            EASE,
          )}
        />
        <ArrowUpRight
          className={cn(
            s.arrow,
            "absolute -translate-x-[180%] translate-y-[180%] transition-transform delay-100 duration-500 group-hover:translate-0 group-focus-visible:translate-0",
            EASE,
          )}
        />
      </span>
    </>
  );

  if (props.href !== undefined) {
    return (
      <a {...(props as ComponentProps<"a">)} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button {...(props as ComponentProps<"button">)} className={classes}>
      {content}
    </button>
  );
}
