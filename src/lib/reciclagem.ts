/**
 * Base local de reciclagem — sem APIs externas.
 * Usada nos jogos e nas dicas do EcoVida AI.
 * Regras baseadas na coleta seletiva brasileira (padrão CONAMA 275).
 */

export type BinId = "papel" | "plastico" | "vidro" | "metal" | "organico" | "rejeito";

export type Bin = {
  id: BinId;
  label: string;
  emoji: string;
  /** cor semântica da lixeira (token do design system) */
  tone: string;
  hint: string;
};

export const BINS: Bin[] = [
  { id: "papel", label: "Papel", emoji: "📘", tone: "bin-paper", hint: "Papel e papelão secos e limpos" },
  { id: "plastico", label: "Plástico", emoji: "🧴", tone: "bin-plastic", hint: "Embalagens, garrafas e sacolas" },
  { id: "vidro", label: "Vidro", emoji: "🫙", tone: "bin-glass", hint: "Potes e garrafas de vidro" },
  { id: "metal", label: "Metal", emoji: "🥫", tone: "bin-metal", hint: "Latas, tampas e alumínio" },
  { id: "organico", label: "Orgânico", emoji: "🍌", tone: "bin-organic", hint: "Restos de alimento e borra de café" },
  { id: "rejeito", label: "Rejeito", emoji: "🚯", tone: "bin-reject", hint: "Não reciclável na coleta comum" },
];

export const binById = (id: BinId) => BINS.find((b) => b.id === id)!;

export type SortItem = {
  id: string;
  name: string;
  emoji: string;
  bin: BinId;
  /** explicação curta mostrada após a resposta */
  why: string;
};

export const SORT_ITEMS: SortItem[] = [
  { id: "garrafa-pet", name: "Garrafa PET", emoji: "🥤", bin: "plastico", why: "PET é reciclável. Esvazie e amasse para ocupar menos espaço." },
  { id: "caixa-papelao", name: "Caixa de papelão", emoji: "📦", bin: "papel", why: "Desmonte a caixa; papelão molhado ou engordurado vira rejeito." },
  { id: "lata-milho", name: "Lata de milho", emoji: "🥫", bin: "metal", why: "Aço e alumínio são recicláveis quase infinitamente. Enxágue antes." },
  { id: "pote-vidro", name: "Pote de vidro", emoji: "🫙", bin: "vidro", why: "Vidro vai limpo e, de preferência, inteiro para evitar acidentes." },
  { id: "casca-banana", name: "Casca de banana", emoji: "🍌", bin: "organico", why: "Orgânicos rendem composto. Se puder, faça composteira em casa." },
  { id: "papel-higienico", name: "Papel higiênico usado", emoji: "🧻", bin: "rejeito", why: "Papel contaminado não é reciclável na coleta seletiva." },
  { id: "caixa-leite", name: "Caixa de leite (longa vida)", emoji: "🥛", bin: "papel", why: "Cartonada vai com os papéis: enxágue, abra e deixe secar." },
  { id: "isopor", name: "Bandeja de isopor", emoji: "🍱", bin: "plastico", why: "Isopor é plástico (EPS) e muitas cooperativas aceitam limpo." },
  { id: "borra-cafe", name: "Borra de café", emoji: "☕", bin: "organico", why: "Excelente para composto e para adubar plantas." },
  { id: "tampinha", name: "Tampinha de metal", emoji: "🔘", bin: "metal", why: "Junte as tampinhas num pote de metal para não se perderem." },
  { id: "espelho", name: "Espelho quebrado", emoji: "🪞", bin: "rejeito", why: "Espelho tem película e não derrete como vidro comum." },
  { id: "saco-arroz", name: "Embalagem de arroz", emoji: "🍚", bin: "plastico", why: "Plástico filme é reciclável quando está seco e sem resto de comida." },
  { id: "jornal", name: "Jornal", emoji: "📰", bin: "papel", why: "Papel seco e sem gordura é um dos materiais mais reaproveitados." },
  { id: "guardanapo", name: "Guardanapo sujo", emoji: "🧾", bin: "rejeito", why: "Gordura contamina a fibra do papel e inviabiliza a reciclagem." },
  { id: "garrafa-vinho", name: "Garrafa de vinho", emoji: "🍷", bin: "vidro", why: "Retire a rolha e o lacre de metal antes de descartar." },
  { id: "lata-refri", name: "Lata de refrigerante", emoji: "🥫", bin: "metal", why: "Alumínio reciclado economiza até 95% da energia de produção." },
  { id: "casca-ovo", name: "Casca de ovo", emoji: "🥚", bin: "organico", why: "Rica em cálcio, ótima triturada na composteira." },
  { id: "esponja", name: "Esponja de louça", emoji: "🧽", bin: "rejeito", why: "Mistura de materiais e resíduos de gordura: vai para rejeito." },
  { id: "pote-iogurte", name: "Pote de iogurte", emoji: "🥣", bin: "plastico", why: "Enxágue rápido evita cheiro e mantém o material reciclável." },
  { id: "revista", name: "Revista", emoji: "📖", bin: "papel", why: "Papel revestido é aceito na maioria das cooperativas." },
  { id: "cerâmica", name: "Prato de cerâmica", emoji: "🍽️", bin: "rejeito", why: "Cerâmica não é vidro: tem ponto de fusão diferente." },
  { id: "sacola", name: "Sacola plástica", emoji: "🛍️", bin: "plastico", why: "Melhor ainda: reutilize como saco de lixo antes de descartar." },
];

export type Tip = {
  id: string;
  title: string;
  text: string;
  emoji: string;
  tag: "Cozinha" | "Compras" | "Casa" | "Descarte especial";
};

export const TIPS: Tip[] = [
  {
    id: "enxaguar",
    title: "Enxágue rápido resolve",
    text: "Resto de comida contamina papel e plástico. Um enxágue de 3 segundos mantém a embalagem reciclável.",
    emoji: "💧",
    tag: "Cozinha",
  },
  {
    id: "amassar",
    title: "Amasse e ganhe espaço",
    text: "Latas e garrafas amassadas reduzem o volume da coleta e cabem mais no caminhão da cooperativa.",
    emoji: "🥫",
    tag: "Casa",
  },
  {
    id: "secar",
    title: "Seco separado de molhado",
    text: "Guarde recicláveis secos numa sacola e orgânicos em outra. É a separação que faz mais diferença no dia a dia.",
    emoji: "🧺",
    tag: "Casa",
  },
  {
    id: "compostagem",
    title: "Composteira caseira",
    text: "Cascas, borra de café e folhas viram adubo em poucas semanas. Metade do lixo doméstico é orgânico.",
    emoji: "🌱",
    tag: "Cozinha",
  },
  {
    id: "oleo",
    title: "Óleo de cozinha nunca na pia",
    text: "Um litro de óleo contamina milhares de litros de água. Guarde em garrafa PET e leve a um ponto de coleta.",
    emoji: "🛢️",
    tag: "Descarte especial",
  },
  {
    id: "pilhas",
    title: "Pilhas e eletrônicos têm ponto próprio",
    text: "Baterias, lâmpadas e eletrônicos vão para logística reversa — normalmente em mercados e lojas de eletro.",
    emoji: "🔋",
    tag: "Descarte especial",
  },
  {
    id: "menos-embalagem",
    title: "Escolha menos embalagem",
    text: "Refil, granel e pacote família geram menos resíduo por porção. É a decisão que evita lixo antes de existir.",
    emoji: "🛒",
    tag: "Compras",
  },
  {
    id: "reciclado",
    title: "Procure o símbolo de reciclado",
    text: "Embalagens com conteúdo reciclado fecham o ciclo: sua separação só vale se alguém comprar o material.",
    emoji: "♻️",
    tag: "Compras",
  },
  {
    id: "vidro-inteiro",
    title: "Vidro inteiro protege quem coleta",
    text: "Se quebrar, embrulhe em papel grosso e identifique. Segurança faz parte da reciclagem.",
    emoji: "🫙",
    tag: "Casa",
  },
  {
    id: "medicamento",
    title: "Medicamento vencido volta à farmácia",
    text: "Nunca no lixo comum nem no vaso sanitário: farmácias têm caixas de recolhimento.",
    emoji: "💊",
    tag: "Descarte especial",
  },
];

export type QuizQuestion = {
  id: string;
  statement: string;
  answer: boolean;
  explain: string;
};

/** "Mito ou verdade" — afirmações verificáveis, sem números inventados. */
export const QUIZ: QuizQuestion[] = [
  { id: "q1", statement: "Papel engordurado pode ir para a reciclagem de papel.", answer: false, explain: "Gordura contamina a fibra: o destino correto é o rejeito." },
  { id: "q2", statement: "Caixa de leite longa vida é reciclável.", answer: true, explain: "É cartonada: enxágue, abra e coloque com os papéis." },
  { id: "q3", statement: "Espelho e cerâmica vão junto com o vidro.", answer: false, explain: "Têm composição diferente e atrapalham a fundição do vidro." },
  { id: "q4", statement: "Alumínio pode ser reciclado várias vezes sem perder qualidade.", answer: true, explain: "Por isso a lata é um dos materiais mais valorizados pelas cooperativas." },
  { id: "q5", statement: "Óleo de cozinha usado pode ser jogado na pia com detergente.", answer: false, explain: "Contamina a água. Guarde numa garrafa e leve a um ponto de coleta." },
  { id: "q6", statement: "Borra de café serve para compostagem.", answer: true, explain: "Ótima fonte de nitrogênio para o composto." },
  { id: "q7", statement: "Pilhas usadas podem ir no lixo comum.", answer: false, explain: "Contêm metais pesados: devem ir para logística reversa." },
  { id: "q8", statement: "Isopor é um tipo de plástico.", answer: true, explain: "É poliestireno expandido (EPS) e pode ser reciclado quando limpo." },
  { id: "q9", statement: "Reduzir o consumo vem antes de reciclar.", answer: true, explain: "A ordem é reduzir, reutilizar e só então reciclar." },
  { id: "q10", statement: "Tampinha de plástico deve ser separada da garrafa.", answer: false, explain: "Pode ir junto; o importante é que ambas estejam limpas e secas." },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
