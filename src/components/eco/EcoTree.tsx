import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Árvore EcoVida — cena SVG animada com 6 níveis de exuberância.
 * A árvore já começa formada e bonita; os níveis adicionam copa, flores,
 * frutos, vegetação e vida ao redor. Puramente visual: representa o
 * progresso do usuário no app, nunca compensação ambiental real.
 */
export function EcoTree({
  stage,
  className,
  glow = false,
  celebrate = false,
  aspect = "4 / 3",
}: {
  /** 0 = árvore jovem … 5 = ecossistema */
  stage: number;
  className?: string;
  /** brilho sutil ao ganhar pontos */
  glow?: boolean;
  /** animação de crescimento ao evoluir de estágio */
  celebrate?: boolean;
  /** proporção da cena, ex. "16 / 9" para a versão compacta */
  aspect?: string;
}) {
  const s = Math.max(0, Math.min(5, Math.round(stage)));
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      style={{ aspectRatio: aspect }}
      className={cn(
        "relative w-full overflow-hidden rounded-4xl",
        "bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.98_0.03_210)_0%,oklch(0.96_0.05_160)_45%,oklch(0.93_0.07_142)_100%)]",
        "dark:bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.29_0.05_230)_0%,oklch(0.24_0.05_165)_50%,oklch(0.2_0.04_150)_100%)]",
        className,
      )}
    >
      {/* luz ambiente */}
      <span
        className={cn(
          "pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-sun/30 blur-3xl transition-opacity duration-1000",
          s >= 2 ? "opacity-100" : "opacity-70",
        )}
      />
      <span className="pointer-events-none absolute -bottom-16 -left-12 size-48 rounded-full bg-leaf/20 blur-3xl" />
      {glow && (
        <span className="pointer-events-none absolute inset-0 animate-eco-glow bg-[radial-gradient(60%_50%_at_50%_65%,oklch(0.85_0.2_140/0.5),transparent_70%)]" />
      )}

      <svg
        viewBox="0 0 240 180"
        className={cn(
          "relative size-full transition-[opacity,transform] duration-700 ease-out",
          mounted ? "scale-100 opacity-100" : "scale-[0.97] opacity-0",
          celebrate && "animate-eco-grow",
        )}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="eco-canopy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.84 0.19 140)" />
            <stop offset="55%" stopColor="oklch(0.7 0.18 145)" />
            <stop offset="100%" stopColor="oklch(0.47 0.12 158)" />
          </linearGradient>
          <linearGradient id="eco-canopy-deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.15 152)" />
            <stop offset="100%" stopColor="oklch(0.4 0.1 160)" />
          </linearGradient>
          <linearGradient id="eco-trunk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.54 0.07 62)" />
            <stop offset="55%" stopColor="oklch(0.41 0.06 55)" />
            <stop offset="100%" stopColor="oklch(0.3 0.05 48)" />
          </linearGradient>
          <linearGradient id="eco-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.14 145)" />
            <stop offset="45%" stopColor="oklch(0.58 0.1 130)" />
            <stop offset="100%" stopColor="oklch(0.4 0.07 85)" />
          </linearGradient>
          <radialGradient id="eco-sunlight" cx="0.8" cy="0.1" r="0.8">
            <stop offset="0%" stopColor="oklch(0.95 0.14 95)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.95 0.14 95)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="240" height="180" fill="url(#eco-sunlight)" />

        {/* colinas ao fundo — sempre presentes */}
        <g>
          <path d="M-10 152 Q 50 112 112 152 Z" fill="oklch(0.82 0.08 158)" opacity="0.5" />
          <path d="M110 152 Q 180 104 262 152 Z" fill="oklch(0.86 0.07 150)" opacity="0.45" />
        </g>

        {/* árvores distantes a partir de Bosque */}
        {s >= 4 && (
          <g className="animate-eco-in" opacity="0.55">
            {[26, 46, 200, 220].map((x, i) => (
              <g key={x}>
                <path d={`M${x} 150 l 0 -14`} stroke="oklch(0.45 0.07 60)" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx={x} cy={140 - i} rx="11" ry="13" fill="url(#eco-canopy-deep)" />
              </g>
            ))}
          </g>
        )}

        {/* terra e grama */}
        <path d="M14 152 Q 120 130 226 152 L 238 180 L 2 180 Z" fill="url(#eco-soil)" />
        <ellipse cx="120" cy="150" rx="78" ry="11" fill="oklch(0.74 0.15 145)" opacity="0.85" />
        <g className="origin-bottom animate-eco-sway" style={{ animationDuration: "7.5s" }}>
          {[58, 74, 90, 152, 168, 184].map((x, i) => (
            <path
              key={x}
              d={`M${x} 154 q ${i % 2 ? 5 : -5} -9 ${i % 2 ? 2 : -2} -15`}
              stroke="oklch(0.62 0.15 148)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}
        </g>

        {/* vegetação ao redor (Bosque / Ecossistema) */}
        {s >= 4 && (
          <g className="animate-eco-in">
            {[36, 54, 186, 204].map((x, i) => (
              <g key={x} className="origin-bottom animate-eco-sway" style={{ animationDelay: `${i * 0.4}s` }}>
                <path d={`M${x} 152 q -6 -14 -1 -22`} stroke="oklch(0.6 0.14 150)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d={`M${x} 152 q 7 -12 2 -20`} stroke="oklch(0.68 0.15 145)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            ))}
            {/* arbustos floridos */}
            {[
              [64, 148],
              [176, 147],
            ].map(([x, y], i) => (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="11" ry="7" fill="url(#eco-canopy-deep)" opacity="0.9" />
                <circle cx={x! - 4} cy={y! - 3} r="1.8" fill="oklch(0.86 0.14 30)" />
                <circle cx={x! + 4} cy={y! - 4} r="1.8" fill="oklch(0.9 0.14 90)" />
              </g>
            ))}
          </g>
        )}

        {/* pequenos animais (Ecossistema) */}
        {s >= 5 && (
          <g className="animate-eco-hop">
            <ellipse cx="196" cy="148" rx="6" ry="4" fill="oklch(0.55 0.08 60)" />
            <circle cx="202" cy="145" r="3" fill="oklch(0.55 0.08 60)" />
            <path d="M190 147 q -5 -3 -2 -7" stroke="oklch(0.55 0.08 60)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* sombra da árvore */}
        <ellipse cx="120" cy="152" rx={26 + s * 4} ry={5 + s} fill="oklch(0.3 0.05 150)" opacity="0.14" />

        {/* árvore principal — já formada em todos os níveis */}
        <g className="origin-bottom animate-eco-sway" style={{ animationDuration: s >= 3 ? "5.5s" : "6.5s" }}>
          {/* raízes */}
          <path d={`M${112 - s} 151 q -8 -2 -12 1`} stroke="url(#eco-trunk)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={`M${128 + s} 151 q 8 -2 12 1`} stroke="url(#eco-trunk)" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* tronco */}
          <path d={trunkPath(s)} fill="url(#eco-trunk)" />

          {/* galhos */}
          <g stroke="url(#eco-trunk)" strokeWidth={3 + s * 0.4} fill="none" strokeLinecap="round">
            <path d={`M118 ${104 - s * 3} q -${16 + s * 2} -5 -${24 + s * 2} -${16 + s}`} />
            <path d={`M121 ${96 - s * 3} q ${18 + s * 2} -5 ${26 + s * 2} -${18 + s}`} />
            {s >= 2 && <path d={`M120 ${86 - s * 2} q -10 -12 -8 -22`} />}
          </g>

          {/* copa */}
          <g className="animate-eco-breathe origin-bottom">
            {canopyBlobs(s).map((b, i) => (
              <ellipse
                key={i}
                cx={b.cx}
                cy={b.cy}
                rx={b.rx}
                ry={b.ry}
                fill={b.deep ? "url(#eco-canopy-deep)" : "url(#eco-canopy)"}
                opacity={b.o}
                className="animate-eco-leaf"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </g>

          {/* flores */}
          {s >= 2 && (
            <g className="animate-eco-in">
              {[
                [100, 76],
                [138, 66],
                [122, 54],
                [110, 90],
                [146, 84],
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={(y ?? 0) - s * 2}
                  r="2.8"
                  fill={i % 2 ? "oklch(0.92 0.1 340)" : "oklch(0.93 0.12 95)"}
                  className="animate-eco-pulse"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
              ))}
            </g>
          )}

          {/* frutos */}
          {s >= 3 && (
            <g className="animate-eco-in">
              {[
                [106, 88],
                [134, 80],
                [124, 96],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={(y ?? 0) - s} r="3.2" fill="oklch(0.7 0.18 28)" opacity="0.95" />
              ))}
            </g>
          )}
        </g>

        {/* borboletas */}
        {s >= 1 && (
          <g className="animate-eco-flit">
            <path d="M62 62 q 6 -8 10 0 q -6 6 -10 0" fill="oklch(0.68 0.16 25)" opacity="0.85" />
            <path d="M72 62 q 6 -8 10 0 q -6 6 -10 0" fill="oklch(0.86 0.14 85)" opacity="0.8" />
          </g>
        )}
        {/* pássaros */}
        {s >= 3 && (
          <g className="animate-eco-flit" style={{ animationDelay: "2s", animationDuration: "16s" }}>
            <path d="M170 40 q 7 -6 13 0" stroke="oklch(0.35 0.05 155)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M183 40 q 7 -6 13 0" stroke="oklch(0.35 0.05 155)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* partículas suaves */}
        {[
          [70, 122],
          [168, 112],
          [92, 134],
          [150, 138],
          [186, 128],
          [56, 108],
        ]
          .slice(0, 3 + s)
          .map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 2 ? 1.6 : 1.1}
              fill="oklch(0.9 0.16 130)"
              className="animate-eco-rise"
              style={{ animationDelay: `${i * 1.2}s` }}
            />
          ))}
      </svg>
    </div>
  );
}

function trunkPath(s: number) {
  if (s <= 1) return "M112 151 q 4 -34 6 -54 l 6 0 q 4 20 8 54 z";
  if (s <= 3) return "M109 151 q 6 -44 8 -66 l 7 0 q 4 24 11 66 z";
  return "M106 151 q 7 -52 9 -78 l 9 0 q 4 28 13 78 z";
}

function canopyBlobs(s: number): { cx: number; cy: number; rx: number; ry: number; o: number; deep?: boolean }[] {
  if (s === 0)
    return [
      { cx: 120, cy: 90, rx: 30, ry: 23, o: 1 },
      { cx: 98, cy: 100, rx: 19, ry: 15, o: 0.95, deep: true },
      { cx: 143, cy: 98, rx: 20, ry: 16, o: 0.95 },
      { cx: 120, cy: 74, rx: 19, ry: 15, o: 0.9 },
    ];
  if (s === 1)
    return [
      { cx: 120, cy: 82, rx: 34, ry: 26, o: 1 },
      { cx: 94, cy: 94, rx: 21, ry: 17, o: 0.95, deep: true },
      { cx: 148, cy: 92, rx: 22, ry: 18, o: 0.95 },
      { cx: 120, cy: 62, rx: 22, ry: 17, o: 0.92 },
      { cx: 102, cy: 72, rx: 15, ry: 12, o: 0.85 },
    ];
  if (s === 2)
    return [
      { cx: 120, cy: 76, rx: 38, ry: 28, o: 1 },
      { cx: 90, cy: 90, rx: 23, ry: 18, o: 0.95, deep: true },
      { cx: 152, cy: 88, rx: 24, ry: 19, o: 0.95 },
      { cx: 120, cy: 54, rx: 25, ry: 19, o: 0.92 },
      { cx: 99, cy: 64, rx: 17, ry: 14, o: 0.86 },
      { cx: 143, cy: 62, rx: 17, ry: 14, o: 0.86 },
    ];
  if (s === 3)
    return [
      { cx: 120, cy: 72, rx: 42, ry: 31, o: 1 },
      { cx: 86, cy: 86, rx: 25, ry: 20, o: 0.95, deep: true },
      { cx: 156, cy: 84, rx: 26, ry: 21, o: 0.95 },
      { cx: 120, cy: 48, rx: 28, ry: 21, o: 0.92 },
      { cx: 96, cy: 58, rx: 19, ry: 15, o: 0.86 },
      { cx: 146, cy: 56, rx: 19, ry: 15, o: 0.86 },
      { cx: 120, cy: 98, rx: 30, ry: 15, o: 0.8, deep: true },
    ];
  if (s === 4)
    return [
      { cx: 120, cy: 68, rx: 46, ry: 33, o: 1 },
      { cx: 82, cy: 84, rx: 27, ry: 21, o: 0.95, deep: true },
      { cx: 160, cy: 82, rx: 28, ry: 22, o: 0.95 },
      { cx: 120, cy: 42, rx: 31, ry: 23, o: 0.93 },
      { cx: 92, cy: 54, rx: 21, ry: 17, o: 0.87 },
      { cx: 150, cy: 52, rx: 21, ry: 17, o: 0.87 },
      { cx: 120, cy: 100, rx: 33, ry: 16, o: 0.82, deep: true },
    ];
  return [
    { cx: 120, cy: 64, rx: 50, ry: 36, o: 1 },
    { cx: 76, cy: 82, rx: 29, ry: 23, o: 0.96, deep: true },
    { cx: 166, cy: 80, rx: 30, ry: 24, o: 0.96 },
    { cx: 120, cy: 36, rx: 34, ry: 25, o: 0.94 },
    { cx: 88, cy: 48, rx: 23, ry: 18, o: 0.88 },
    { cx: 154, cy: 46, rx: 23, ry: 18, o: 0.88 },
    { cx: 120, cy: 102, rx: 36, ry: 17, o: 0.84, deep: true },
    { cx: 104, cy: 24, rx: 16, ry: 12, o: 0.8 },
    { cx: 138, cy: 26, rx: 16, ry: 12, o: 0.8 },
  ];
}
