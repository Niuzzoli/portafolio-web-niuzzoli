'use client';

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ElementType,
  type Ref
} from 'react';

// Réplica propia de "Cipher Reveal" (React Bits Pro): el titular se descifra letra por letra
// desde caracteres al azar. Cada letra real ocupa su lugar desde el principio (invisible),
// así la línea nunca se mueve mientras cambian los caracteres cifrados.

export interface CipherRevealHandle {
  replay: () => void;
}

export interface CipherRevealProps {
  text: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  scrambleColor?: string;
  scrambleOpacity?: number;
  charset?: string;
  trigger?: 'view' | 'mount' | 'manual';
  order?: 'left' | 'right' | 'center' | 'random';
  from?: 'blank' | 'scrambled';
  duration?: number;
  scramble?: number;
  rate?: number;
  hover?: 'trail' | 'replay' | 'none';
  hoverRadius?: number;
  onComplete?: () => void;
  ref?: Ref<CipherRevealHandle>;
  className?: string;
  style?: CSSProperties;
}

const UPPER = 'ABCDEFGHKMNOPRSUVXYZ#%&';
const LOWER = 'abcdeghknopqrsuvxyz';
const NARROW = 'ijlrtf!|:;';
const DIGITS = '0123456789';

// "auto": caracteres del mismo tipo y de ancho parecido a la letra original
const autoSet = (char: string) => {
  if (/[0-9]/.test(char)) return DIGITS;
  if (/[ijlIt!.,:;'|f]/.test(char)) return NARROW;
  if (char === char.toUpperCase() && char !== char.toLowerCase()) return UPPER;
  return LOWER;
};

const pick = (set: string) => set[Math.floor(Math.random() * set.length)];

type Glyph = { start: number; lock: number; shown: string; tick: number };

export default function CipherReveal({
  text,
  as = 'span',
  color,
  scrambleColor,
  scrambleOpacity = 0.45,
  charset = 'auto',
  trigger = 'view',
  order = 'left',
  from = 'blank',
  duration = 1.4,
  scramble = 0.45,
  rate = 14,
  hover = 'trail',
  hoverRadius = 0.6,
  onComplete,
  ref,
  className,
  style
}: CipherRevealProps) {
  const root = useRef<HTMLElement>(null);
  const chars = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphs = useRef<Glyph[]>([]);
  const raf = useRef(0);
  const revealed = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const letters = Array.from(text);
  const words: { char: string; index: number }[][] = [];
  letters.forEach((char, index) => {
    if (char === ' ') words.push([]);
    else {
      if (!words.length) words.push([]);
      words[words.length - 1].push({ char, index });
    }
  });

  const setFor = useCallback((char: string) => (charset === 'auto' ? autoSet(char) : charset), [charset]);

  // Dibuja el estado de cada letra para el instante "now" (en segundos)
  const paint = useCallback(
    (now: number) => {
      let busy = false;
      glyphs.current.forEach((g, i) => {
        const el = chars.current[i];
        if (!el) return;
        const overlay = el.firstElementChild as HTMLSpanElement;
        const real = el.lastElementChild as HTMLSpanElement;
        if (now >= g.lock) {
          real.style.opacity = '';
          overlay.textContent = '';
          return;
        }
        busy = true;
        real.style.opacity = '0';
        if (now < g.start) {
          overlay.textContent = from === 'scrambled' ? g.shown || (g.shown = pick(setFor(letters[i]))) : '';
          overlay.style.opacity = String(scrambleOpacity);
          return;
        }
        const tick = Math.floor(now * rate);
        if (tick !== g.tick || !g.shown) {
          g.tick = tick;
          g.shown = pick(setFor(letters[i]));
        }
        overlay.textContent = g.shown;
        // Se va aclarando hasta opacidad completa justo antes de fijarse
        const progress = Math.min(1, (now - g.start) / Math.max(0.001, g.lock - g.start));
        overlay.style.opacity = String(scrambleOpacity + (1 - scrambleOpacity) * progress);
      });
      return busy;
    },
    // letters cambia con text
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, from, rate, scrambleOpacity, setFor]
  );

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const loop = () => {
      const busy = paint(performance.now() / 1000);
      if (busy) raf.current = requestAnimationFrame(loop);
      else if (!revealed.current) {
        revealed.current = true;
        onCompleteRef.current?.();
      }
    };
    raf.current = requestAnimationFrame(loop);
  }, [paint]);

  const replay = useCallback(() => {
    const n = letters.length;
    const now = performance.now() / 1000;
    revealed.current = false;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      glyphs.current = letters.map(() => ({ start: 0, lock: 0, shown: '', tick: -1 }));
      paint(now);
      revealed.current = true;
      onCompleteRef.current?.();
      return;
    }

    const spread = Math.max(0, duration - scramble);
    const randoms = letters.map(() => Math.random());
    glyphs.current = letters.map((char, i) => {
      if (char === ' ') return { start: now, lock: now, shown: '', tick: -1 };
      const t = n > 1 ? i / (n - 1) : 0;
      const pos =
        order === 'right' ? 1 - t : order === 'center' ? Math.abs(t - 0.5) * 2 : order === 'random' ? randoms[i] : t;
      const start = now + pos * spread;
      return { start, lock: start + scramble, shown: '', tick: -1 };
    });
    paint(now);
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration, scramble, order, paint, run]);

  useImperativeHandle(ref, () => ({ replay }), [replay]);

  // Antes de arrancar, las letras quedan ocultas (o cifradas si from="scrambled")
  useEffect(() => {
    glyphs.current = letters.map(() => ({ start: Infinity, lock: Infinity, shown: '', tick: -1 }));
    paint(0);
    revealed.current = false;

    if (trigger === 'mount') replay();
    if (trigger !== 'view' || !root.current) return () => cancelAnimationFrame(raf.current);

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          observer.disconnect();
          replay();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  // Hover: "trail" vuelve a cifrar las letras que toca el puntero; "replay" repite todo
  useEffect(() => {
    const el = root.current;
    if (!el || hover === 'none') return;

    const onEnter = () => {
      if (hover === 'replay' && revealed.current) replay();
    };
    const onMove = (e: PointerEvent) => {
      if (hover !== 'trail' || !revealed.current) return;
      const radius = hoverRadius * (parseFloat(getComputedStyle(el).fontSize) || 16);
      const now = performance.now() / 1000;
      let touched = false;
      chars.current.forEach((span, i) => {
        if (!span || letters[i] === ' ') return;
        const box = span.getBoundingClientRect();
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        if (dx * dx + dy * dy > radius * radius) return;
        const g = glyphs.current[i];
        // Sigue cifrada mientras el puntero esté encima; se fija un rato después
        g.start = Math.min(g.start, now);
        if (g.lock <= now) g.start = now;
        g.lock = now + scramble;
        touched = true;
      });
      if (touched) run();
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, hoverRadius, scramble, replay, run, text]);

  const Tag = as as ElementType;

  return (
    <Tag ref={root} aria-label={text} className={className} style={{ color, ...style }}>
      {words.map((word, w) => (
        <span key={w}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {word.map(({ char, index }) => (
              <span
                key={index}
                ref={node => {
                  chars.current[index] = node;
                }}
                className="relative inline-block"
              >
                <span
                  className="pointer-events-none absolute inset-0 flex justify-center"
                  style={{ color: scrambleColor }}
                />
                <span style={{ opacity: 0 }}>{char}</span>
              </span>
            ))}
          </span>
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
