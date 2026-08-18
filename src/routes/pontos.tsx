import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Leaf, Sparkles, Target, Trophy } from "lucide-react";
import { AppShell, DemoNote } from "@/components/eco/AppShell";
import { EcoTree } from "@/components/eco/EcoTree";
import { TREE_STAGES, treeStateFor } from "@/lib/eco-tree";
import { WEEKLY_CHALLENGE, useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pontos")({
  head: () => ({
    meta: [
      { title: "Meu impacto — Árvore EcoVida | EcoVida AI" },
      {
        name: "description",
        content:
          "Veja sua Árvore EcoVida crescer a cada escolha consciente confirmada, com M Points, conquistas e histórico de evolução.",
      },
      { property: "og:title", content: "Meu impacto — Árvore EcoVida" },
      { property: "og:description", content: "Uma árvore que evolui com suas escolhas conscientes no EcoVida AI." },
    ],
  }),
  component: ImpactoPage,
});

const achievements = [
  { icon: Leaf, label: "Primeira escolha confirmada", need: 1 },
  { icon: Sparkles, label: "Muda formada", need: 3 },
  { icon: Trophy, label: "Copa cheia", need: 6 },
  { icon: Award, label: "Ecossistema vivo", need: 18 },
];

function ImpactoPage() {
  const { points, purchases, totalAligned, challengeProgress, games } = useEco();
  const tree = treeStateFor(totalAligned);
  const pct = (challengeProgress / WEEKLY_CHALLENGE.goal) * 100;

  return (
    <AppShell>
      <div className="px-5 pb-16 pt-7 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Meu impacto</p>
        <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-tight md:text-4xl">
          Sua Árvore EcoVida
        </h1>

        <div className="mt-5">
          <EcoTree stage={tree.index} className="shadow-lift" />
        </div>

        <div className="-mt-8 relative mx-auto w-[92%] rounded-3xl border border-border/60 bg-card/95 p-4 shadow-lift backdrop-blur">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-xl font-semibold">
              {tree.stage.emoji} {tree.stage.name}
            </p>
            <p className="font-display text-lg font-semibold text-primary">{points} M</p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tree.stage.blurb}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-eco-gradient transition-all duration-1000 ease-out"
              style={{ width: `${tree.progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {tree.next
              ? `Faltam ${tree.remaining} escolha${tree.remaining === 1 ? "" : "s"} EcoVida para virar ${tree.next.name}.`
              : "Estágio máximo — sua árvore continua viva e em movimento."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <span className="inline-flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-semibold text-primary">{totalAligned}</span>
            <span className="text-xs text-muted-foreground">escolhas EcoVida confirmadas</span>
          </span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-semibold text-primary">{purchases.length}</span>
            <span className="text-xs text-muted-foreground">notas verificadas</span>
          </span>
        </div>

        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Target className="size-4 text-leaf" /> Desafio da semana
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{WEEKLY_CHALLENGE.title}</p>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-eco-gradient transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {challengeProgress}/{WEEKLY_CHALLENGE.goal} concluídas · +{WEEKLY_CHALLENGE.reward} M Points
          </p>
        </section>

        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-leaf" /> Jogos de reciclagem
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {[
              { label: "Separação", value: `${games.sortBest}/10` },
              { label: "Mito ou verdade", value: `${games.quizBest}/8` },
              { label: "Rodadas", value: String(games.plays) },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl bg-muted/50 px-3 py-3 text-center">
                <p className="font-display text-lg font-semibold text-primary">{c.value}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
          <Link
            to="/jogos"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground"
          >
            Treinar a separação do lixo
          </Link>
        </section>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Caminho da árvore
        </h2>
        <ol className="mt-3 space-y-0">
          {TREE_STAGES.map((st, i) => {
            const done = i <= tree.index;
            return (
              <li key={st.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full text-base transition-colors",
                      i === tree.index
                        ? "bg-eco-gradient text-leaf-foreground shadow-glow"
                        : done
                          ? "bg-leaf/15 text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {st.emoji}
                  </span>
                  {i < TREE_STAGES.length - 1 && (
                    <span className={cn("w-0.5 flex-1", done ? "bg-leaf/40" : "bg-border")} />
                  )}
                </div>
                <div className="pb-5">
                  <p className={cn("text-sm font-semibold", !done && "text-muted-foreground")}>{st.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {st.min === 0 ? "início" : `${st.min}+ escolhas EcoVida`}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <h2 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Conquistas
        </h2>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {achievements.map(({ icon: Icon, label, need }) => {
            const unlocked = totalAligned >= need;
            return (
              <div
                key={label}
                className={cn(
                  "rounded-3xl border p-3.5 transition-colors",
                  unlocked ? "border-leaf/60 bg-leaf/10" : "border-border/70 bg-card opacity-70",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-2xl",
                    unlocked ? "bg-eco-gradient text-leaf-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4.5" />
                </span>
                <p className="mt-2 text-[11px] font-semibold leading-snug">{label}</p>
              </div>
            );
          })}
        </div>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Histórico de evolução
        </h2>
        {purchases.length === 0 ? (
          <div className="mt-3 rounded-3xl border border-dashed border-border bg-surface-gradient p-5">
            <p className="text-sm font-semibold">Sua árvore está esperando a primeira compra</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Verifique uma compra para ver as primeiras folhas aparecerem.
            </p>
            <Link
              to="/lista"
              className="mt-3 inline-flex rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
            >
              Criar minha lista
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {purchases.map((p) => {
              const aligned = p.items.filter((i) => i.aligned && i.bought).length;
              return (
                <li key={p.id} className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-leaf/15 text-primary">
                    <Leaf className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {aligned} escolha{aligned === 1 ? "" : "s"} EcoVida
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} ·{" "}
                      {p.items.length} produtos
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-primary">+{p.points} M</span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8 rounded-3xl border border-dashed border-border bg-surface-gradient p-5">
          <p className="text-sm font-semibold">Recompensas — em construção</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A visão do EcoVida AI é que os M Points possam, no futuro, virar benefícios de parceiros. Nesta
            versão não há parceiros nem benefícios reais.
          </p>
        </div>

        <DemoNote>
          A Árvore EcoVida é uma representação visual do seu progresso no aplicativo — não representa
          compensação real de CO₂, água ou impacto ambiental. Pontos e estágios ficam salvos apenas no seu
          navegador e a árvore nunca regride.
        </DemoNote>
      </div>
    </AppShell>
  );
}
