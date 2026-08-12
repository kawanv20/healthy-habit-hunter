import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ListPlus, ReceiptText, Sparkles, Trophy, Leaf } from "lucide-react";
import { AppShell } from "@/components/eco/AppShell";
import { categories } from "@/lib/ecovida-data";
import { useEco } from "@/lib/ecovida-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoVida AI — Escolhas melhores no supermercado" },
      {
        name: "description",
        content:
          "Diga o que você precisa comprar e o EcoVida AI recomenda marcas com melhor equilíbrio entre saúde e sustentabilidade.",
      },
      { property: "og:title", content: "EcoVida AI — Escolhas melhores no supermercado" },
      {
        property: "og:description",
        content: "Monte sua lista, receba recomendações de marcas, comprove a compra e ganhe M Points.",
      },
    ],
  }),
  component: Home,
});

const cycle = [
  { icon: ListPlus, title: "Planeje", text: "Monte a lista do que precisa comprar." },
  { icon: Sparkles, title: "Receba escolhas", text: "Marcas melhores em cada categoria." },
  { icon: ReceiptText, title: "Comprove", text: "Confirme a compra pela nota fiscal." },
  { icon: Trophy, title: "Evolua", text: "Ganhe M Points e suba de nível." },
];

function Home() {
  const { points, list, purchases, level } = useEco();

  return (
    <AppShell>
      <section className="px-5 pt-8 md:px-8 md:pt-12">
        <div className="relative overflow-hidden rounded-4xl bg-eco-gradient p-6 text-leaf-foreground shadow-lift md:p-9">
          <span className="absolute -right-16 -top-16 size-56 rounded-full bg-white/15 blur-2xl" />
          <span className="absolute -bottom-20 -left-10 size-52 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Leaf className="size-3.5" /> EcoVida AI
            </span>
            <h1 className="mt-4 max-w-[18ch] text-balance-tight text-[2rem] font-semibold leading-[1.1] md:text-5xl">
              Diga o que precisa comprar. A gente ajuda a escolher.
            </h1>
            <p className="mt-3 max-w-prose text-sm text-leaf-foreground/85 md:text-base">
              Em cada categoria existem dezenas de marcas. O EcoVida compara alternativas e mostra
              qual tem melhor equilíbrio entre saúde e sustentabilidade.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/lista"
                className="inline-flex items-center gap-2 rounded-2xl bg-card px-5 py-3.5 text-sm font-semibold text-primary shadow-soft transition-transform active:scale-[0.98]"
              >
                {list.length > 0 ? "Continuar minha lista" : "Criar minha lista"}
                <ArrowRight className="size-4" />
              </Link>
              {list.length > 0 && (
                <Link
                  to="/recomendacoes"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25"
                >
                  Ver recomendações
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 px-5 md:px-8">
        <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
          <p className="text-xs font-medium text-muted-foreground">M Points</p>
          <p className="font-display text-2xl font-semibold text-primary">{points}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-eco-gradient transition-all duration-700"
              style={{ width: `${level.progress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Nível {level.name}
            {level.next ? ` · próximo: ${level.next}` : ""}
          </p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
          <p className="text-xs font-medium text-muted-foreground">Compras verificadas</p>
          <p className="font-display text-2xl font-semibold text-primary">{purchases.length}</p>
          <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
            Confirme pela nota fiscal para ganhar pontos por escolha alinhada.
          </p>
        </div>
      </section>

      <section className="mt-8 px-5 md:px-8">
        <h2 className="text-lg font-semibold">Como funciona</h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cycle.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="rounded-3xl bg-surface-gradient p-4 ring-1 ring-border/60">
              <span className="grid size-9 place-items-center rounded-2xl bg-leaf/15 text-primary">
                <Icon className="size-4.5" />
              </span>
              <p className="mt-3 text-sm font-semibold">
                {i + 1}. {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 px-5 pb-4 md:px-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">Comece rápido</h2>
          <Link to="/lista" className="text-xs font-semibold text-leaf">
            ver tudo
          </Link>
        </div>
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.id}
              to="/lista"
              className="flex shrink-0 flex-col items-center gap-1.5 rounded-3xl border border-border/70 bg-card px-4 py-3 shadow-soft transition-transform active:scale-95"
            >
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-xs font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          Protótipo com marcas e avaliações de demonstração. As comparações são qualitativas e não
          substituem a leitura do rótulo.
        </p>
      </section>
    </AppShell>
  );
}
