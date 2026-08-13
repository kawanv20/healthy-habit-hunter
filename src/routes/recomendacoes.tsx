import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActionBar, AppShell, DemoNote, PageHeader } from "@/components/eco/AppShell";
import { AltProductCard, HeroProductCard, ProductSheet } from "@/components/eco/ProductCard";
import { analysisSteps, explain, interpret, rankProducts } from "@/lib/ecovida-ai";
import { categoryById, type Product } from "@/lib/ecovida-data";
import { useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Análise e recomendações | EcoVida AI" },
      {
        name: "description",
        content:
          "A EcoVida AI interpreta sua lista, compara as marcas disponíveis e explica por que recomenda cada produto.",
      },
      { property: "og:title", content: "Análise e recomendações | EcoVida AI" },
      {
        property: "og:description",
        content: "Escolha EcoVida e alternativas para cada item da sua lista, com o motivo de cada escolha.",
      },
    ],
  }),
  component: RecomendacoesPage,
});

function AnalyzingScreen({ step }: { step: number }) {
  return (
    <div className="px-6 py-16 md:px-8">
      <div className="mx-auto max-w-sm text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-eco-gradient text-leaf-foreground shadow-glow">
          <Sparkles className="size-7 animate-pulse" />
        </span>
        <h2 className="mt-5 font-display text-xl font-semibold">Analisando sua lista…</h2>
        <ul className="mt-6 space-y-2.5 text-left">
          {analysisSteps.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-sm transition-all duration-300",
                  done
                    ? "border-leaf/40 bg-leaf/8 text-foreground"
                    : active
                      ? "border-leaf bg-card text-foreground shadow-soft"
                      : "border-border/60 bg-card/60 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                    done ? "bg-leaf text-leaf-foreground" : active ? "bg-eco-gradient text-leaf-foreground" : "bg-muted",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className="truncate">{label}</span>
                {active && (
                  <span className="ml-auto flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 animate-bounce rounded-full bg-leaf"
                        style={{ animationDelay: `${d * 120}ms` }}
                      />
                    ))}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function RecomendacoesPage() {
  const { items, analyzed, analyze, choose, prefs, hydrated } = useEco();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"analyzing" | "ready">(analyzed ? "ready" : "analyzing");
  const [step, setStep] = useState(0);
  const [index, setIndex] = useState(0);
  const [sheet, setSheet] = useState<Product | null>(null);

  useEffect(() => {
    if (analyzed) {
      setPhase("ready");
      return;
    }
    if (!hydrated || items.length === 0) return;
    let s = 0;
    const timer = setInterval(() => {
      s += 1;
      setStep(s);
      if (s >= analysisSteps.length) {
        clearInterval(timer);
        analyze();
        setPhase("ready");
      }
    }, 480);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, items.length, analyzed]);

  const recognized = useMemo(() => items.filter((i) => i.categoryId), [items]);
  const unknownItems = useMemo(() => items.filter((i) => !i.categoryId), [items]);

  if (hydrated && items.length === 0) {
    return (
      <AppShell>
        <PageHeader
          title="Sua lista está vazia"
          subtitle="Escreva o que você precisa comprar para a EcoVida AI analisar e comparar marcas."
        />
        <div className="px-5 pt-6 md:px-8">
          <Link
            to="/lista"
            className="inline-flex items-center gap-2 rounded-2xl bg-eco-gradient px-5 py-3.5 text-sm font-semibold text-leaf-foreground shadow-glow"
          >
            Criar minha lista <ArrowRight className="size-4" />
          </Link>
        </div>
      </AppShell>
    );
  }

  if (phase === "analyzing") {
    return (
      <AppShell>
        <AnalyzingScreen step={step} />
      </AppShell>
    );
  }

  if (recognized.length === 0) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Análise concluída"
          title="Ainda não temos produtos para comparar"
          subtitle="Nenhum item da sua lista está no catálogo desta demonstração. Tente “arroz”, “café”, “coca”, “danone” ou “molho”."
        />
        <div className="px-5 pt-6 md:px-8">
          <Link
            to="/lista"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            Ajustar minha lista
          </Link>
        </div>
      </AppShell>
    );
  }

  const safeIndex = Math.min(index, recognized.length - 1);
  const item = recognized[safeIndex]!;
  const category = categoryById(item.categoryId!)!;
  const ranked = rankProducts(item.categoryId!, prefs);
  const best = ranked[0]!;
  const reading = interpret(item.raw);
  const chosenCount = recognized.filter((i) => i.productId).length;
  const isLast = safeIndex >= recognized.length - 1;

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Item ${safeIndex + 1} de ${recognized.length}`}
        title={`“${item.raw}”`}
        subtitle={reading.reading}
      />

      <div className="mt-4 flex gap-1.5 px-5 md:px-8">
        {recognized.map((i, n) => (
          <button
            key={i.id}
            onClick={() => setIndex(n)}
            aria-label={`Ir para ${i.raw}`}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              n === safeIndex ? "bg-eco-gradient" : i.productId ? "bg-leaf/50" : "bg-muted",
            )}
          />
        ))}
      </div>

      <div key={item.id} className="animate-in fade-in slide-in-from-bottom-2 px-5 pb-44 pt-5 duration-300 md:px-8">
        <p className="mb-3 text-xs font-medium text-muted-foreground">
          {category.emoji} Categoria: <span className="font-semibold text-foreground">{category.label}</span>
          {item.qty > 1 && ` · ${item.qty} un`}
          {item.note && ` · ${item.note}`}
        </p>

        <HeroProductCard
          product={best}
          selected={item.productId === best.id}
          onSelect={() => choose(item.id, best.id)}
          why={explain(best, prefs, ranked.length)}
          comparedCount={ranked.length}
          onDetails={() => setSheet(best)}
        />

        <h2 className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Outras boas opções
        </h2>
        <div className="mt-3 space-y-2.5">
          {ranked.slice(1).map((prod) => (
            <AltProductCard
              key={prod.id}
              product={prod}
              selected={item.productId === prod.id}
              onSelect={() => choose(item.id, prod.id)}
              onDetails={() => setSheet(prod)}
            />
          ))}
        </div>

        {unknownItems.length > 0 && safeIndex === recognized.length - 1 && (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-card p-4">
            <p className="text-sm font-semibold">Sem comparação nesta demonstração</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {unknownItems.map((i) => i.raw).join(", ")} — vão para sua lista normalmente, apenas sem
              recomendação de marca.
            </p>
          </div>
        )}

        <DemoNote>
          A EcoVida AI recomenda, não obriga: você pode escolher qualquer alternativa. Indicadores
          ambientais são qualitativos e, quando a marca não divulga, mostramos “não disponível”.
        </DemoNote>
      </div>

      <ProductSheet
        product={sheet}
        categoryId={item.categoryId}
        why={sheet ? explain(sheet, prefs, ranked.length) : undefined}
        open={!!sheet}
        onOpenChange={(v) => !v && setSheet(null)}
        selected={item.productId === sheet?.id}
        onSelect={() => sheet && choose(item.id, sheet.id)}
      />

      <ActionBar>
        <button
          onClick={() => setIndex((s) => Math.max(0, s - 1))}
          disabled={safeIndex === 0}
          aria-label="Item anterior"
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="size-4.5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {chosenCount} de {recognized.length} definidos
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {item.productId ? "Item definido" : "Escolha uma opção"}
          </p>
        </div>
        {isLast ? (
          <button
            onClick={() => navigate({ to: "/minha-lista" })}
            disabled={chosenCount === 0}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]",
              chosenCount === 0
                ? "bg-muted text-muted-foreground"
                : "bg-eco-gradient text-leaf-foreground shadow-glow",
            )}
          >
            Ver Lista EcoVida <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            onClick={() => setIndex((s) => s + 1)}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]"
          >
            Próximo <ArrowRight className="size-4" />
          </button>
        )}
      </ActionBar>
    </AppShell>
  );
}
