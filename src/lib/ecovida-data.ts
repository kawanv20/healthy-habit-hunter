/**
 * Dados de DEMONSTRAÇÃO do EcoVida AI.
 * Marcas fictícias e avaliações qualitativas ilustrativas — não são dados reais
 * de rótulos, nem métricas ambientais medidas.
 */

export type Signal = "good" | "neutral" | "unknown";

export type ProductDetails = {
  /** tamanho/quantidade da embalagem (demonstração) */
  size?: string;
  ingredients?: string;
  /** rótulos relevantes para a categoria, sem inventar números precisos */
  labelNotes?: { label: string; value: string }[];
  sourceNote?: string;
};

export type Product = {
  id: string;
  brand: string;
  name: string;
  emoji: string;
  /** foto real da embalagem (quando disponível) */
  image?: string;
  /** avaliação qualitativa de nutrição */
  nutrition: { level: Signal; label: string; detail: string };
  /** avaliação qualitativa ambiental */
  environment: { level: Signal; label: string; detail: string };
  /** informação sobre transgênicos (informativo, não julgamento) */
  gmo: { level: Signal; label: string };
  highlights: string[];
  why: string;
};

export type Category = {
  id: string;
  label: string;
  emoji: string;
  group: "Básicos" | "Bebidas" | "Laticínios" | "Snacks" | "Padaria" | "Proteínas" | "Casa";
  products: Product[];
};


const p = (
  id: string,
  brand: string,
  name: string,
  emoji: string,
  nutrition: Product["nutrition"],
  environment: Product["environment"],
  gmo: Product["gmo"],
  highlights: string[],
  why: string,
): Product => ({ id, brand, name, emoji, nutrition, environment, gmo, highlights, why });

export const categories: Category[] = [
  {
    id: "arroz",
    label: "Arroz",
    emoji: "🍚",
    group: "Básicos",
    products: [
      p(
        "arroz-1",
        "Vale Verde",
        "Arroz integral tipo 1",
        "🍚",
        { level: "good", label: "Boa opção nutricional", detail: "Grão integral: mais fibras que a versão polida." },
        { level: "good", label: "Bom indicador ambiental", detail: "Embalagem monomaterial reciclável e origem declarada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Integral", "Fibras", "Origem declarada"],
        "Dentro da mesma necessidade (arroz), a versão integral mantém mais fibras e a marca publica informações de origem e embalagem — por isso aparece como escolha EcoVida na demonstração.",
      ),
      p(
        "arroz-2",
        "Campo Claro",
        "Arroz parboilizado",
        "🍚",
        { level: "neutral", label: "Opção intermediária", detail: "Retém parte dos nutrientes no processo de parboilização." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Informações de cadeia produtiva incompletas." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Parboilizado", "Cozimento rápido"],
        "Alternativa equilibrada, com menos informação pública disponível sobre a cadeia produtiva.",
      ),
      p(
        "arroz-3",
        "Sol da Ilha",
        "Arroz branco tipo 1",
        "🍚",
        { level: "neutral", label: "Base neutra do prato", detail: "Grão polido: menos fibras que o integral." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "A marca não divulga informações ambientais." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Clássico", "Versátil"],
        "Escolha tradicional. Não é uma opção “ruim”, apenas tem menos fibras e menos dados publicados.",
      ),
    ],
  },
  {
    id: "macarrao",
    label: "Macarrão",
    emoji: "🍝",
    group: "Básicos",
    products: [
      p(
        "mac-1",
        "Grano Puro",
        "Espaguete de grão duro integral",
        "🍝",
        { level: "good", label: "Boa opção nutricional", detail: "Farinha integral, lista curta de ingredientes." },
        { level: "good", label: "Bom indicador ambiental", detail: "Embalagem de papel e política ambiental publicada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Integral", "2 ingredientes", "Embalagem de papel"],
        "Mesma função na despensa, com farinha integral e embalagem de papel — e a marca disponibiliza informações que permitem comparação.",
      ),
      p(
        "mac-2",
        "Casa Nostra",
        "Penne sêmola de trigo",
        "🍝",
        { level: "neutral", label: "Opção intermediária", detail: "Sêmola refinada, sem aditivos adicionais." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Embalagem plástica reciclável." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Sem aditivos", "Reciclável"],
        "Boa alternativa se a preferência for massa refinada tradicional.",
      ),
      p(
        "mac-3",
        "Rápido&Bom",
        "Macarrão instantâneo sabor legumes",
        "🍝",
        { level: "neutral", label: "Atenção ao sódio", detail: "Temperos prontos costumam elevar o sódio da porção." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Embalagem multicamada dificulta reciclagem." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Preparo rápido"],
        "Útil pela praticidade; entre as opções analisadas é a que traz mais tempero pronto e menos informação disponível.",
      ),
    ],
  },
  {
    id: "molho",
    label: "Molho de tomate",
    emoji: "🍅",
    group: "Básicos",
    products: [
      p(
        "molho-1",
        "Horta Nova",
        "Molho de tomate tradicional",
        "🍅",
        { level: "good", label: "Boa opção nutricional", detail: "Sem açúcar adicionado na lista de ingredientes." },
        { level: "good", label: "Bom indicador ambiental", detail: "Vidro retornável e informações de origem do tomate." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Sem açúcar adicionado", "Vidro", "Ingredientes simples"],
        "Entre os molhos analisados, tem a lista de ingredientes mais curta, sem açúcar adicionado, e vem em vidro — material com melhor cenário de reciclagem.",
      ),
      p(
        "molho-2",
        "Della Villa",
        "Molho com manjericão",
        "🍅",
        { level: "neutral", label: "Opção intermediária", detail: "Contém açúcar em pequena quantidade." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Sachê laminado, reciclagem limitada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Manjericão", "Prático"],
        "Sabor mais temperado; a embalagem tem reciclagem mais difícil que o vidro.",
      ),
      p(
        "molho-3",
        "Pomodoro Já",
        "Molho pronto sabor carne",
        "🍅",
        { level: "neutral", label: "Atenção ao sódio", detail: "Molhos prontos com tempero costumam ter mais sódio." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Sem informações públicas de cadeia produtiva." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Pronto para usar"],
        "Alternativa prática, com menos informação disponível para comparar.",
      ),
    ],
  },
  {
    id: "biscoito",
    label: "Biscoito",
    emoji: "🍪",
    group: "Snacks",
    products: [
      p(
        "bis-1",
        "Casa da Aveia",
        "Biscoito de aveia e castanha",
        "🍪",
        { level: "good", label: "Boa opção nutricional", detail: "Menos açúcar por porção e presença de fibras." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Embalagem reciclável, sem dados de emissões." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Aveia", "Menos açúcar", "Fibras"],
        "Dentro da mesma vontade (biscoito), esta opção tem menos açúcar por porção e traz fibras — sem prometer que biscoito seja “saudável”.",
      ),
      p(
        "bis-2",
        "Doce Hora",
        "Biscoito maisena",
        "🍪",
        { level: "neutral", label: "Opção intermediária", detail: "Receita simples, açúcar moderado." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Embalagem plástica simples." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Clássico", "Receita simples"],
        "Escolha tradicional e equilibrada entre as alternativas.",
      ),
      p(
        "bis-3",
        "Choco Mania",
        "Biscoito recheado chocolate",
        "🍪",
        { level: "neutral", label: "Mais açúcar e gordura", detail: "Recheios elevam açúcar e gorduras da porção." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Embalagem multicamada." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Recheado"],
        "Se a ideia é indulgência, é uma opção; só concentra mais açúcar e gordura que as outras.",
      ),
    ],
  },
  {
    id: "refrigerante",
    label: "Refrigerante",
    emoji: "🥤",
    group: "Bebidas",
    products: [
      p(
        "ref-1",
        "Serra Fria",
        "Guaraná com menos açúcar",
        "🥤",
        { level: "neutral", label: "Menos açúcar que os similares", detail: "Refrigerante segue sendo bebida açucarada." },
        { level: "good", label: "Bom indicador ambiental", detail: "Garrafa de vidro retornável." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Retornável", "Menos açúcar"],
        "Não recomendamos “parar de tomar refrigerante”: entre as opções, esta tem menos açúcar e embalagem retornável.",
      ),
      p(
        "ref-2",
        "Bolha Cítrica",
        "Limão zero açúcar",
        "🥤",
        { level: "neutral", label: "Sem açúcar, com adoçantes", detail: "Contém adoçantes; leia se houver restrição." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "PET reciclável." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Zero açúcar", "PET reciclável"],
        "Alternativa para quem prefere evitar açúcar e não tem restrição a adoçantes.",
      ),
      p(
        "ref-3",
        "Cola Real",
        "Cola tradicional 2L",
        "🥤",
        { level: "neutral", label: "Alto teor de açúcar", detail: "Porção grande concentra bastante açúcar." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Sem informações públicas." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Formato família"],
        "Opção conhecida; é a que concentra mais açúcar entre as três.",
      ),
    ],
  },
  {
    id: "suco",
    label: "Suco",
    emoji: "🧃",
    group: "Bebidas",
    products: [
      p(
        "suco-1",
        "Pomar do Vale",
        "Suco integral de uva",
        "🧃",
        { level: "good", label: "Boa opção nutricional", detail: "Integral, sem açúcar adicionado." },
        { level: "good", label: "Bom indicador ambiental", detail: "Vidro e origem da fruta declarada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Integral", "Sem açúcar adicionado", "Vidro"],
        "É suco de fruta sem açúcar adicionado, em vidro, com origem declarada — o conjunto mais informado entre as opções.",
      ),
      p(
        "suco-2",
        "Frutta Dia",
        "Néctar de laranja",
        "🧃",
        { level: "neutral", label: "Contém açúcar adicionado", detail: "Néctares levam água e açúcar." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Cartonada com camadas mistas." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Prático", "1L"],
        "Alternativa acessível para o dia a dia.",
      ),
      p(
        "suco-3",
        "Refresca+",
        "Refresco em pó sabor uva",
        "🧃",
        { level: "neutral", label: "Muito processado", detail: "Baseado em aromas, corantes e adoçantes." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Sachê laminado." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Rende muito"],
        "Rende bastante, porém é a opção mais distante de suco de fruta.",
      ),
    ],
  },
  {
    id: "iogurte",
    label: "Iogurte",
    emoji: "🥛",
    group: "Laticínios",
    products: [
      p(
        "iog-1",
        "Fazenda Luz",
        "Iogurte natural integral",
        "🥛",
        { level: "good", label: "Boa opção nutricional", detail: "Sem açúcar adicionado; dois ingredientes." },
        { level: "good", label: "Bom indicador ambiental", detail: "Pote monomaterial e leite de origem declarada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Natural", "2 ingredientes", "Sem açúcar adicionado"],
        "Base neutra que você adoça como quiser, com a lista de ingredientes mais curta do grupo.",
      ),
      p(
        "iog-2",
        "Vita Grego",
        "Iogurte grego morango",
        "🥛",
        { level: "neutral", label: "Mais proteína, mais açúcar", detail: "Versão com fruta leva açúcar adicionado." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Pote plástico reciclável." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Proteína", "Cremoso"],
        "Boa alternativa se busca cremosidade e proteína.",
      ),
      p(
        "iog-3",
        "Kids Frutinha",
        "Bebida láctea infantil",
        "🥛",
        { level: "neutral", label: "Bebida láctea adoçada", detail: "Menos leite e mais açúcar que iogurtes." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Frascos pequenos, mais embalagem por porção." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Porção individual"],
        "Prático para lancheira; concentra mais açúcar e embalagem por porção.",
      ),
    ],
  },
  {
    id: "leite",
    label: "Leite",
    emoji: "🍼",
    group: "Laticínios",
    products: [
      p(
        "leite-1",
        "Fazenda Luz",
        "Leite integral UHT",
        "🍼",
        { level: "good", label: "Boa opção nutricional", detail: "Ingrediente único: leite." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Cartonada reciclável; origem declarada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Ingrediente único", "Origem declarada"],
        "Leite simples, com rastreabilidade divulgada pela marca.",
      ),
      p(
        "leite-2",
        "Aurora Campo",
        "Leite semidesnatado",
        "🍼",
        { level: "neutral", label: "Menos gordura", detail: "Boa escolha para quem quer reduzir gordura." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Sem dados de emissões publicados." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Menos gordura"],
        "Alternativa para quem prefere versão mais leve.",
      ),
      p(
        "leite-3",
        "Planta Boa",
        "Bebida de aveia sem açúcar",
        "🍼",
        { level: "neutral", label: "Perfil diferente do leite", detail: "Menos proteína; verifique se é fortificada." },
        { level: "good", label: "Bom indicador ambiental", detail: "Cadeia vegetal com menor pressão sobre recursos." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Vegetal", "Sem açúcar"],
        "Boa opção se a preferência é vegetal — só lembre que o perfil nutricional não é equivalente ao leite.",
      ),
    ],
  },
  {
    id: "cafe",
    label: "Café",
    emoji: "☕",
    group: "Básicos",
    products: [
      p(
        "cafe-1",
        "Serra do Grão",
        "Café 100% arábica torrado e moído",
        "☕",
        { level: "good", label: "Boa opção nutricional", detail: "Puro, sem misturas nem aditivos." },
        { level: "good", label: "Bom indicador ambiental", detail: "Origem por região e certificação declarada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["100% arábica", "Origem por região"],
        "Café puro com informação de origem — permite comparação melhor que blends sem rastreio.",
      ),
      p(
        "cafe-2",
        "Manhã Boa",
        "Café tradicional",
        "☕",
        { level: "neutral", label: "Blend tradicional", detail: "Mistura de grãos, sem detalhamento." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Embalagem laminada." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Blend", "Sabor intenso"],
        "Alternativa acessível para o consumo diário.",
      ),
      p(
        "cafe-3",
        "Cápsula Prime",
        "Cápsulas intenso",
        "☕",
        { level: "neutral", label: "Café puro em cápsula", detail: "Sem diferença nutricional relevante." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Cápsulas geram mais resíduo por dose." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Praticidade"],
        "Muito prático; gera mais resíduo por dose que café moído.",
      ),
    ],
  },
  {
    id: "feijao",
    label: "Feijão",
    emoji: "🫘",
    group: "Básicos",
    products: [
      p(
        "fei-1",
        "Vale Verde",
        "Feijão carioca tipo 1",
        "🫘",
        { level: "good", label: "Boa opção nutricional", detail: "Fonte de fibras e proteína vegetal." },
        { level: "good", label: "Bom indicador ambiental", detail: "Cultura de baixa pressão e origem declarada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Fibras", "Proteína vegetal"],
        "Grão seco, sem processamento adicional, com origem declarada pela marca.",
      ),
      p(
        "fei-2",
        "Panela Cheia",
        "Feijão preto em conserva",
        "🫘",
        { level: "neutral", label: "Atenção ao sódio", detail: "Conservas costumam ter sal adicionado." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Lata reciclável." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Pronto", "Lata reciclável"],
        "Boa saída para dias sem tempo de cozinhar.",
      ),
      p(
        "fei-3",
        "Tempero Rio",
        "Feijoada pronta",
        "🫘",
        { level: "neutral", label: "Prato processado", detail: "Carnes processadas elevam sódio e gorduras." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Sem informações publicadas." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Refeição completa"],
        "Refeição completa em minutos, com mais sódio entre as opções.",
      ),
    ],
  },
  {
    id: "pao",
    label: "Pão",
    emoji: "🍞",
    group: "Padaria",
    products: [
      p(
        "pao-1",
        "Forno da Vila",
        "Pão integral fermentação natural",
        "🍞",
        { level: "good", label: "Boa opção nutricional", detail: "Farinha integral e lista curta de ingredientes." },
        { level: "good", label: "Bom indicador ambiental", detail: "Embalagem de papel e produção local declarada." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["Integral", "Fermentação natural", "Papel"],
        "Entre os pães comparados, tem a lista de ingredientes mais curta e farinha integral, com embalagem de papel.",
      ),
      p(
        "pao-2",
        "Grão Diário",
        "Pão de forma tradicional",
        "🍞",
        { level: "neutral", label: "Opção intermediária", detail: "Farinha refinada com açúcar em pequena quantidade." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Embalagem plástica reciclável." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Clássico", "Fatias uniformes"],
        "Alternativa tradicional, prática para o dia a dia.",
      ),
      p(
        "pao-3",
        "Sabor Doce",
        "Pão doce industrializado",
        "🍞",
        { level: "neutral", label: "Mais açúcar por porção", detail: "Receita doce concentra mais açúcar." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Embalagem multicamada." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Sabor adocicado"],
        "Opção de indulgência; concentra mais açúcar que os outros pães comparados.",
      ),
    ],
  },
  {
    id: "carne",
    label: "Carne",
    emoji: "🥩",
    group: "Proteínas",
    products: [
      p(
        "carne-1",
        "Campo Aberto",
        "Corte bovino com origem rastreada",
        "🥩",
        { level: "good", label: "Proteína sem processamento", detail: "Corte in natura, sem aditivos." },
        { level: "good", label: "Bom indicador ambiental", detail: "Marca publica rastreabilidade da origem." },
        { level: "good", label: "Informação sobre transgênicos disponível" },
        ["In natura", "Origem rastreada"],
        "Entre as opções analisadas, é a única in natura com rastreabilidade publicada pela marca.",
      ),
      p(
        "carne-2",
        "Casa Grill",
        "Frango em cortes congelados",
        "🍗",
        { level: "good", label: "Proteína magra", detail: "Corte simples, sem tempero adicionado." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Sem dados publicados de cadeia produtiva." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Sem tempero", "Prático"],
        "Boa alternativa de proteína, com menos informação disponível sobre a cadeia.",
      ),
      p(
        "carne-3",
        "Rápido Sabor",
        "Linguiça temperada",
        "🌭",
        { level: "neutral", label: "Carne processada", detail: "Processados costumam ter mais sódio e aditivos." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Sem informações públicas." },
        { level: "unknown", label: "Sem informação sobre transgênicos" },
        ["Pronta para grelhar"],
        "Prática, porém é a opção mais processada entre as comparadas.",
      ),
    ],
  },
  {
    id: "sabao",
    label: "Sabão / limpeza",
    emoji: "🧼",
    group: "Casa",
    products: [
      p(
        "sab-1",
        "Casa Limpa",
        "Sabão em pó concentrado refil",
        "🧼",
        { level: "unknown", label: "Não se aplica (produto de limpeza)", detail: "Indicadores nutricionais não se aplicam." },
        { level: "good", label: "Bom indicador ambiental", detail: "Refil concentrado usa menos embalagem por lavagem." },
        { level: "unknown", label: "Não se aplica" },
        ["Refil", "Concentrado"],
        "Formato refil concentrado reduz embalagem por uso em comparação às demais opções analisadas.",
      ),
      p(
        "sab-2",
        "Brilho Puro",
        "Sabão em barra vegetal",
        "🧼",
        { level: "unknown", label: "Não se aplica (produto de limpeza)", detail: "Indicadores nutricionais não se aplicam." },
        { level: "neutral", label: "Indicador ambiental parcial", detail: "Embalagem de papel; sem dados de formulação." },
        { level: "unknown", label: "Não se aplica" },
        ["Barra", "Embalagem de papel"],
        "Alternativa simples com embalagem de papel.",
      ),
      p(
        "sab-3",
        "Espuma Max",
        "Sabão líquido garrafa 3L",
        "🧼",
        { level: "unknown", label: "Não se aplica (produto de limpeza)", detail: "Indicadores nutricionais não se aplicam." },
        { level: "unknown", label: "Dados ambientais não disponíveis", detail: "Sem informações publicadas." },
        { level: "unknown", label: "Não se aplica" },
        ["Líquido", "Rende muitas lavagens"],
        "Formato prático, com mais plástico por lavagem entre as opções comparadas.",
      ),
    ],
  },
];


export const categoryById = (id: string) => categories.find((c) => c.id === id);

export const findProduct = (categoryId: string, productId: string) =>
  categoryById(categoryId)?.products.find((pr) => pr.id === productId);

/** Ordem de recomendação: 1º é a "Escolha EcoVida" da demonstração. */
export const recommendedFor = (categoryId: string) => categoryById(categoryId)?.products[0];
