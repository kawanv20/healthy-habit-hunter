import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { categoryById, recommendedFor } from "./ecovida-data";

export type Purchase = {
  id: string;
  date: string;
  items: { categoryId: string; productId: string; aligned: boolean }[];
  points: number;
};

type State = {
  list: string[];
  choices: Record<string, string>;
  points: number;
  purchases: Purchase[];
};

const EMPTY: State = { list: [], choices: {}, points: 0, purchases: [] };
const KEY = "ecovida-ai-state-v1";

type Ctx = State & {
  hydrated: boolean;
  toggleCategory: (id: string) => void;
  clearList: () => void;
  choose: (categoryId: string, productId: string) => void;
  confirmPurchase: () => Purchase;
  resetChoices: () => void;
  alignedCount: number;
  level: { name: string; index: number; next: string | null; progress: number };
};

const EcoContext = createContext<Ctx | null>(null);

const LEVELS = [
  { name: "Semente", min: 0 },
  { name: "Brotinho", min: 150 },
  { name: "Folha Verde", min: 400 },
  { name: "Árvore", min: 800 },
  { name: "Floresta", min: 1500 },
];

export function EcoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const value = useMemo<Ctx>(() => {
    const aligned = Object.entries(state.choices).filter(
      ([catId, prodId]) => recommendedFor(catId)?.id === prodId,
    ).length;

    const idx = LEVELS.reduce((acc, l, i) => (state.points >= l.min ? i : acc), 0);
    const current = LEVELS[idx]!;
    const next = LEVELS[idx + 1] ?? null;
    const progress = next
      ? Math.min(100, ((state.points - current.min) / (next.min - current.min)) * 100)
      : 100;

    return {
      ...state,
      hydrated,
      alignedCount: aligned,
      level: { name: current.name, index: idx, next: next?.name ?? null, progress },
      toggleCategory: (id) =>
        setState((s) => {
          const inList = s.list.includes(id);
          const list = inList ? s.list.filter((x) => x !== id) : [...s.list, id];
          const choices = { ...s.choices };
          if (inList) delete choices[id];
          return { ...s, list, choices };
        }),
      clearList: () => setState((s) => ({ ...s, list: [], choices: {} })),
      choose: (categoryId, productId) =>
        setState((s) => ({ ...s, choices: { ...s.choices, [categoryId]: productId } })),
      resetChoices: () => setState((s) => ({ ...s, choices: {} })),
      confirmPurchase: () => {
        const items = Object.entries(state.choices)
          .filter(([catId]) => categoryById(catId))
          .map(([categoryId, productId]) => ({
            categoryId,
            productId,
            aligned: recommendedFor(categoryId)?.id === productId,
          }));
        const points = items.reduce((sum, i) => sum + (i.aligned ? 30 : 10), 0);
        const purchase: Purchase = {
          id: `nf-${Date.now()}`,
          date: new Date().toISOString(),
          items,
          points,
        };
        setState((s) => ({
          ...s,
          points: s.points + points,
          purchases: [purchase, ...s.purchases].slice(0, 20),
          list: [],
          choices: {},
        }));
        return purchase;
      },
    };
  }, [state, hydrated]);

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
}

export function useEco() {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error("useEco deve ser usado dentro de EcoProvider");
  return ctx;
}
