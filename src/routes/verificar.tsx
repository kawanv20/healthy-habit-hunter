import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, QrCode, ScanLine, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/eco/AppShell";
import { PackShot } from "@/components/eco/ProductCard";
import { categoryById, findProduct } from "@/lib/ecovida-data";
import { useEco, type Purchase } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verificar")({
  head: () => ({
    meta: [
      { title: "Verificar compra pela nota | EcoVida AI" },
      {
        name: "description",
        content: "Confirme o que você realmente comprou e receba M Points pelas escolhas alinhadas.",
      },
      { property: "og:title", content: "Verificar compra | EcoVida AI" },
      { property: "og:description", content: "Simulação de leitura da nota fiscal e ganho de M Points." },
    ],
  }),
  component: VerificarPage,
});

function VerificarPage() {
  const { choices, confirmPurchase, hydrated } = useEco();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Purchase | null>(null);

  const entries = Object.entries(choices);

  const run = () => {
    setScanning(true);
    setTimeout(() => {
      setResult(confirmPurchase());
      setScanning(false);
    }, 1400);
  };

  if (result) {
    const aligned = result.items.filter((i) => i.aligned).length;
    return (
      <AppShell>
        <div className="animate-in fade-in zoom-in-95 px-5 pt-10 duration-500 md:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-eco-gradient p-7 text-center text-leaf-foreground shadow-lift">
            <span className="absolute -right-14 -top-14 size-48 rounded-full bg-white/15 blur-2xl" />
            <span className="relative mx-auto grid size-16 place-items-center rounded-3xl bg-white/20 backdrop-blur">
              <Trophy className="size-7" />
            </span>
            <p className="relative mt-4 font-display text-4xl font-semibold">+{result.points} M Points</p>
            <p className="relative mt-1 text-sm text-leaf-foreground/85">
              {aligned} escolha{aligned === 1 ? "" : "s"} EcoVida confirmada{aligned === 1 ? "" : "s"}
            </p>
          </div>

          <h2 className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Itens identificados na nota
          </h2>
          <ul className="mt-3 space-y-2.5">
            {result.items.map((item) => {
              const prod = findProduct(item.categoryId, item.productId);
              if (!prod) return null;
              return (
                <li
                  key={item.productId}
                  className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft"
                >
                  <PackShot product={prod} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{prod.brand}</p>
                    <p className="truncate text-xs text-muted-foreground">{prod.name}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      item.aligned ? "bg-leaf text-leaf-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.aligned ? "+30" : "+10"}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3 pb-10">
            <Link
              to="/perfil"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              Ver meu progresso <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/lista"
              className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-5 py-3.5 text-sm font-semibold text-secondary-foreground"
            >
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
        eyebrow="Passo 3"
        title="Comprou? Confirme pela nota."
        subtitle="No futuro os produtos serão identificados automaticamente pela NFC-e. Nesta versão a leitura é simulada."
      />

      <div className="px-5 pb-16 pt-6 md:px-8">
        <div className="rounded-4xl border border-dashed border-leaf/50 bg-surface-gradient p-7 text-center shadow-soft">
          <span
            className={cn(
              "mx-auto grid size-16 place-items-center rounded-3xl bg-eco-gradient text-leaf-foreground shadow-glow",
              scanning && "animate-pulse",
            )}
          >
            {scanning ? <ScanLine className="size-7" /> : <QrCode className="size-7" />}
          </span>
          <p className="mt-4 font-display text-lg font-semibold">
            {scanning ? "Lendo sua nota fiscal…" : "Escanear nota fiscal"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            {scanning
              ? "Cruzando os produtos da nota com as suas escolhas."
              : "Aponte para o QR Code do cupom. Vamos comparar com a sua lista de escolhas."}
          </p>
          <button
            onClick={run}
            disabled={scanning || !hydrated || entries.length === 0}
            className={cn(
              "mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all active:scale-[0.98]",
              entries.length === 0 || scanning
                ? "bg-muted text-muted-foreground"
                : "bg-eco-gradient text-leaf-foreground shadow-glow",
            )}
          >
            <Sparkles className="size-4" />
            {scanning ? "Verificando…" : "Simular leitura da nota"}
          </button>
        </div>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Suas escolhas ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <div className="mt-3 rounded-3xl bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não escolheu produtos. Monte a lista e veja as recomendações primeiro.
            </p>
            <Link to="/lista" className="mt-3 inline-flex text-sm font-semibold text-leaf">
              Criar minha lista
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {entries.map(([catId, prodId]) => {
              const prod = findProduct(catId, prodId);
              const cat = categoryById(catId);
              if (!prod || !cat) return null;
              return (
                <li
                  key={catId}
                  className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft"
                >
                  <PackShot product={prod} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-muted-foreground">{cat.label}</p>
                    <p className="truncate text-sm font-semibold">{prod.brand}</p>
                  </div>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-leaf/15 text-primary">
                    <Check className="size-4" />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
