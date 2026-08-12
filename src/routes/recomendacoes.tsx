import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/eco/AppShell";
import { AltProductCard, HeroProductCard } from "@/components/eco/ProductCard";
import { categoryById } from "@/lib/ecovida-data";
import { useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recomendacoes")({
  head: () => ({
    meta: [
      { title: "Melhores escolhas para sua lista | EcoVida AI" },
      {
        name: "description",
        content:
          "Veja a recomendação principal e as alternativas para cada item da sua lista, com o motivo de cada escolha.",
      },
      { property: "og:title", content: "Melhores escolhas | EcoVida AI" },
      { property: "og:description", content: "Recomendação principal e alternativas, item por item." },
    ],
  }),
  component: RecomendacoesPage,
});

function RecomendacoesPage() {
  const { list, choices, choose, hydrated } = useEco();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAnalyzing(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (step > 0 && step >= list.length) setStep(Math.max(0, list.length - 1));
  }, [list.length, step]);

  if (hydrated && list.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Sua lista está vazia" subtitle="Escolha o que você precisa comprar para receber recomendações." />
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

  const categoryId = list[Math.min(step, Math.max(0, list.length - 1))];
  const category = categoryId ? categoryById(categoryId) : undefined;
  const chosenCount = list.filter((id) => choices[id]).length;
  const isLast = step >= list.length - 1;

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Item ${Math.min(step + 1, list.length)} de ${list.length}`}
        title={category ? category.label : "Recomendações"}
        subtitle="A melhor escolha segundo os critérios analisados aparece primeiro. Você decide."
      />

      <div className="mt-5 flex gap-1.5 px-5 md:px-8">
        {list.map((id, i) => (
          <button
            key={id}
            onClick={() => setStep(i)}
            aria-label={`Ir para ${categoryById(id)?.label}`}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              i === step ? "bg-eco-gradient" : choices[id] ? "bg-leaf/50" : "bg-muted",
            )}
          />
        ))}
      </div>

      {analyzing ? (
        <div className="px-5 py-16 text-center md:px-8">
          <span className="mx-auto grid size-14 animate-pulse place-items-center rounded-3xl bg-eco-gradient text-leaf-foreground shadow-glow">
            <Sparkles className="size-6" />
          </span>
          <p className="mt-4 font-display text-lg font-semibold">Comparando marcas…</p>
          <p className="mt-1 text-sm text-muted-foreground">Analisando nutrição, embalagem e informações disponíveis.</p>
        </div>
      ) : (
        category && (
          <div key={category.id} className="animate-in fade-in slide-in-from-bottom-2 px-5 pb-40 pt-5 duration-300 md:px-8">
            <HeroProductCard
              product={category.products[0]!}
              selected={choices[category.id] === category.products[0]!.id}
              onSelect={() => choose(category.id, category.products[0]!.id)}
            />

            <h2 className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Outras opções
            </h2>
            <div className="mt-3 space-y-3">
              {category.products.slice(1).map((prod) => (
                <AltProductCard
                  key={prod.id}
                  product={prod}
                  selected={choices[category.id] === prod.id}
                  onSelect={() => choose(category.id, prod.id)}
                />
              ))}
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
              Dados de demonstração. Indicadores ambientais são qualitativos: quando a marca não
              divulga informação, mostramos “não disponível” em vez de estimar números.
            </p>
          </div>
        )
      )}

      <div className="fixed inset-x-0 bottom-[68px] z-40 px-4 md:bottom-6 md:left-56">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-3xl border border-border/70 bg-card/95 p-3 shadow-lift backdrop-blur md:max-w-xl">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Item anterior"
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground transition-colors disabled:opacity-40"
          >
            <ArrowLeft className="size-4.5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{chosenCount} de {list.length} escolhidos</p>
            <p className="truncate text-xs text-muted-foreground">
              {choices[category?.id ?? ""] ? "Item definido" : "Selecione uma opção"}
            </p>
          </div>
          {isLast ? (
            <button
              onClick={() => navigate({ to: "/verificar" })}
              disabled={chosenCount === 0}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]",
                chosenCount === 0
                  ? "bg-muted text-muted-foreground"
                  : "bg-eco-gradient text-leaf-foreground shadow-glow",
              )}
            >
              Finalizar lista <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98]"
            >
              Próximo item <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
