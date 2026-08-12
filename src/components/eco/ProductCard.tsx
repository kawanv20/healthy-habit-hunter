import { Check, Info, Leaf, Salad, Dna, Trophy } from "lucide-react";
import type { Product, Signal } from "@/lib/ecovida-data";
import { cn } from "@/lib/utils";

const signalStyle: Record<Signal, string> = {
  good: "bg-leaf/12 text-primary",
  neutral: "bg-sun/20 text-sun-foreground",
  unknown: "bg-muted text-muted-foreground",
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

/** Placeholder elegante — pronto para receber foto real da embalagem. */
export function PackShot({ product, size = "lg" }: { product: Product; size?: "lg" | "sm" }) {
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-gradient ring-1 ring-border/70",
        size === "lg" ? "size-20" : "size-14",
      )}
      aria-hidden
    >
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-leaf/10" />
      <span className={size === "lg" ? "text-3xl" : "text-xl"}>{product.emoji}</span>
    </div>
  );
}

export function HeroProductCard({
  product,
  selected,
  onSelect,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card p-5 shadow-lift transition-all duration-300",
        selected ? "border-leaf ring-2 ring-leaf/40" : "border-border/70",
      )}
    >
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-leaf/10 blur-2xl" />
      <span className="inline-flex items-center gap-1.5 rounded-full bg-eco-gradient px-3 py-1 text-xs font-semibold text-leaf-foreground shadow-glow">
        <Trophy className="size-3.5" /> Escolha EcoVida
      </span>

      <div className="mt-4 flex items-center gap-4">
        <PackShot product={product} />
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-semibold leading-tight">{product.brand}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{product.name}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
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
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{product.why}</p>
      </div>

      <button
        onClick={onSelect}
        className={cn(
          "mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all active:scale-[0.98]",
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
          "Escolher esta opção"
        )}
      </button>
    </article>
  );
}

export function AltProductCard({
  product,
  selected,
  onSelect,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-3xl border bg-card p-4 text-left shadow-soft transition-all active:scale-[0.99]",
        selected ? "border-leaf ring-2 ring-leaf/40" : "border-border/70 hover:border-leaf/50",
      )}
    >
      <div className="flex items-center gap-3.5">
        <PackShot product={product} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold leading-tight">{product.brand}</p>
          <p className="truncate text-xs text-muted-foreground">{product.name}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", signalStyle[product.nutrition.level])}>
              {product.nutrition.label}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", signalStyle[product.environment.level])}>
              {product.environment.label}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-full border transition-colors",
            selected ? "border-leaf bg-leaf text-leaf-foreground" : "border-border",
          )}
        >
          {selected && <Check className="size-4" />}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{product.why}</p>
    </button>
  );
}
