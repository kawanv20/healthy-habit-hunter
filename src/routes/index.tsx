import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Plus, Recycle, ShoppingCart, Sparkles, Target } from "lucide-react";
import { AppShell } from "@/components/eco/AppShell";
import { EcoTree } from "@/components/eco/EcoTree";
import { treeStateFor } from "@/lib/eco-tree";
import { quickSuggestions } from "@/lib/ecovida-ai";
import { WEEKLY_CHALLENGE, useEco } from "@/lib/ecovida-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoVida AI — Sua lista de compras inteligente" },
      {
        name: "description",
        content:
          "Escreva sua lista, a EcoVida AI organiza, compara marcas e recomenda produtos com melhor equilíbrio entre saúde e sustentabilidade.",
      },
      { property: "og:title", content: "EcoVida AI — Sua lista de compras inteligente" },
      {
        property: "og:description",
        content: "Planeje, receba recomendações, compre no Modo Mercado e ganhe M Points.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { points, items, analyzed, level, totalAligned, challengeProgress, addItem } = useEco();
  const tree = treeStateFor(totalAligned);


  return (
    <AppShell>
      <header className="flex items-center justify-between gap-3 px-5 pt-6 md:px-8 md:pt-9">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-eco-gradient text-leaf-foreground shadow-glow">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">EcoVida AI</span>
        </div>
        <Link
          to="/pontos"
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
        >
          {level.emoji} {points} M
        </Link>
      </header>

      <section className="px-5 pt-6 md:px-8">
        <h1 className="text-balance-tight font-display text-[1.75rem] font-semibold leading-tight md:text-4xl">
          O que vamos comprar hoje?
        </h1>
        <Link
          to="/lista"
          className="mt-4 flex items-center gap-3 rounded-3xl bg-eco-gradient p-4 text-leaf-foreground shadow-glow transition-transform active:scale-[0.98]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/20">
            <Plus className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Criar nova lista</span>
            <span className="block text-xs text-leaf-foreground/85">Escreva livremente, a IA organiza</span>
          </span>
          <ArrowRight className="size-5 shrink-0" />
        </Link>

        {items.length > 0 && (
          <div className="mt-3 rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">Continuar compra</p>
            <p className="mt-1.5 truncate text-sm font-semibold">
              Minha lista · {items.length} {items.length === 1 ? "item" : "itens"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{items.map((i) => i.raw).join(" · ")}</p>
            <div className="mt-3 flex gap-2">
              <Link
                to={analyzed ? "/minha-lista" : "/recomendacoes"}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                {analyzed ? "Ver Lista EcoVida" : (<><Sparkles className="size-4" /> Analisar</>)}
              </Link>
              {analyzed && (
                <Link
                  to="/mercado"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground"
                >
                  <ShoppingCart className="size-4" /> Mercado
                </Link>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 px-5 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
          Seu impacto está crescendo
        </p>
        <Link to="/pontos" className="mt-2.5 block">
          <EcoTree stage={tree.index} aspect="16 / 9" className="shadow-soft" />
          <div className="-mt-6 relative mx-auto w-[92%] rounded-3xl border border-border/60 bg-card/95 p-4 shadow-lift backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-lg font-semibold">
                {tree.stage.emoji} {tree.stage.name}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-leaf">
                Ver minha árvore <ArrowRight className="size-3.5" />
              </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-eco-gradient transition-all duration-1000 ease-out"
                style={{ width: `${tree.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {tree.next
                ? `Faltam ${tree.remaining} escolha${tree.remaining === 1 ? "" : "s"} EcoVida para sua próxima evolução.`
                : "Estágio máximo alcançado — sua árvore segue viva."}
            </p>
          </div>
        </Link>
      </section>

      <section className="mt-4 px-5 md:px-8">
        <Link to="/pontos" className="flex items-center gap-3 rounded-3xl bg-surface-gradient p-4 ring-1 ring-border/60">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-leaf/15 text-primary">
            <Target className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Desafio da semana</span>
            <span className="block text-xs text-muted-foreground">
              {challengeProgress}/{WEEKLY_CHALLENGE.goal} escolhas EcoVida · +{WEEKLY_CHALLENGE.reward} M Points
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </section>

      <section className="mt-3 px-5 md:px-8">
        <Link
          to="/jogos"
          className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-4 shadow-soft transition-transform active:scale-[0.99]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-leaf/15 text-leaf">
            <Recycle className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Jogos de reciclagem</span>
            <span className="block text-xs text-muted-foreground">
              Separe o reciclável, teste mitos e ganhe M Points
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </section>

      <section className="mt-6 px-5 pb-6 md:px-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Adicionar rápido
        </h2>
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {quickSuggestions.slice(0, 10).map((s) => (
            <button
              key={s.label}
              onClick={() => addItem(s.label)}
              className="flex shrink-0 flex-col items-center gap-1.5 rounded-3xl border border-border/70 bg-card px-4 py-3 shadow-soft transition-transform active:scale-95"
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-xs font-medium">{s.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Catálogo de demonstração: marcas e avaliações são ilustrativas, sem preços nem métricas
          ambientais estimadas.
        </p>
      </section>
    </AppShell>
  );
}
