/**
 * "EcoVida AI" local — nenhuma API externa.
 * Interpreta o texto livre da lista, identifica categorias, organiza por seções
 * do mercado e ordena os produtos da base segundo as preferências do usuário.
 * No futuro, uma IA real pode substituir/expandir estas regras.
 */
import { categories, type Category, type Product, type Signal } from "./ecovida-data";

export type Aisle = "Mercearia" | "Bebidas" | "Laticínios" | "Padaria" | "Proteínas" | "Casa" | "Outros";

export const AISLE_ORDER: Aisle[] = [
  "Mercearia",
  "Padaria",
  "Laticínios",
  "Proteínas",
  "Bebidas",
  "Casa",
  "Outros",
];

export const AISLE_EMOJI: Record<Aisle, string> = {
  Mercearia: "🛒",
  Padaria: "🥖",
  Laticínios: "🥛",
  Proteínas: "🍗",
  Bebidas: "🥤",
  Casa: "🧴",
  Outros: "📦",
};

const GROUP_TO_AISLE: Record<Category["group"], Aisle> = {
  "Básicos": "Mercearia",
  Snacks: "Mercearia",
  Bebidas: "Bebidas",
  "Laticínios": "Laticínios",
  Padaria: "Padaria",
  "Proteínas": "Proteínas",
  Casa: "Casa",
};

export function aisleOf(categoryId?: string): Aisle {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? GROUP_TO_AISLE[cat.group] : "Outros";
}

/** Sinônimos, marcas populares e apelidos → categoria da base. */
const SYNONYMS: Record<string, string[]> = {
  arroz: ["arroz", "arroz integral", "arroz branco", "arroiz"],
  feijao: ["feijao", "feijão", "feijao preto", "feijao carioca", "feijoada"],
  macarrao: ["macarrao", "macarrão", "massa", "espaguete", "espagueti", "penne", "talharim", "miojo", "lamen"],
  molho: ["molho", "molho de tomate", "extrato de tomate", "sugo", "polpa de tomate", "passata"],
  biscoito: ["biscoito", "bolacha", "cookie", "cookies", "biscoitos", "recheado"],
  refrigerante: ["refrigerante", "coca", "coca-cola", "coca cola", "guarana", "guaraná", "soda", "refri", "pepsi"],
  suco: ["suco", "sucos", "nectar", "néctar", "suco de laranja", "suco de uva", "refresco"],
  iogurte: ["iogurte", "yogurte", "danone", "activia", "bebida lactea", "bebida láctea", "grego"],
  leite: ["leite", "leite integral", "leite desnatado", "bebida vegetal", "leite de aveia"],
  cafe: ["cafe", "café", "cafe moido", "pó de café", "capsula", "cápsula", "capsulas"],
  pao: ["pao", "pão", "paes", "pães", "pao de forma", "pão de forma", "pao frances", "pãozinho", "pão integral"],
  carne: ["carne", "bife", "picanha", "frango", "file", "filé", "linguica", "linguiça", "acem", "patinho", "coxa"],
  sabao: ["sabao", "sabão", "sabao em po", "detergente", "amaciante", "limpeza", "sabao liquido"],
};

const stripAccents = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export type Interpretation = {
  categoryId?: string;
  /** o que a IA "entendeu" — mostrado ao usuário */
  reading: string;
  confidence: "alta" | "media" | "baixa";
};

/** Interpreta um item escrito livremente. */
export function interpret(raw: string): Interpretation {
  const text = stripAccents(raw);
  if (!text) return { reading: "Item vazio", confidence: "baixa" };

  let best: { id: string; score: number; term: string } | null = null;
  for (const [id, terms] of Object.entries(SYNONYMS)) {
    for (const term of terms) {
      const t = stripAccents(term);
      let score = 0;
      if (text === t) score = 100;
      else if (text.startsWith(t + " ") || text.endsWith(" " + t)) score = 80;
      else if (text.includes(t)) score = 60 + Math.min(15, t.length);
      else if (t.includes(text) && text.length >= 4) score = 45;
      if (score && (!best || score > best.score)) best = { id, score, term };
    }
  }

  if (!best) {
    return {
      reading: "Ainda não temos produtos comparáveis nesta demonstração",
      confidence: "baixa",
    };
  }

  const cat = categories.find((c) => c.id === best!.id);
  const brandish = best.score >= 60 && best.term.length > 3 && stripAccents(cat?.label ?? "") !== stripAccents(best.term);
  return {
    categoryId: best.id,
    reading: brandish
      ? `Entendemos “${raw.trim()}” como ${cat?.label.toLowerCase()}`
      : `Categoria identificada: ${cat?.label}`,
    confidence: best.score >= 80 ? "alta" : best.score >= 60 ? "media" : "baixa",
  };
}

/** Quebra texto colado em vários itens: vírgula, ponto e vírgula, "e", linhas. */
export function splitItems(text: string): { name: string; qty: number }[] {
  return text
    .split(/[\n,;•·]+|\s+-\s+/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      // "2 leite" / "leite x2" / "3x arroz"
      const lead = s.match(/^(\d{1,2})\s*(?:x|un|unidades?)?\s+(.+)$/i);
      const trail = s.match(/^(.+?)\s*(?:x|-)\s*(\d{1,2})$/i);
      if (lead) return { name: lead[2]!.trim(), qty: Number(lead[1]) };
      if (trail) return { name: trail[1]!.trim(), qty: Number(trail[2]) };
      return { name: s, qty: 1 };
    })
    .filter((i) => i.name.length > 1)
    .slice(0, 40);
}

export type Priority = "equilibrio" | "saude" | "sustentabilidade";
export type Prefs = {
  priority: Priority;
  avoidUltraprocessed: boolean;
  preferGmoInfo: boolean;
};

export const DEFAULT_PREFS: Prefs = {
  priority: "equilibrio",
  avoidUltraprocessed: false,
  preferGmoInfo: false,
};

const signalScore: Record<Signal, number> = { good: 2, neutral: 1, unknown: 0 };

/** Pontua um produto conforme as preferências declaradas. */
export function scoreProduct(product: Product, prefs: Prefs): number {
  const n = signalScore[product.nutrition.level];
  const e = signalScore[product.environment.level];
  const g = signalScore[product.gmo.level];

  let wN = 1;
  let wE = 1;
  if (prefs.priority === "saude") wN = 1.8;
  if (prefs.priority === "sustentabilidade") wE = 1.8;

  let score = n * wN + e * wE + g * 0.4;
  if (prefs.avoidUltraprocessed) {
    const text = `${product.nutrition.label} ${product.nutrition.detail}`.toLowerCase();
    if (/processad|recheio|tempero pronto|aromas|corantes|adoçantes/.test(text)) score -= 1.2;
    if ((product.highlights.join(" ") + " " + product.name).match(/instant|capsul|pronto|recheado/i)) score -= 0.6;
  }
  if (prefs.preferGmoInfo && product.gmo.level !== "good") score -= 0.8;
  return score;
}

/** Produtos da categoria em ordem de recomendação para estas preferências. */
export function rankProducts(categoryId: string, prefs: Prefs): Product[] {
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return [];
  return [...cat.products].sort((a, b) => scoreProduct(b, prefs) - scoreProduct(a, prefs));
}

export function bestFor(categoryId: string, prefs: Prefs): Product | undefined {
  return rankProducts(categoryId, prefs)[0];
}

/** Explicação curta e honesta, baseada apenas nos indicadores da base. */
export function explain(product: Product, prefs: Prefs, comparedCount: number): string {
  const reasons: string[] = [];
  if (product.nutrition.level === "good") reasons.push("composição nutricional mais simples");
  if (product.environment.level === "good") reasons.push("melhores indicadores de embalagem/origem disponíveis");
  if (product.gmo.level === "good") reasons.push("informação sobre transgênicos publicada");
  const focus =
    prefs.priority === "saude"
      ? "Considerando sua prioridade em saúde, "
      : prefs.priority === "sustentabilidade"
        ? "Considerando sua prioridade em sustentabilidade, "
        : "";
  const base = reasons.length
    ? `entre ${comparedCount} opções comparadas, esta apresentou ${reasons.join(", ")}.`
    : `entre ${comparedCount} opções comparadas, esta foi a que reuniu mais informação disponível para comparação.`;
  return `${focus}${focus ? base : base.charAt(0).toUpperCase() + base.slice(1)}`;
}

export const analysisSteps = [
  "Lendo sua lista",
  "Organizando os itens",
  "Identificando categorias",
  "Comparando alternativas",
  "Preparando recomendações",
];

/** Sugestões rápidas opcionais (nunca limitação). */
export const quickSuggestions = categories.map((c) => ({ label: c.label, emoji: c.emoji }));
