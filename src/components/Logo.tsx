import { cn } from "@/lib/utils";

// Logo provisorio: reemplazar el contenido por tu SVG (o un <img src="/logo.svg" />).
// Tiene que escalar con el font-size, porque la intro lo usa gigante y la nav chico.
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-baseline font-bold leading-none tracking-[-0.06em]",
        className
      )}
    >
      ni<span className="text-[#c4314b]">.</span>
    </span>
  );
}
