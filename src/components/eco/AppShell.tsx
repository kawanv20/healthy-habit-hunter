import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ListPlus, Sparkles, ReceiptText, Leaf } from "lucide-react";
import type { ReactNode } from "react";
import { useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/lista", label: "Minha lista", icon: ListPlus },
  { to: "/recomendacoes", label: "Escolhas", icon: Sparkles },
  { to: "/verificar", label: "Nota", icon: ReceiptText },
  { to: "/perfil", label: "Perfil", icon: Leaf },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { points, list } = useEco();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col md:flex-row">
        {/* Desktop rail */}
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-1 border-r border-border/60 px-4 py-6 md:flex">
          <Link to="/" className="mb-6 flex items-center gap-2 px-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-eco-gradient text-leaf-foreground shadow-glow">
              <Leaf className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">EcoVida AI</span>
          </Link>
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                <span className="truncate">{label}</span>
                {to === "/lista" && list.length > 0 && (
                  <span className="ml-auto rounded-full bg-leaf px-2 py-0.5 text-[11px] font-semibold text-leaf-foreground">
                    {list.length}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="mt-auto rounded-3xl bg-surface-gradient p-4 shadow-soft">
            <p className="text-xs font-medium text-muted-foreground">Seus M Points</p>
            <p className="font-display text-2xl font-semibold text-primary">{points}</p>
          </div>
        </aside>

        <main className="flex-1 pb-24 md:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur md:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-2xl transition-all",
                      active ? "bg-eco-gradient text-leaf-foreground shadow-glow" : "",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {label}
                  {to === "/lista" && list.length > 0 && (
                    <span className="absolute right-3 top-1 grid size-4.5 place-items-center rounded-full bg-berry text-[10px] font-bold text-berry-foreground">
                      {list.length}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-5 pt-7 md:px-8 md:pt-10">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-balance-tight text-2xl font-semibold md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-prose text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
