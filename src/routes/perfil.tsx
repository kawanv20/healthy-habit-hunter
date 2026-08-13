import { createFileRoute, Link } from "@tanstack/react-router";
import { History, Leaf, Salad, Scale, SlidersHorizontal } from "lucide-react";
import { AppShell, DemoNote, PageHeader } from "@/components/eco/AppShell";
import { Switch } from "@/components/ui/switch";
import { findProduct } from "@/lib/ecovida-data";
import type { Priority } from "@/lib/ecovida-ai";
import { useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Preferências e histórico | EcoVida AI" },
      {
        name: "description",
        content: "Defina o que importa mais para você e veja o histórico das suas compras verificadas.",
      },
      { property: "og:title", content: "Preferências e histórico | EcoVida AI" },
      { property: "og:description", content: "Personalize as recomendações e revise compras anteriores." },
    ],
  }),
  component: PerfilPage,
});

const priorities: { id: Priority; label: string; icon: typeof Leaf; hint: string }[] = [
  { id: "equilibrio", label: "Equilíbrio geral", icon: Scale, hint: "Saúde e sustentabilidade com peso parecido" },
  { id: "saude", label: "Saúde", icon: Salad, hint: "Prioriza composição e menos processamento" },
  { id: "sustentabilidade", label: "Sustentabilidade", icon: Leaf, hint: "Prioriza embalagem e origem declarada" },
];

function PerfilPage() {
  const { prefs, setPrefs, purchases } = useEco();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Perfil"
        title="Suas preferências"
        subtitle="Isso muda a ordem das recomendações da EcoVida AI."
      />

      <div className="px-5 pb-14 pt-5 md:px-8">
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4 text-leaf" /> O que importa mais para você?
          </h2>
          <div className="mt-3 space-y-2">
            {priorities.map(({ id, label, icon: Icon, hint }) => {
              const active = prefs.priority === id;
              return (
                <button
                  key={id}
                  onClick={() => setPrefs({ priority: id })}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-3xl border p-4 text-left transition-all active:scale-[0.99]",
                    active ? "border-leaf bg-leaf/10 shadow-soft" : "border-border/70 bg-card",
                  )}
                >
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-2xl", active ? "bg-eco-gradient text-leaf-foreground" : "bg-muted text-muted-foreground")}>
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="block text-xs text-muted-foreground">{hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 divide-y divide-border/70 overflow-hidden rounded-3xl border border-border/70 bg-card">
          <label className="flex items-center gap-3 p-4">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Evitar ultraprocessados</span>
              <span className="block text-xs text-muted-foreground">Rebaixa opções muito processadas na ordem</span>
            </span>
            <Switch
              checked={prefs.avoidUltraprocessed}
              onCheckedChange={(v) => setPrefs({ avoidUltraprocessed: v })}
            />
          </label>
          <label className="flex items-center gap-3 p-4">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Preferir informação sobre transgênicos</span>
              <span className="block text-xs text-muted-foreground">
                Prioriza marcas que publicam essa informação — sem julgar transgênicos
              </span>
            </span>
            <Switch checked={prefs.preferGmoInfo} onCheckedChange={(v) => setPrefs({ preferGmoInfo: v })} />
          </label>
        </section>

        <h2 className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <History className="size-4" /> Histórico
        </h2>
        {purchases.length === 0 ? (
          <div className="mt-3 rounded-3xl bg-muted p-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma compra verificada ainda.</p>
            <Link to="/lista" className="mt-3 inline-flex rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
              Criar minha lista
            </Link>
          </div>
        ) : (
          <ul className="mt-3 space-y-2.5">
            {purchases.map((p) => {
              const aligned = p.items.filter((i) => i.aligned).length;
              return (
                <li key={p.id} className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold">
                      Compra —{" "}
                      {new Date(p.date).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
                    </p>
                    <p className="shrink-0 text-sm font-semibold text-primary">+{p.points} M</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.items.length} itens · {aligned} escolha{aligned === 1 ? "" : "s"} EcoVida
                  </p>
                  <ul className="mt-2.5 space-y-1">
                    {p.items.map((item, n) => {
                      const prod =
                        item.categoryId && item.productId
                          ? findProduct(item.categoryId, item.productId)
                          : undefined;
                      return (
                        <li key={`${p.id}-${n}`} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={cn("size-1.5 shrink-0 rounded-full", item.aligned ? "bg-leaf" : "bg-muted-foreground/40")} />
                          <span className="truncate">
                            {item.name}
                            {prod ? ` — ${prod.brand}` : ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}

        <DemoNote>
          Dados salvos apenas neste navegador. Nenhuma conta, servidor ou serviço pago é necessário.
        </DemoNote>
      </div>
    </AppShell>
  );
}
