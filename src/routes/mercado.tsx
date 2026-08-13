import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CircleSlash, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ActionBar, AppShell, PageHeader } from "@/components/eco/AppShell";
import { PackShot } from "@/components/eco/ProductCard";
import { AISLE_EMOJI, AISLE_ORDER, aisleOf, rankProducts } from "@/lib/ecovida-ai";
import { itemProduct, useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mercado")({
  head: () => ({
    meta: [
      { title: "Modo Mercado | EcoVida AI" },
      {
        name: "description",
        content: "Lista prática para usar dentro do supermercado: marque o que já está no carrinho e veja alternativas.",
      },
      { property: "og:title", content: "Modo Mercado | EcoVida AI" },
      { property: "og:description", content: "Marque os produtos enquanto compra e encontre alternativas." },
    ],
  }),
  component: MercadoPage,
});

function MercadoPage() {
  const { items, prefs, choose, toggleChecked, markUnavailable, checkedCount, hydrated } = useEco();
  const navigate = useNavigate();
  const [openAlt, setOpenAlt] = useState<string | null>(null);

  if (hydrated && items.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Nada para comprar ainda" subtitle="Crie sua lista e gere a Lista EcoVida." />
        <div className="px-5 pt-6 md:px-8">
          <Link to="/lista" className="inline-flex items-center gap-2 rounded-2xl bg-eco-gradient px-5 py-3.5 text-sm font-semibold text-leaf-foreground shadow-glow">
            Criar minha lista <ArrowRight className="size-4" />
          </Link>
        </div>
      </AppShell>
    );
  }

  const grouped = AISLE_ORDER.map((aisle) => ({
    aisle,
    list: items.filter((i) => aisleOf(i.categoryId) === aisle),
  })).filter((g) => g.list.length > 0);
  const pct = items.length ? (checkedCount / items.length) * 100 : 0;

  return (
    <AppShell>
      <PageHeader eyebrow="🛒 Modo Mercado" title="No supermercado" subtitle="Toque para marcar o que já está no carrinho." />

      <div className="sticky top-0 z-30 mt-3 bg-background/92 px-5 py-3 backdrop-blur md:px-8">
        <div className="flex items-center justify-between gap-3 text-sm font-semibold">
          <span>
            {checkedCount} de {items.length} produtos encontrados
          </span>
          <span className="text-leaf">{Math.round(pct)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-eco-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="px-5 pb-44 md:px-8">
        {grouped.map(({ aisle, list }) => (
          <section key={aisle} className="mt-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {AISLE_EMOJI[aisle]} {aisle}
            </h2>
            <ul className="mt-2 space-y-2">
              {list.map((item) => {
                const product = itemProduct(item);
                const alts = item.categoryId
                  ? rankProducts(item.categoryId, prefs).filter((p) => p.id !== item.productId)
                  : [];
                return (
                  <li
                    key={item.id}
                    className={cn(
                      "rounded-3xl border bg-card p-2.5 shadow-soft transition-all",
                      item.checked ? "border-leaf bg-leaf/8" : "border-border/70",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleChecked(item.id)}
                        aria-pressed={item.checked}
                        className={cn(
                          "grid size-12 shrink-0 place-items-center rounded-2xl border-2 transition-all active:scale-90",
                          item.checked ? "border-leaf bg-leaf text-leaf-foreground" : "border-border",
                        )}
                        aria-label={`Marcar ${item.raw}`}
                      >
                        {item.checked && <Check className="size-6" />}
                      </button>
                      {product && <PackShot product={product} size="xs" />}
                      <button onClick={() => toggleChecked(item.id)} className="min-w-0 flex-1 text-left">
                        <p className={cn("truncate text-[15px] font-semibold", item.checked && "line-through opacity-60")}>
                          {item.raw}
                          {item.qty > 1 && <span className="text-muted-foreground"> · {item.qty}</span>}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {product ? `${product.brand} — ${product.name}` : "Sem marca recomendada"}
                        </p>
                      </button>
                      {alts.length > 0 && (
                        <button
                          onClick={() => {
                            markUnavailable(item.id, true);
                            setOpenAlt(openAlt === item.id ? null : item.id);
                          }}
                          className="shrink-0 rounded-2xl px-2.5 py-2 text-[11px] font-semibold text-muted-foreground hover:bg-muted"
                        >
                          <CircleSlash className="mx-auto size-4" />
                          Não achei
                        </button>
                      )}
                    </div>

                    {openAlt === item.id && alts.length > 0 && (
                      <div className="animate-in fade-in slide-in-from-top-1 mt-2 rounded-2xl bg-muted/60 p-2.5 duration-200">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Tente estas alternativas
                        </p>
                        <div className="mt-1.5 space-y-1.5">
                          {alts.map((alt, i) => (
                            <button
                              key={alt.id}
                              onClick={() => {
                                choose(item.id, alt.id);
                                setOpenAlt(null);
                              }}
                              className="flex w-full items-center gap-2.5 rounded-2xl bg-card p-2 text-left shadow-soft"
                            >
                              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground">
                                {i + 2}ª
                              </span>
                              <PackShot product={alt} size="xs" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold">{alt.brand}</span>
                                <span className="block truncate text-[11px] text-muted-foreground">{alt.name}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <ActionBar>
        <div className="min-w-0 flex-1 pl-1">
          <p className="truncate text-sm font-semibold">{checkedCount} no carrinho</p>
          <p className="truncate text-xs text-muted-foreground">Finalize para verificar pela nota</p>
        </div>
        <button
          onClick={() => navigate({ to: "/verificar" })}
          disabled={checkedCount === 0}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]",
            checkedCount === 0 ? "bg-muted text-muted-foreground" : "bg-eco-gradient text-leaf-foreground shadow-glow",
          )}
        >
          Finalizar compra <ArrowRight className="size-4" />
        </button>
      </ActionBar>
    </AppShell>
  );
}
