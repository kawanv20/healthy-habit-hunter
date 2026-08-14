/**
 * Árvore EcoVida — representação VISUAL do progresso do usuário dentro do app.
 * Importante: não representa compensação real de CO₂, água ou impacto ambiental.
 */

export type TreeStage = {
  id: string;
  name: string;
  emoji: string;
  /** escolhas EcoVida confirmadas necessárias */
  min: number;
  blurb: string;
};

export const TREE_STAGES: TreeStage[] = [
  { id: "semente", name: "Semente", emoji: "🌰", min: 0, blurb: "Tudo começa com uma primeira escolha consciente." },
  { id: "broto", name: "Broto", emoji: "🌱", min: 1, blurb: "Suas primeiras folhas apareceram." },
  { id: "muda", name: "Muda", emoji: "🌿", min: 3, blurb: "O cenário começa a ganhar vida." },
  { id: "jovem", name: "Árvore jovem", emoji: "🪴", min: 6, blurb: "A copa cresceu e o vento passa entre as folhas." },
  { id: "viva", name: "Árvore viva", emoji: "🌳", min: 11, blurb: "Folhas em movimento, flores e visitantes discretos." },
  { id: "ecossistema", name: "Ecossistema", emoji: "🌎", min: 18, blurb: "Um ambiente completo cresceu ao seu redor." },
];

export type TreeState = {
  index: number;
  stage: TreeStage;
  next: TreeStage | null;
  /** 0–100 até o próximo estágio */
  progress: number;
  /** escolhas restantes para evoluir */
  remaining: number;
  count: number;
};

export function treeStateFor(count: number): TreeState {
  const index = TREE_STAGES.reduce((acc, s, i) => (count >= s.min ? i : acc), 0);
  const stage = TREE_STAGES[index]!;
  const next = TREE_STAGES[index + 1] ?? null;
  const progress = next
    ? Math.min(100, Math.max(0, ((count - stage.min) / (next.min - stage.min)) * 100))
    : 100;
  return {
    index,
    stage,
    next,
    progress,
    remaining: next ? Math.max(0, next.min - count) : 0,
    count,
  };
}
