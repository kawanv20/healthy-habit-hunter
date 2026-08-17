import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ListChecks, ReceiptText, Trophy, Leaf, User, Gamepad2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/lista", label: "Lista", icon: ListChecks },
  { to: "/verificar", label: "Nota", icon: ReceiptText },
  { to: "/jogos", label: "Jogos", icon: Gamepad2 },
  { to: "/pontos", label: "Impacto", icon: Trophy },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { points, items, level } = useEco();

  const isActive = (to: string) =>
    to === "/"
      ? pathname === "/"
      : pathname === to ||
        (to === "/lista" && ["/recomendacoes", "/minha-lista", "/mercado"].includes(pathname));

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
            const active = isActive(to);
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
                {to === "/lista" && items.length > 0 && (
                  <span className="ml-auto rounded-full bg-leaf px-2 py-0.5 text-[11px] font-semibold text-leaf-foreground">
                    {items.length}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="mt-auto rounded-3xl bg-surface-gradient p-4 shadow-soft">
            <p className="text-xs font-medium text-muted-foreground">
              {level.emoji} Nível {level.name}
            </p>
            <p className="font-display text-2xl font-semibold text-primary">{points} M</p>
          </div>
        </aside>

        <main className="flex-1 pb-28 md:pb-10">
          <div className="mx-auto w-full max-w-2xl md:max-w-3xl">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-6">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8.5 place-items-center rounded-2xl transition-all duration-300",
                      active ? "bg-eco-gradient text-leaf-foreground shadow-glow" : "",
                    )}
                  >
                    <Icon className="size-4.5" />
                  </span>
                  {label}
                  {to === "/lista" && items.length > 0 && (
                    <span className="absolute right-1.5 top-0.5 grid size-4.5 place-items-center rounded-full bg-berry text-[10px] font-bold text-berry-foreground">
                      {items.length}
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
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-5 pt-6 md:px-8 md:pt-9">
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

/** Barra de ação fixa, acima da navegação inferior. */
export function ActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[68px] z-40 px-4 pb-[env(safe-area-inset-bottom)] md:bottom-6 md:left-56">
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-3xl border border-border/70 bg-card/95 p-3 shadow-lift backdrop-blur md:max-w-2xl">
        {children}
      </div>
    </div>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 rounded-2xl bg-muted/60 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
