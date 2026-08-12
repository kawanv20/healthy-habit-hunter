import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Leaf, Trophy, History } from "lucide-react";
import { AppShell, PageHeader } from "@/components/eco/AppShell";
import { findProduct } from "@/lib/ecovida-data";
import { useEco } from "@/lib/ecovida-store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu progresso e M Points | EcoVida AI" },
      {
        name: "description",
        content: "Acompanhe seus M Points, nível e o histórico de compras verificadas no EcoVida AI.",
      },
      { property: "og:title", content: "Meu progresso | EcoVida AI" },
      { property: "og:description", content: "M Points, níveis e histórico de escolhas conscientes." },
    ],
  }),
  component: PerfilPage,
});

const badges = [
  { icon: Leaf, label: "Primeira escolha", need: 1 },
  { icon: Trophy, label: "3 compras verificadas", need: 3 },
  { icon: Award, label: "5 compras verificadas", need: 5 },
];

function PerfilPage() {
  const { points, purchases, level } = useEco();
  const aligned = purchases.reduce((n, p) => n + p.items.filter((i) => i.aligned).length, 0);

  return (
    <AppShell>
      <PageHeader eyebrow="Perfil" title="Seu progresso" subtitle="Pontos virtuais por escolhas conscientes nesta demonstração." />

      <div className="px-5 pb-14 pt-6 md:px-8">
        <div className="relative overflow-hidden rounded-4xl bg-eco-gradient p-6 text-leaf-foreground shadow-lift">
          <span className="absolute -right-12 -top-12 size-44 rounded-full bg-white/15 blur-2xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-leaf-foreground/80">
            M Points
          </p>
          <p className="relative font-display text-5xl font-semibold">{points}</p>
          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${level.progress}%` }} />
          </div>
          <p className="relative mt-2 text-xs text-leaf-foreground/85">
            Nível {level.name}
            {level.next ? ` · faltam pontos para ${level.next}` : " · nível máximo"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">Escolhas EcoVida</p>
            <p className="font-display text-2xl font-semibold text-primary">{aligned}</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">Notas verificadas</p>
            <p className="font-display text-2xl font-semibold text-primary">{purchases.length}</p>
          </div>
        </div>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Conquistas</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {badges.map(({ icon: Icon, label, need }) => {
            const unlocked = purchases.length >= need;
            return (
              <div
                key={label}
                className={
                  "flex w-36 shrink-0 flex-col gap-2 rounded-3xl border p-4 " +
                  (unlocked ? "border-leaf bg-leaf/10" : "border-border/70 bg-card opacity-70")
                }
              >
                <span className={"grid size-9 place-items-center rounded-2xl " + (unlocked ? "bg-eco-gradient text-leaf-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="size-4.5" />
                </span>
                <p className="text-xs font-semibold leading-snug">{label}</p>
              </div>
            );
          })}
        </div>

        <h2 className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <History className="size-4" /> Histórico
        </h2>
        {purchases.length === 0 ? (
          <div className="mt-3 rounded-3xl bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma compra verificada ainda.</p>
            <Link to="/lista" className="mt-3 inline-flex text-sm font-semibold text-leaf">
              Começar minha primeira lista
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {purchases.map((p) => (
              <li key={p.id} className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.items
                        .map((i) => findProduct(i.categoryId, i.productId)?.brand)
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-leaf/15 px-3 py-1 text-xs font-semibold text-primary">
                    +{p.points}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
