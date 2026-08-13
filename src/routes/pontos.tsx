import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Flame, Gift, Leaf, Target, Trophy } from "lucide-react";
import { AppShell, DemoNote, PageHeader } from "@/components/eco/AppShell";
import { LEVELS, WEEKLY_CHALLENGE, useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pontos")({
  head: () => ({
    meta: [
      { title: "M Points, níveis e desafios | EcoVida AI" },
      {
        name: "description",
        content: "Acompanhe seus M Points, níveis, conquistas e o desafio da semana no EcoVida AI.",
      },
      { property: "og:title", content: "M Points e desafios | EcoVida AI" },
      { property: "og:description", content: "Recompensas virtuais por escolhas conscientes e engajamento." },
    ],
  }),
  component: PontosPage,
});

const achievements = [
  { icon: Leaf, label: "Primeira compra verificada", need: 1 },
  { icon: Trophy, label: "3 compras verificadas", need: 3 },
  { icon: Award, label: "5 compras verificadas", need: 5 },
];

function PontosPage() {
  const { points, purchases, level, totalAligned, challengeProgress } = useEco();
  const pct = (challengeProgress / WEEKLY_CHALLENGE.goal) * 100;

  return (
    <AppShell>
      <PageHeader eyebrow="Pontos" title="Seus M Points" subtitle="Recompensas virtuais por escolhas conscientes — sem incentivar restrição alimentar." />

      <div className="px-5 pb-14 pt-5 md:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-eco-gradient p-6 text-leaf-foreground shadow-lift">
          <span className="absolute -right-12 -top-12 size-44 rounded-full bg-white/15 blur-2xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-leaf-foreground/80">M Points</p>
          <p className="relative font-display text-5xl font-semibold">{points}</p>
          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${level.progress}%` }} />
          </div>
          <p className="relative mt-2 text-xs text-leaf-foreground/85">
            {level.emoji} Nível {level.name}
            {level.next ? ` · próximo: ${level.next}` : " · nível máximo"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {[
            { label: "Escolhas EcoVida", value: totalAligned, icon: Leaf },
            { label: "Notas verificadas", value: purchases.length, icon: Trophy },
            { label: "Sequência", value: purchases.length ? `${Math.min(purchases.length, 7)}×` : "—", icon: Flame },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft">
              <Icon className="size-4 text-leaf" />
              <p className="mt-2 font-display text-xl font-semibold text-primary">{value}</p>
              <p className="text-[11px] leading-snug text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Target className="size-4 text-leaf" /> Desafio da semana
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{WEEKLY_CHALLENGE.title}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-eco-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {challengeProgress}/{WEEKLY_CHALLENGE.goal} concluídas · recompensa +{WEEKLY_CHALLENGE.reward} M Points
          </p>
        </section>

        <h2 className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Níveis</h2>
        <div className="mt-2.5 flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LEVELS.map((l, i) => (
            <div
              key={l.name}
              className={cn(
                "w-32 shrink-0 rounded-3xl border p-3.5",
                i === level.index ? "border-leaf bg-leaf/10" : "border-border/70 bg-card",
              )}
            >
              <span className="text-2xl">{l.emoji}</span>
              <p className="mt-1.5 text-sm font-semibold">{l.name}</p>
              <p className="text-[11px] text-muted-foreground">{l.min}+ M Points</p>
            </div>
          ))}
        </div>

        <h2 className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Conquistas</h2>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          {achievements.map(({ icon: Icon, label, need }) => {
            const unlocked = purchases.length >= need;
            return (
              <div
                key={label}
                className={cn(
                  "rounded-3xl border p-3.5",
                  unlocked ? "border-leaf bg-leaf/10" : "border-border/70 bg-card opacity-70",
                )}
              >
                <span className={cn("grid size-9 place-items-center rounded-2xl", unlocked ? "bg-eco-gradient text-leaf-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="size-4.5" />
                </span>
                <p className="mt-2 text-[11px] font-semibold leading-snug">{label}</p>
              </div>
            );
          })}
        </div>

        <h2 className="mt-7 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Gift className="size-4" /> Recompensas
        </h2>
        <div className="mt-2.5 rounded-3xl border border-dashed border-border bg-surface-gradient p-5">
          <p className="text-sm font-semibold">Em construção — demonstração</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A visão do EcoVida AI é que os M Points possam, no futuro, virar benefícios oferecidos por
            parceiros. Nesta versão não há parceiros nem benefícios reais.
          </p>
          <Link to="/lista" className="mt-3 inline-flex rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
            Ganhar mais pontos
          </Link>
        </div>

        <DemoNote>Pontos e desafios são demonstrativos e ficam salvos apenas no seu navegador.</DemoNote>
      </div>
    </AppShell>
  );
}
