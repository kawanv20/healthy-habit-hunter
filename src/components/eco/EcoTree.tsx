import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Árvore EcoVida — cena SVG animada com 6 estágios.
 * Puramente visual: representa o progresso do usuário no app, nunca compensação ambiental real.
 */
export function EcoTree({
  stage,
  className,
  glow = false,
  celebrate = false,
}: {
  /** 0 = semente … 5 = ecossistema */
  stage: number;
  className?: string;
  /** brilho sutil ao ganhar pontos */
  glow?: boolean;
  /** animação de crescimento ao evoluir de estágio */
  celebrate?: boolean;
}) {
  const s = Math.max(0, Math.min(5, stage));
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-4xl",
        "bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.97_0.03_200)_0%,oklch(0.96_0.04_150)_45%,oklch(0.93_0.06_140)_100%)]",
        "dark:bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.28_0.05_200)_0%,oklch(0.24_0.05_160)_50%,oklch(0.21_0.04_150)_100%)]",
        className,
      )}
    >
      {/* luz ambiente */}
      <span
        className={cn(
          "pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-sun/25 blur-3xl transition-opacity duration-1000",
          s >= 3 ? "opacity-100" : "opacity-50",
        )}
      />
      {glow && (
        <span className="pointer-events-none absolute inset-0 animate-eco-glow bg-[radial-gradient(60%_50%_at_50%_70%,oklch(0.85_0.2_140/0.45),transparent_70%)]" />
      )}

      <svg
        viewBox="0 0 240 180"
        className={cn(
          "relative size-full transition-[opacity,transform] duration-700 ease-out",
          mounted ? "scale-100 opacity-100" : "scale-95 opacity-0",
          celebrate && "animate-eco-grow",
        )}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="eco-canopy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.19 143)" />
            <stop offset="100%" stopColor="oklch(0.5 0.13 155)" />
          </linearGradient>
          <linearGradient id="eco-trunk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.5 0.07 60)" />
            <stop offset="60%" stopColor="oklch(0.4 0.06 55)" />
            <stop offset="100%" stopColor="oklch(0.32 0.05 50)" />
          </linearGradient>
          <linearGradient id="eco-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.09 100)" />
            <stop offset="100%" stopColor="oklch(0.42 0.07 80)" />
          </linearGradient>
        </defs>

        {/* colinas ao fundo (a partir de Muda) */}
        {s >= 2 && (
          <g className="animate-eco-in">
            <path d="M-10 150 Q 45 118 105 150 Z" fill="oklch(0.8 0.07 155)" opacity="0.55" />
            <path d="M120 150 Q 180 112 260 150 Z" fill="oklch(0.84 0.06 150)" opacity="0.5" />
          </g>
        )}

        {/* terra */}
        <path d="M20 152 Q 120 132 220 152 L 230 180 L 10 180 Z" fill="url(#eco-soil)" />
        <ellipse cx="120" cy="150" rx="72" ry="10" fill="oklch(0.7 0.13 145)" opacity={s >= 2 ? 0.9 : 0.4} />

        {/* vegetação ao redor (Ecossistema) */}
        {s >= 5 && (
          <g className="animate-eco-in">
            {[36, 54, 186, 204].map((x, i) => (
              <g key={x} className="origin-bottom animate-eco-sway" style={{ animationDelay: `${i * 0.4}s` }}>
                <path d={`M${x} 152 q -6 -14 -1 -22`} stroke="oklch(0.6 0.14 150)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d={`M${x} 152 q 7 -12 2 -20`} stroke="oklch(0.68 0.15 145)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            ))}
            {/* pequenos animais discretos */}
            <g className="animate-eco-hop">
              <ellipse cx="176" cy="148" rx="6" ry="4" fill="oklch(0.55 0.08 60)" />
              <circle cx="182" cy="145" r="3" fill="oklch(0.55 0.08 60)" />
              <path d="M170 147 q -5 -3 -2 -7" stroke="oklch(0.55 0.08 60)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* semente */}
        {s === 0 && (
          <g className="animate-eco-pulse">
            <ellipse cx="120" cy="146" rx="7" ry="9" fill="oklch(0.52 0.09 70)" />
            <path d="M120 140 q 4 3 2 8" stroke="oklch(0.72 0.12 100)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* broto */}
        {s === 1 && (
          <g className="origin-bottom animate-eco-sway">
            <path d="M120 148 L 120 118" stroke="oklch(0.6 0.15 145)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M120 126 q -20 -6 -22 10 q 16 6 22 -10" fill="url(#eco-canopy)" />
            <path d="M120 122 q 20 -8 23 8 q -17 7 -23 -8" fill="url(#eco-canopy)" />
          </g>
        )}

        {/* muda / árvore */}
        {s >= 2 && (
          <g className="origin-bottom animate-eco-sway" style={{ animationDuration: s >= 4 ? "5s" : "6.5s" }}>
            {/* tronco */}
            <path
              d={
                s === 2
                  ? "M116 150 q 2 -26 4 -40 l 4 0 q 2 16 4 40 z"
                  : s === 3
                    ? "M112 150 q 4 -38 6 -58 l 6 0 q 4 22 8 58 z"
                    : "M108 150 q 6 -50 8 -76 l 8 0 q 4 28 12 76 z"
              }
              fill="url(#eco-trunk)"
            />
            {/* galhos */}
            {s >= 3 && (
              <g stroke="url(#eco-trunk)" strokeWidth={s >= 4 ? 4 : 3} fill="none" strokeLinecap="round">
                <path d={s >= 4 ? "M118 96 q -18 -6 -26 -18" : "M118 108 q -14 -4 -20 -14"} />
                <path d={s >= 4 ? "M120 88 q 20 -6 28 -20" : "M120 100 q 15 -5 21 -15"} />
              </g>
            )}

            {/* copa */}
            <g className="animate-eco-breathe origin-bottom">
              {canopyBlobs(s).map((b, i) => (
                <ellipse
                  key={i}
                  cx={b.cx}
                  cy={b.cy}
                  rx={b.rx}
                  ry={b.ry}
                  fill="url(#eco-canopy)"
                  opacity={b.o}
                  className="animate-eco-leaf"
                  style={{ animationDelay: `${i * 0.35}s` }}
                />
              ))}
            </g>

            {/* flores / frutos ocasionais */}
            {s >= 4 && (
              <g className="animate-eco-in">
                {[
                  [100, 74],
                  [138, 66],
                  [122, 52],
                  [112, 88],
                ].map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={i % 2 ? "oklch(0.83 0.15 80)" : "oklch(0.72 0.16 20)"}
                    className="animate-eco-pulse"
                    style={{ animationDelay: `${i * 0.7}s` }}
                  />
                ))}
              </g>
            )}
          </g>
        )}

        {/* borboletas / pássaros discretos */}
        {s >= 4 && (
          <g className="animate-eco-flit">
            <path d="M62 60 q 6 -8 10 0 q -6 6 -10 0" fill="oklch(0.62 0.16 20)" opacity="0.85" />
            <path d="M72 60 q 6 -8 10 0 q -6 6 -10 0" fill="oklch(0.83 0.15 80)" opacity="0.8" />
          </g>
        )}
        {s >= 5 && (
          <g className="animate-eco-flit" style={{ animationDelay: "2s", animationDuration: "16s" }}>
            <path d="M170 44 q 7 -6 13 0" stroke="oklch(0.35 0.05 155)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M183 44 q 7 -6 13 0" stroke="oklch(0.35 0.05 155)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* partículas suaves */}
        {s >= 3 &&
          [
            [70, 120],
            [168, 110],
            [92, 132],
            [150, 136],
            [186, 126],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 2 ? 1.6 : 1.1}
              fill="oklch(0.86 0.16 130)"
              className="animate-eco-rise"
              style={{ animationDelay: `${i * 1.3}s` }}
            />
          ))}
      </svg>
    </div>
  );
}

function canopyBlobs(s: number) {
  if (s === 2)
    return [
      { cx: 120, cy: 104, rx: 20, ry: 16, o: 1 },
      { cx: 106, cy: 112, rx: 13, ry: 10, o: 0.9 },
      { cx: 134, cy: 112, rx: 13, ry: 10, o: 0.9 },
    ];
  if (s === 3)
    return [
      { cx: 120, cy: 82, rx: 28, ry: 22, o: 1 },
      { cx: 98, cy: 96, rx: 18, ry: 14, o: 0.92 },
      { cx: 143, cy: 94, rx: 19, ry: 15, o: 0.92 },
      { cx: 120, cy: 66, rx: 17, ry: 13, o: 0.85 },
    ];
  if (s === 4)
    return [
      { cx: 120, cy: 72, rx: 36, ry: 27, o: 1 },
      { cx: 90, cy: 88, rx: 22, ry: 17, o: 0.94 },
      { cx: 152, cy: 86, rx: 23, ry: 18, o: 0.94 },
      { cx: 120, cy: 50, rx: 24, ry: 18, o: 0.9 },
      { cx: 100, cy: 60, rx: 16, ry: 13, o: 0.82 },
      { cx: 142, cy: 58, rx: 16, ry: 13, o: 0.82 },
    ];
  return [
    { cx: 120, cy: 68, rx: 44, ry: 32, o: 1 },
    { cx: 82, cy: 84, rx: 26, ry: 20, o: 0.95 },
    { cx: 160, cy: 82, rx: 27, ry: 21, o: 0.95 },
    { cx: 120, cy: 40, rx: 30, ry: 22, o: 0.92 },
    { cx: 94, cy: 52, rx: 20, ry: 16, o: 0.86 },
    { cx: 148, cy: 50, rx: 20, ry: 16, o: 0.86 },
    { cx: 120, cy: 96, rx: 30, ry: 16, o: 0.8 },
  ];
}
