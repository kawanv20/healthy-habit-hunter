import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { categoryById, findProduct } from "./ecovida-data";
import { bestFor, interpret, rankProducts, splitItems, DEFAULT_PREFS, type Prefs } from "./ecovida-ai";

export type ListItem = {
  id: string;
  /** exatamente o que o usuário digitou */
  raw: string;
  qty: number;
  note?: string | undefined;
  /** categoria identificada pela análise */
  categoryId?: string | undefined;
  /** produto escolhido/recomendado */
  productId?: string | undefined;
  /** marcado no Modo Mercado */
  checked: boolean;
  /** usuário não encontrou no mercado */
  unavailable: boolean;
};

export type Purchase = {
  id: string;
  date: string;
  points: number;
  breakdown: { label: string; points: number }[];
  items: {
    name: string;
    categoryId?: string | undefined;
    productId?: string | undefined;
    aligned: boolean;
    bought: boolean;
  }[];
};

type State = {
  items: ListItem[];
  analyzed: boolean;
  points: number;
  purchases: Purchase[];
  prefs: Prefs;
  games: GameStats;
};

export type GameStats = {
  /** melhor pontuação no jogo de separação */
  sortBest: number;
  /** melhor acerto no quiz (0–10) */
  quizBest: number;
  plays: number;
};

const EMPTY_GAMES: GameStats = { sortBest: 0, quizBest: 0, plays: 0 };

const EMPTY: State = {
  items: [],
  analyzed: false,
  points: 0,
  purchases: [],
  prefs: DEFAULT_PREFS,
  games: EMPTY_GAMES,
};
const KEY = "ecovida-ai-state-v2";

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const LEVELS = [
  { name: "Semente", emoji: "🌱", min: 0 },
  { name: "Broto", emoji: "🌿", min: 150 },
  { name: "Árvore", emoji: "🌳", min: 400 },
  { name: "Guardião", emoji: "🌎", min: 900 },
];

export const WEEKLY_CHALLENGE = { title: "Faça 3 escolhas EcoVida", goal: 3, reward: 40 };

type Ctx = State & {
  hydrated: boolean;
  addFromText: (text: string) => number;
  addItem: (name: string) => void;
  updateItem: (id: string, patch: Partial<Pick<ListItem, "raw" | "qty" | "note">>) => void;
  removeItem: (id: string) => void;
  clearList: () => void;
  analyze: () => void;
  choose: (itemId: string, productId: string) => void;
  toggleChecked: (itemId: string) => void;
  markUnavailable: (itemId: string, value: boolean) => void;
  resetMarket: () => void;
  verifyPurchase: () => Purchase;
  /** recompensa de jogo: soma M Points e guarda recorde */
  finishGame: (game: "sort" | "quiz", score: number, points: number) => void;
  setPrefs: (patch: Partial<Prefs>) => void;
  /** derivados */
  recognized: ListItem[];
  chosenCount: number;
  alignedCount: number;
  checkedCount: number;
  challengeProgress: number;
  level: { name: string; emoji: string; index: number; next: string | null; progress: number };
  totalAligned: number;
};

const EcoContext = createContext<Ctx | null>(null);

export function EcoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState({
          ...EMPTY,
          ...parsed,
          prefs: { ...DEFAULT_PREFS, ...(parsed.prefs ?? {}) },
          games: { ...EMPTY_GAMES, ...(parsed.games ?? {}) },
        });
      }
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
    const recognized = state.items.filter((i) => i.categoryId);
    const chosen = state.items.filter((i) => i.productId);
    const aligned = chosen.filter(
      (i) => i.categoryId && bestFor(i.categoryId, state.prefs)?.id === i.productId,
    );
    const checked = state.items.filter((i) => i.checked);

    const idx = LEVELS.reduce((acc, l, i) => (state.points >= l.min ? i : acc), 0);
    const current = LEVELS[idx]!;
    const next = LEVELS[idx + 1] ?? null;
    const progress = next
      ? Math.min(100, ((state.points - current.min) / (next.min - current.min)) * 100)
      : 100;

    const totalAligned = state.purchases.reduce(
      (n, p) => n + p.items.filter((i) => i.aligned && i.bought).length,
      0,
    );

    return {
      ...state,
      hydrated,
      recognized,
      chosenCount: chosen.length,
      alignedCount: aligned.length,
      checkedCount: checked.length,
      challengeProgress: Math.min(WEEKLY_CHALLENGE.goal, aligned.length),
      totalAligned,
      level: { name: current.name, emoji: current.emoji, index: idx, next: next?.name ?? null, progress },

      addFromText: (text) => {
        const parsed = splitItems(text);
        if (!parsed.length) return 0;
        setState((s) => ({
          ...s,
          analyzed: false,
          items: [
            ...s.items,
            ...parsed.map(({ name, qty }) => ({
              id: uid(),
              raw: name,
              qty,
              checked: false,
              unavailable: false,
            })),
          ],
        }));
        return parsed.length;
      },
      addItem: (name) =>
        setState((s) => ({
          ...s,
          analyzed: false,
          items: [...s.items, { id: uid(), raw: name, qty: 1, checked: false, unavailable: false }],
        })),
      updateItem: (id, patch) =>
        setState((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  ...patch,
                  ...(patch.raw !== undefined && patch.raw !== i.raw
                    ? { categoryId: undefined, productId: undefined }
                    : {}),
                }
              : i,
          ),
        })),
      removeItem: (id) => setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
      clearList: () => setState((s) => ({ ...s, items: [], analyzed: false })),

      analyze: () =>
        setState((s) => ({
          ...s,
          analyzed: true,
          items: s.items.map((i) => {
            const categoryId = i.categoryId ?? interpret(i.raw).categoryId;
            const productId =
              i.productId ?? (categoryId ? bestFor(categoryId, s.prefs)?.id : undefined);
            return { ...i, categoryId, productId };
          }),
        })),

      choose: (itemId, productId) =>
        setState((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, productId, unavailable: false } : i)),
        })),
      toggleChecked: (itemId) =>
        setState((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)),
        })),
      markUnavailable: (itemId, val) =>
        setState((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, unavailable: val } : i)),
        })),
      resetMarket: () =>
        setState((s) => ({
          ...s,
          items: s.items.map((i) => ({ ...i, checked: false, unavailable: false })),
        })),

      finishGame: (game, score, points) =>
        setState((s) => ({
          ...s,
          points: s.points + points,
          games: {
            ...s.games,
            plays: s.games.plays + 1,
            sortBest: game === "sort" ? Math.max(s.games.sortBest, score) : s.games.sortBest,
            quizBest: game === "quiz" ? Math.max(s.games.quizBest, score) : s.games.quizBest,
          },
        })),

      setPrefs: (patch) =>
        setState((s) => {
          const prefs = { ...s.prefs, ...patch };
          return {
            ...s,
            prefs,
            // reordena recomendações que o usuário não alterou manualmente
            items: s.items.map((i) => {
              if (!i.categoryId || !s.analyzed) return i;
              const previousBest = bestFor(i.categoryId, s.prefs)?.id;
              if (i.productId && i.productId !== previousBest) return i;
              return { ...i, productId: bestFor(i.categoryId, prefs)?.id };
            }),
          };
        }),

      verifyPurchase: () => {
        const bought = state.items.filter((i) => i.checked && i.productId);
        const source = bought.length ? bought : state.items.filter((i) => i.productId);
        const items = source.map((i) => {
          const isAligned = !!i.categoryId && bestFor(i.categoryId, state.prefs)?.id === i.productId;
          return {
            name: i.raw,
            categoryId: i.categoryId,
            productId: i.productId,
            aligned: isAligned,
            bought: true,
          };
        });
        const alignedItems = items.filter((i) => i.aligned).length;
        const others = items.length - alignedItems;
        const breakdown: { label: string; points: number }[] = [];
        if (alignedItems) breakdown.push({ label: `${alignedItems}× escolha EcoVida`, points: alignedItems * 30 });
        if (others) breakdown.push({ label: `${others}× alternativa consciente`, points: others * 20 });
        const challengeDone = alignedItems >= WEEKLY_CHALLENGE.goal;
        if (challengeDone)
          breakdown.push({ label: "Desafio da semana concluído", points: WEEKLY_CHALLENGE.reward });
        const points = breakdown.reduce((sum, b) => sum + b.points, 0);

        const purchase: Purchase = {
          id: `nf-${Date.now()}`,
          date: new Date().toISOString(),
          points,
          breakdown,
          items,
        };

        setState((s) => ({
          ...s,
          points: s.points + points,
          purchases: [purchase, ...s.purchases].slice(0, 30),
          items: [],
          analyzed: false,
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

/** Nome apresentável do produto escolhido de um item. */
export function itemProduct(item: ListItem) {
  return item.categoryId && item.productId ? findProduct(item.categoryId, item.productId) : undefined;
}

export function itemCategoryLabel(item: ListItem) {
  return item.categoryId ? categoryById(item.categoryId)?.label : undefined;
}

export function alternativesFor(item: ListItem, prefs: Prefs) {
  if (!item.categoryId) return [];
  return rankProducts(item.categoryId, prefs).filter((p) => p.id !== item.productId);
}
