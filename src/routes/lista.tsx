import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/eco/AppShell";
import { categories } from "@/lib/ecovida-data";
import { useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lista")({
  head: () => ({
    meta: [
      { title: "Minha lista de compras | EcoVida AI" },
      {
        name: "description",
        content: "Selecione o que você precisa comprar e receba recomendações de marcas melhores.",
      },
      { property: "og:title", content: "Minha lista de compras | EcoVida AI" },
      { property: "og:description", content: "Monte sua lista em segundos e peça recomendações." },
    ],
  }),
  component: ListaPage,
});

const groups = ["Básicos", "Bebidas", "Laticínios", "Snacks"] as const;

function ListaPage() {
  const { list, toggleCategory, clearList } = useEco();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((c) => (q ? c.label.toLowerCase().includes(q) : true));
  }, [query]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Passo 1"
        title="O que você precisa comprar?"
        subtitle="Toque nos itens da sua lista. Depois o EcoVida compara as marcas de cada categoria."
      />

      <div className="sticky top-0 z-30 mt-5 bg-background/90 px-5 py-3 backdrop-blur md:px-8">
        <label className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:ring-2 focus-within:ring-ring/50">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: arroz, molho de tomate, iogurte…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <div className="space-y-7 px-5 pb-40 md:px-8">
        {groups.map((g) => {
          const items = filtered.filter((c) => c.group === g);
          if (!items.length) return null;
          return (
            <section key={g}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {g}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((c) => {
                  const active = list.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCategory(c.id)}
                      aria-pressed={active}
                      className={cn(
                        "relative flex items-center gap-3 rounded-3xl border p-4 text-left transition-all duration-200 active:scale-[0.97]",
                        active
                          ? "border-leaf bg-leaf/10 shadow-soft"
                          : "border-border/70 bg-card shadow-soft hover:border-leaf/50",
                      )}
                    >
                      <span className="text-2xl">{c.emoji}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{c.label}</span>
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full border transition-all",
                          active ? "border-leaf bg-leaf text-leaf-foreground" : "border-border",
                        )}
                      >
                        {active && <Check className="size-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {!filtered.length && (
          <p className="rounded-3xl bg-muted p-6 text-center text-sm text-muted-foreground">
            Ainda não temos essa categoria na demonstração. Tente “arroz”, “café” ou “iogurte”.
          </p>
        )}
      </div>

      {/* Barra de ação */}
      <div className="fixed inset-x-0 bottom-[68px] z-40 px-4 md:bottom-6 md:left-56">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-3xl border border-border/70 bg-card/95 p-3 shadow-lift backdrop-blur md:max-w-xl">
          <div className="min-w-0 flex-1 pl-1">
            <p className="truncate text-sm font-semibold">
              {list.length === 0 ? "Nenhum item ainda" : `${list.length} itens na lista`}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {list.length === 0
                ? "Selecione o que precisa comprar"
                : list.map((id) => categories.find((c) => c.id === id)?.label).join(" · ")}
            </p>
          </div>
          {list.length > 0 && (
            <button
              onClick={clearList}
              aria-label="Limpar lista"
              className="grid size-10 shrink-0 place-items-center rounded-2xl text-muted-foreground transition-colors hover:bg-muted"
            >
              <Trash2 className="size-4.5" />
            </button>
          )}
          <Link
            to="/recomendacoes"
            disabled={list.length === 0}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]",
              list.length === 0
                ? "pointer-events-none bg-muted text-muted-foreground"
                : "bg-eco-gradient text-leaf-foreground shadow-glow",
            )}
          >
            Encontrar melhores escolhas
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
