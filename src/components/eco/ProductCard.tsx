import { Check, Info, Leaf, Salad, Dna, Trophy, ChevronRight, FlaskConical, BookOpen } from "lucide-react";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { categoryById, detailsFor, type Product, type Signal } from "@/lib/ecovida-data";
import { cn } from "@/lib/utils";

const signalStyle: Record<Signal, string> = {
  good: "bg-leaf/12 text-primary",
  neutral: "bg-sun/20 text-sun-foreground",
  unknown: "bg-muted text-muted-foreground",
};

const signalDot: Record<Signal, string> = {
  good: "bg-leaf",
  neutral: "bg-sun",
  unknown: "bg-muted-foreground/40",
};

function SignalRow({
  icon: Icon,
  level,
  label,
  detail,
}: {
  icon: typeof Leaf;
  level: Signal;
  label: string;
  detail?: string;
}) {
  return (
    <li className="flex gap-3">
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", signalStyle[level])}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-tight">{label}</span>
        {detail && <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>}
      </span>
    </li>
  );
}

/** Espaço pronto para a foto real da embalagem; usa fallback enquanto não houver imagem. */
export function PackShot({
  product,
  size = "lg",
}: {
  product: Product;
  size?: "xl" | "lg" | "sm" | "xs";
}) {
  const dim =
    size === "xl" ? "size-28" : size === "lg" ? "size-20" : size === "sm" ? "size-14" : "size-11";
  const text = size === "xl" ? "text-5xl" : size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-base";
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-gradient ring-1 ring-border/70",
        dim,
      )}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={`Embalagem de ${product.brand} ${product.name}`}
          loading="lazy"
          className="size-full object-contain p-1.5"
        />
      ) : (
        <>
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-leaf/10" />
          <span className={text} aria-hidden>
            {product.emoji}
          </span>
        </>
      )}
    </div>
  );
}

export function SignalChips({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", signalStyle[product.nutrition.level])}>
        🥗 {product.nutrition.label}
      </span>
      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", signalStyle[product.environment.level])}>
        🌱 {product.environment.label}
      </span>
    </div>
  );
}

export function HeroProductCard({
  product,
  selected,
  onSelect,
  why,
  onDetails,
  comparedCount,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  why: string;
  onDetails: () => void;
  comparedCount: number;
}) {
  const details = detailsFor(product.id);
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card shadow-lift transition-all duration-300",
        selected ? "border-leaf ring-2 ring-leaf/40" : "border-border/70",
      )}
    >
      <div className="relative flex items-center gap-4 bg-surface-gradient p-5">
        <span className="absolute -right-10 -top-12 size-32 rounded-full bg-leaf/15 blur-2xl" />
        <button onClick={onDetails} className="relative shrink-0" aria-label="Ver detalhes do produto">
          <PackShot product={product} size="xl" />
        </button>
        <div className="relative min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-eco-gradient px-2.5 py-1 text-[11px] font-semibold text-leaf-foreground shadow-glow">
            <Trophy className="size-3" /> Escolha EcoVida
          </span>
          <p className="mt-2 truncate font-display text-xl font-semibold leading-tight">{product.brand}</p>
          <p className="text-sm leading-snug text-muted-foreground">{product.name}</p>
          {details.size && <p className="mt-1 text-[11px] text-muted-foreground">{details.size}</p>}
        </div>
      </div>

      <div className="p-5 pt-4">
        <ul className="space-y-3">
          <SignalRow
            icon={Salad}
            level={product.nutrition.level}
            label={product.nutrition.label}
            detail={product.nutrition.detail}
          />
          <SignalRow
            icon={Leaf}
            level={product.environment.level}
            label={product.environment.label}
            detail={product.environment.detail}
          />
          <SignalRow icon={Dna} level={product.gmo.level} label={product.gmo.label} />
        </ul>

        <div className="mt-5 rounded-2xl bg-secondary/70 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-secondary-foreground">
            <Info className="size-4" /> Por que recomendamos?
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{why}</p>
          <p className="mt-2 text-[11px] text-muted-foreground/80">
            {comparedCount} opções comparadas nesta demonstração.
          </p>
        </div>

        <div className="mt-4 flex gap-2.5">
          <button
            onClick={onSelect}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all active:scale-[0.98]",
              selected
                ? "bg-leaf text-leaf-foreground"
                : "bg-primary text-primary-foreground hover:brightness-110",
            )}
          >
            {selected ? (
              <>
                <Check className="size-4" /> Escolhido
              </>
            ) : (
              "Escolher este"
            )}
          </button>
          <button
            onClick={onDetails}
            className="grid size-[52px] shrink-0 place-items-center rounded-2xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Detalhes do produto"
          >
            <BookOpen className="size-4.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function AltProductCard({
  product,
  selected,
  onSelect,
  onDetails,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  onDetails?: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border bg-card p-3.5 shadow-soft transition-all",
        selected ? "border-leaf ring-2 ring-leaf/40" : "border-border/70",
      )}
    >
      <div className="flex items-center gap-3.5">
        <PackShot product={product} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-tight">{product.brand}</p>
          <p className="truncate text-xs text-muted-foreground">{product.name}</p>
          <div className="mt-2">
            <SignalChips product={product} />
          </div>
        </div>
        <button
          onClick={onSelect}
          aria-label={`Escolher ${product.brand}`}
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full border transition-colors",
            selected ? "border-leaf bg-leaf text-leaf-foreground" : "border-border hover:border-leaf",
          )}
        >
          <Check className="size-4" />
        </button>
      </div>
      {onDetails && (
        <button
          onClick={onDetails}
          className="mt-2.5 flex w-full items-center justify-between rounded-2xl bg-muted/60 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="truncate pr-2">{product.why}</span>
          <ChevronRight className="size-4 shrink-0" />
        </button>
      )}
    </div>
  );
}

/** Detalhes do produto: nutrição, meio ambiente, ingredientes, transgênicos, fontes e comparação. */
export function ProductSheet({
  product,
  categoryId,
  why,
  open,
  onOpenChange,
  onSelect,
  selected,
}: {
  product: Product | null;
  categoryId?: string | undefined;
  why?: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: () => void;
  selected?: boolean;
}) {
  const [compareId, setCompareId] = useState<string | null>(null);
  const siblings = categoryId ? (categoryById(categoryId)?.products ?? []) : [];
  const compare = siblings.find((p) => p.id === compareId) ?? null;
  const details = product ? detailsFor(product.id) : {};

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) setCompareId(null);
        onOpenChange(v);
      }}
    >
      <DrawerContent className="max-h-[92vh]">
        {product && (
          <div className="mx-auto w-full max-w-xl overflow-y-auto px-5 pb-8">
            <DrawerHeader className="px-0 text-left">
              <div className="flex items-center gap-4">
                <PackShot product={product} size="lg" />
                <div className="min-w-0">
                  <DrawerTitle className="truncate font-display text-xl">{product.brand}</DrawerTitle>
                  <DrawerDescription className="leading-snug">{product.name}</DrawerDescription>
                  {details.size && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{details.size}</p>
                  )}
                </div>
              </div>
            </DrawerHeader>

            {why && (
              <section className="rounded-3xl bg-secondary/70 p-4">
                <h3 className="text-sm font-semibold">Por que esta escolha?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{why}</p>
              </section>
            )}

            <section className="mt-4 space-y-3 rounded-3xl border border-border/70 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Salad className="size-4 text-primary" /> Nutrição
              </h3>
              <p className="text-sm text-muted-foreground">{product.nutrition.detail}</p>
              {details.labelNotes && (
                <ul className="divide-y divide-border/70 rounded-2xl bg-muted/50">
                  {details.labelNotes.map((n) => (
                    <li key={n.label} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">{n.label}</span>
                      <span className="text-right font-medium">{n.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-3 space-y-2 rounded-3xl border border-border/70 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Leaf className="size-4 text-primary" /> Meio ambiente
              </h3>
              <p className="text-sm text-muted-foreground">{product.environment.detail}</p>
              <p className="text-[11px] text-muted-foreground/80">
                Indicadores qualitativos. Quando a marca não divulga informação, mostramos “não
                disponível” em vez de estimar números.
              </p>
            </section>

            <section className="mt-3 space-y-2 rounded-3xl border border-border/70 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <FlaskConical className="size-4 text-primary" /> Ingredientes
              </h3>
              <p className="text-sm text-muted-foreground">
                {details.ingredients ?? "Lista de ingredientes não disponível nesta demonstração."}
              </p>
            </section>

            <section className="mt-3 space-y-2 rounded-3xl border border-border/70 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Dna className="size-4 text-primary" /> Transgênicos
              </h3>
              <p className="text-sm text-muted-foreground">{product.gmo.label}</p>
              <p className="text-[11px] text-muted-foreground/80">
                Informação apenas informativa: a presença de transgênicos não é tratada aqui como
                prejudicial.
              </p>
            </section>

            <section className="mt-3 rounded-3xl border border-dashed border-border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="size-4 text-primary" /> Fontes
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {details.sourceNote ??
                  "Dados de demonstração. Este espaço exibirá a fonte de cada informação (rótulo, fabricante ou base pública)."}
              </p>
            </section>

            {siblings.length > 1 && (
              <section className="mt-4">
                <h3 className="text-sm font-semibold">Comparar com outra opção</h3>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {siblings
                    .filter((p) => p.id !== product.id)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setCompareId(compareId === p.id ? null : p.id)}
                        className={cn(
                          "shrink-0 rounded-2xl border px-3 py-2 text-xs font-medium transition-colors",
                          compareId === p.id ? "border-leaf bg-leaf/10" : "border-border/70",
                        )}
                      >
                        {p.brand}
                      </button>
                    ))}
                </div>

                {compare && (
                  <div className="mt-3 overflow-hidden rounded-3xl border border-border/70">
                    <div className="grid grid-cols-2 divide-x divide-border/70 bg-muted/50 text-xs font-semibold">
                      <p className="truncate px-3 py-2">{product.brand}</p>
                      <p className="truncate px-3 py-2">{compare.brand}</p>
                    </div>
                    {(
                      [
                        ["Nutrição", product.nutrition, compare.nutrition],
                        ["Ambiente", product.environment, compare.environment],
                        ["Transgênicos", product.gmo, compare.gmo],
                      ] as const
                    ).map(([label, a, b]) => (
                      <div key={label} className="grid grid-cols-2 divide-x divide-border/70 border-t border-border/70">
                        {[a, b].map((v, i) => (
                          <div key={i} className="px-3 py-2.5">
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
                            <p className="mt-1 flex items-start gap-1.5 text-xs">
                              <span className={cn("mt-1 size-2 shrink-0 rounded-full", signalDot[v.level])} />
                              {v.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {onSelect && (
              <button
                onClick={() => {
                  onSelect();
                  onOpenChange(false);
                }}
                className={cn(
                  "mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold",
                  selected ? "bg-leaf text-leaf-foreground" : "bg-primary text-primary-foreground",
                )}
              >
                {selected ? (
                  <>
                    <Check className="size-4" /> Escolhido
                  </>
                ) : (
                  "Escolher este"
                )}
              </button>
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
