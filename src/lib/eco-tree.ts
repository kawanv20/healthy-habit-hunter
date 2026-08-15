/**
 * Árvore EcoVida — representação VISUAL do progresso do usuário dentro do app.
 * Importante: não representa compensação real de CO₂, água ou impacto ambiental.
 * A árvore já começa formada e bonita; cada nível a torna mais exuberante.
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
  { id: "jovem", name: "Árvore jovem", emoji: "🌿", min: 0, blurb: "Sua árvore já nasceu forte, com copa verde e raízes firmes." },
  { id: "viva", name: "Árvore viva", emoji: "🌳", min: 1, blurb: "A copa encheu e o vento passa entre as folhas." },
  { id: "florida", name: "Árvore florida", emoji: "🌸", min: 3, blurb: "Flores discretas abriram entre os galhos." },
  { id: "frutifera", name: "Árvore frutífera", emoji: "🍃", min: 6, blurb: "Frutos e visitantes começam a aparecer." },
  { id: "bosque", name: "Bosque", emoji: "🌲", min: 11, blurb: "Vegetação nova cresceu ao redor da sua árvore." },
  { id: "ecossistema", name: "Ecossistema", emoji: "🌎", min: 18, blurb: "Um ambiente completo e vivo cresceu ao seu redor." },
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
