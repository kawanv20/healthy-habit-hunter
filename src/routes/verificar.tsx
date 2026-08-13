import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Circle, QrCode, ScanLine, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { AppShell, DemoNote, PageHeader } from "@/components/eco/AppShell";
import { PackShot } from "@/components/eco/ProductCard";
import { findProduct } from "@/lib/ecovida-data";
import { itemProduct, useEco, type Purchase } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verificar")({
  head: () => ({
    meta: [
      { title: "Verificar compra pela nota | EcoVida AI" },
      {
        name: "description",
        content: "Confirme o que você comprou (simulação de leitura da NFC-e) e receba M Points pelas escolhas conscientes.",
      },
      { property: "og:title", content: "Verificar compra | EcoVida AI" },
      { property: "og:description", content: "Simulação de leitura da nota fiscal e ganho de M Points." },
    ],
  }),
  component: VerificarPage,
});

function VerificarPage() {
  const { items, verifyPurchase, hydrated } = useEco();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Purchase | null>(null);

  const candidates = items.filter((i) => i.productId);
  const run = () => {
    setScanning(true);
    setTimeout(() => {
      setResult(verifyPurchase());
      setScanning(false);
    }, 1600);
  };

  if (result) {
    const aligned = result.items.filter((i) => i.aligned).length;
    return (
      <AppShell>
        <div className="animate-in fade-in zoom-in-95 px-5 pt-8 duration-500 md:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-eco-gradient p-7 text-center text-leaf-foreground shadow-lift">
            <span className="absolute -right-14 -top-14 size-48 rounded-full bg-white/15 blur-2xl" />
            <span className="relative mx-auto grid size-16 place-items-center rounded-3xl bg-white/20 backdrop-blur">
              <Trophy className="size-7" />
            </span>
            <p className="relative mt-3 text-sm font-semibold">Compra verificada 🎉</p>
            <p className="relative mt-1 font-display text-4xl font-semibold">+{result.points} M Points</p>
            <p className="relative mt-1 text-sm text-leaf-foreground/85">
              {result.items.length} produtos · {aligned} escolha{aligned === 1 ? "" : "s"} EcoVida
            </p>
          </div>

          <ul className="mt-5 divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/70 bg-card">
            {result.breakdown.map((b) => (
              <li key={b.label} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="font-semibold text-primary">+{b.points}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Produtos identificados na nota
          </h2>
          <ul className="mt-3 space-y-2.5">
            {result.items.map((item, n) => {
              const prod = item.categoryId && item.productId ? findProduct(item.categoryId, item.productId) : undefined;
              return (
                <li key={`${item.productId}-${n}`} className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft">
                  {prod ? <PackShot product={prod} size="sm" /> : <span className="grid size-14 place-items-center rounded-2xl bg-muted">🧾</span>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{prod?.brand ?? item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{prod?.name ?? "Produto da nota"}</p>
                  </div>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      item.aligned ? "bg-leaf text-leaf-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.aligned ? <Check className="size-3" /> : <Circle className="size-3" />}
                    {item.aligned ? "recomendado" : "diferente do planejado"}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3 pb-10">
            <Link to="/pontos" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground">
              Ver meus M Points <ArrowRight className="size-4" />
            </Link>
            <Link to="/lista" className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-5 py-3.5 text-sm font-semibold text-secondary-foreground">
              Nova lista
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Passo final"
        title="Comprou? Confirme pela nota."
        subtitle="No futuro os produtos serão identificados pelo QR Code da NFC-e. Nesta versão a leitura é simulada."
      />

      <div className="px-5 pb-16 pt-6 md:px-8">
        <div className="rounded-4xl border border-dashed border-leaf/50 bg-surface-gradient p-7 text-center shadow-soft">
          <span className={cn("mx-auto grid size-16 place-items-center rounded-3xl bg-eco-gradient text-leaf-foreground shadow-glow", scanning && "animate-pulse")}>
            {scanning ? <ScanLine className="size-7" /> : <QrCode className="size-7" />}
          </span>
          <p className="mt-4 font-display text-lg font-semibold">
            {scanning ? "Lendo sua nota fiscal…" : "📷 Escanear nota fiscal"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            {scanning ? "Cruzando os produtos da nota com a sua Lista EcoVida." : "Vamos comparar o que você comprou com o que foi recomendado."}
          </p>
          <button
            onClick={run}
            disabled={scanning || !hydrated || candidates.length === 0}
            className={cn(
              "mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all active:scale-[0.98]",
              candidates.length === 0 || scanning ? "bg-muted text-muted-foreground" : "bg-eco-gradient text-leaf-foreground shadow-glow",
            )}
          >
            <Sparkles className="size-4" />
            {scanning ? "Verificando…" : "Simular leitura da nota"}
          </button>
        </div>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Sua Lista EcoVida ({candidates.length})
        </h2>
        {candidates.length === 0 ? (
          <div className="mt-3 rounded-3xl bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não tem produtos escolhidos. Crie a lista e receba as recomendações primeiro.
            </p>
            <Link to="/lista" className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
              Criar minha lista
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {candidates.map((item) => {
              const prod = itemProduct(item);
              if (!prod) return null;
              return (
                <li key={item.id} className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft">
                  <PackShot product={prod} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{prod.brand}</p>
                    <p className="truncate text-xs text-muted-foreground">{prod.name}</p>
                  </div>
                  {item.checked && (
                    <span className="shrink-0 rounded-full bg-leaf/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      no carrinho
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <DemoNote>
          Simulação: nenhuma nota real é lida e nenhum dado é enviado. Os pontos são virtuais e servem
          para demonstrar o ciclo do produto.
        </DemoNote>
      </div>
    </AppShell>
  );
}
