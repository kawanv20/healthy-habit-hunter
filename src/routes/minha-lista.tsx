import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Repeat, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ActionBar, AppShell, DemoNote, PageHeader } from "@/components/eco/AppShell";
import { PackShot, ProductSheet, SignalChips } from "@/components/eco/ProductCard";
import { AISLE_EMOJI, AISLE_ORDER, aisleOf, explain, rankProducts, type Aisle } from "@/lib/ecovida-ai";
import type { Product } from "@/lib/ecovida-data";
import { itemProduct, useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/minha-lista")({
  head: () => ({
    meta: [
      { title: "Sua Lista EcoVida | EcoVida AI" },
      {
        name: "description",
        content: "A lista final com os produtos e marcas recomendados, organizada por seções do mercado.",
      },
      { property: "og:title", content: "Sua Lista EcoVida" },
      { property: "og:description", content: "A lista que você leva ao supermercado, produto por produto." },
    ],
  }),
  component: MinhaListaPage,
});

function MinhaListaPage() {
  const { items, prefs, choose, alignedCount, hydrated } = useEco();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<{ product: Product; itemId: string; categoryId?: string | undefined } | null>(null);

  if (hydrated && items.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Nenhuma lista ativa" subtitle="Crie uma lista para receber sua Lista EcoVida." />
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

  return (
    <AppShell>
      <PageHeader
        eyebrow="Passo 3 · Pronta"
        title="Sua Lista EcoVida 🌱"
        subtitle="Organizada por seções, já com as marcas recomendadas. Você pode trocar qualquer item."
      />

      <div className="px-5 pb-44 pt-5 md:px-8">
        <div className="rounded-3xl bg-surface-gradient p-4 ring-1 ring-border/60">
          <p className="text-sm font-semibold">
            {items.length} {items.length === 1 ? "item" : "itens"} · {alignedCount} escolha
            {alignedCount === 1 ? "" : "s"} EcoVida
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Leve esta lista ao mercado no Modo Mercado e marque o que colocar no carrinho.
          </p>
        </div>

        {grouped.map(({ aisle, list }) => (
          <section key={aisle} className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {AISLE_EMOJI[aisle as Aisle]} {aisle}
            </h2>
            <ul className="mt-2.5 space-y-2">
              {list.map((item) => {
                const product = itemProduct(item);
                const ranked = item.categoryId ? rankProducts(item.categoryId, prefs) : [];
                return (
                  <li
                    key={item.id}
                    className="rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft"
                  >
                    <div className="flex items-center gap-3.5">
                      {product ? (
                        <PackShot product={product} size="sm" />
                      ) : (
                        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-muted text-xl">
                          🛍️
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {item.raw}
                          {item.qty > 1 && <span className="text-muted-foreground"> · {item.qty} un</span>}
                        </p>
                        {product ? (
                          <>
                            <p className="truncate text-xs text-muted-foreground">
                              {product.brand} — {product.name}
                            </p>
                            <div className="mt-1.5">
                              <SignalChips product={product} />
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Sem comparação nesta demonstração
                          </p>
                        )}
                      </div>
                    </div>

                    {ranked.length > 1 && product && (
                      <div className="mt-2.5 flex gap-2">
                        <button
                          onClick={() => setSheet({ product, itemId: item.id, categoryId: item.categoryId })}
                          className="flex-1 rounded-2xl bg-muted/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Ver detalhes
                        </button>
                        <button
                          onClick={() => {
                            const next = ranked.find((p) => p.id !== product.id);
                            if (next) choose(item.id, next.id);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-2xl bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground"
                        >
                          <Repeat className="size-3.5" /> Outra opção
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <DemoNote>
          Produtos e marcas de demonstração. Os campos de imagem, ingredientes e fonte já estão
          preparados para receber dados reais de embalagens.
        </DemoNote>
      </div>

      <ProductSheet
        product={sheet?.product ?? null}
        categoryId={sheet?.categoryId}
        why={sheet ? explain(sheet.product, prefs, 3) : undefined}
        open={!!sheet}
        onOpenChange={(v) => !v && setSheet(null)}
        selected
      />

      <ActionBar>
        <div className="min-w-0 flex-1 pl-1">
          <p className="truncate text-sm font-semibold">Lista pronta</p>
          <p className="truncate text-xs text-muted-foreground">Hora de ir ao supermercado</p>
        </div>
        <button
          onClick={() => navigate({ to: "/mercado" })}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-2xl bg-eco-gradient px-4 py-3 text-sm font-semibold text-leaf-foreground shadow-glow transition-all active:scale-[0.98]",
          )}
        >
          <ShoppingCart className="size-4" /> Ir às compras
        </button>
      </ActionBar>
    </AppShell>
  );
}
