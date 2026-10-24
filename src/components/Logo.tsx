import { cn } from "@/lib/utils";

// Mide 1em de alto: escala con el font-size, porque la intro lo usa gigante y la nav chico.
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex select-none leading-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiene que medir 1em, next/image pide tamaño fijo */}
      <img
        src="/logo.png"
        alt="Niuzzoli"
        width={516}
        height={580}
        draggable={false}
        className="block h-[1em] w-auto"
      />
    </span>
  );
}
