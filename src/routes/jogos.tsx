import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Gamepad2,
  Lightbulb,
  Recycle,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { AppShell, DemoNote, PageHeader } from "@/components/eco/AppShell";
import { useEco } from "@/lib/ecovida-store";
import {
  BINS,
  QUIZ,
  SORT_ITEMS,
  TIPS,
  binById,
  shuffle,
  type BinId,
  type SortItem,
  type Tip,
} from "@/lib/reciclagem";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jogos")({
  head: () => ({
    meta: [
      { title: "Jogos EcoVida — Separe o reciclável e aprenda" },
      {
        name: "description",
        content:
          "Treine a separação do lixo, teste mitos da reciclagem e leia dicas práticas para gerar menos resíduo — ganhando M Points no EcoVida AI.",
      },
      { property: "og:title", content: "Jogos EcoVida — Separe o reciclável e aprenda" },
      {
        property: "og:description",
        content: "Jogo de separação de recicláveis, quiz mito ou verdade e dicas práticas de reciclagem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JogosPage,
});

type Tab = "separar" | "quiz" | "dicas";

const TABS: { id: Tab; label: string; icon: typeof Recycle }[] = [
  { id: "separar", label: "Separar", icon: Recycle },
  { id: "quiz", label: "Mito ou verdade", icon: Sparkles },
  { id: "dicas", label: "Dicas", icon: Lightbulb },
];

const BIN_BG: Record<BinId, string> = {
  papel: "bg-bin-paper/15 text-bin-paper ring-bin-paper/30",
  plastico: "bg-bin-plastic/15 text-bin-plastic ring-bin-plastic/30",
  vidro: "bg-bin-glass/15 text-bin-glass ring-bin-glass/30",
  metal: "bg-bin-metal/20 text-bin-metal ring-bin-metal/35",
  organico: "bg-bin-organic/15 text-bin-organic ring-bin-organic/30",
  rejeito: "bg-bin-reject/15 text-bin-reject ring-bin-reject/30",
};

function JogosPage() {
  const [tab, setTab] = useState<Tab>("separar");
  const { games } = useEco();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Jogos EcoVida"
        title="Aprenda reciclando"
        subtitle="Três minutos por dia bastam para acertar o descarte de quase tudo que sai da sua compra."
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
            <Gamepad2 className="size-3.5" /> {games.plays}
          </span>
        }
      />

      <div className="mt-5 px-5 md:px-8">
        <div className="flex gap-1.5 rounded-3xl border border-border/70 bg-card p-1.5 shadow-soft">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-xs font-semibold transition-all",
                tab === id
                  ? "bg-eco-gradient text-leaf-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div key={tab} className="animate-eco-pop">
        {tab === "separar" && <SortGame />}
        {tab === "quiz" && <QuizGame />}
        {tab === "dicas" && <TipsDeck />}
      </div>
    </AppShell>
  );
}

/* ============================ Jogo: Separar ============================ */

const ROUND_SIZE = 10;

function SortGame() {
  const { games, finishGame } = useEco();
  const [deck, setDeck] = useState<SortItem[]>(() => shuffle(SORT_ITEMS).slice(0, ROUND_SIZE));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<BinId | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const rewarded = useRef(false);

  const item = deck[index];

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [done]);

  const points = correct * 4 + bestStreak * 2;

  useEffect(() => {
    if (done && !rewarded.current) {
      rewarded.current = true;
      finishGame("sort", correct, points);
    }
  }, [done, correct, points, finishGame]);

  const restart = () => {
    setDeck(shuffle(SORT_ITEMS).slice(0, ROUND_SIZE));
    setIndex(0);
    setAnswer(null);
    setCorrect(0);
    setStreak(0);
    setBestStreak(0);
    setSeconds(0);
    setDone(false);
    rewarded.current = false;
  };

  const pick = (bin: BinId) => {
    if (answer || !item) return;
    setAnswer(bin);
    if (bin === item.bin) {
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setAnswer(null);
    if (index + 1 >= deck.length) setDone(true);
    else setIndex((i) => i + 1);
  };

  if (done) {
    return (
      <section className="px-5 pt-5 md:px-8">
        <div className="animate-eco-pop overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lift">
          <div className="bg-eco-gradient px-6 py-8 text-center text-leaf-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-85">Rodada concluída</p>
            <p className="mt-2 font-display text-5xl font-semibold">
              {correct}
              <span className="text-2xl opacity-80">/{deck.length}</span>
            </p>
            <p className="mt-1 text-sm opacity-90">Melhor sequência: {bestStreak} seguidas</p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-5">
            <Stat label="M Points ganhos" value={`+${points}`} />
            <Stat label="Tempo" value={`${seconds}s`} />
            <Stat label="Seu recorde" value={`${Math.max(games.sortBest, correct)}/${ROUND_SIZE}`} />
            <Stat label="Precisão" value={`${Math.round((correct / deck.length) * 100)}%`} />
          </div>
          <div className="px-5 pb-5">
            <button
              onClick={restart}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              <RotateCcw className="size-4" /> Jogar outra rodada
            </button>
          </div>
        </div>
        <DemoNote>
          Os M Points dos jogos são recompensas virtuais de demonstração e não representam
          compensação ambiental real.
        </DemoNote>
      </section>
    );
  }

  if (!item) return null;
  const isRight = answer === item.bin;

  return (
    <section className="px-5 pt-5 md:px-8">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted-foreground">
        <span>
          Item {index + 1} de {deck.length}
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-leaf">
            <Trophy className="size-3.5" /> {correct}
          </span>
          {streak > 1 && (
            <span className="rounded-full bg-sun/25 px-2 py-0.5 text-sun-foreground">🔥 {streak}</span>
          )}
          <span className="inline-flex items-center gap-1">
            <Timer className="size-3.5" /> {seconds}s
          </span>
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-eco-gradient transition-all duration-500"
          style={{ width: `${(index / deck.length) * 100}%` }}
        />
      </div>

      <div
        key={item.id}
        className={cn(
          "mt-4 rounded-3xl border border-border/70 bg-surface-gradient p-6 text-center shadow-soft",
          answer && !isRight && "animate-eco-shake",
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
          Onde este item vai?
        </p>
        <p className="mt-3 text-6xl leading-none">{item.emoji}</p>
        <p className="mt-3 font-display text-xl font-semibold">{item.name}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {BINS.map((bin) => {
          const chosen = answer === bin.id;
          const reveal = !!answer && bin.id === item.bin;
          return (
            <button
              key={bin.id}
              onClick={() => pick(bin.id)}
              disabled={!!answer}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-3xl px-2 py-3.5 text-[11px] font-semibold ring-1 transition-all active:scale-95",
                BIN_BG[bin.id],
                reveal && "ring-2 ring-leaf",
                chosen && !reveal && "opacity-50 ring-destructive",
                answer && !chosen && !reveal && "opacity-45",
              )}
            >
              <span className="text-2xl leading-none">{bin.emoji}</span>
              <span className="truncate">{bin.label}</span>
            </button>
          );
        })}
      </div>

      {answer ? (
        <div className="animate-eco-pop mt-4 rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
          <p
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold",
              isRight ? "text-leaf" : "text-destructive",
            )}
          >
            {isRight ? <Check className="size-4" /> : <X className="size-4" />}
            {isRight ? "Isso mesmo!" : `Vai em ${binById(item.bin).label}`}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.why}</p>
          <button
            onClick={next}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {index + 1 >= deck.length ? "Ver resultado" : "Próximo item"}{" "}
            <ArrowRight className="size-4" />
          </button>
        </div>
      ) : (
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
          Dica: embalagem limpa e seca é reciclável; suja com comida, normalmente vira rejeito.
        </p>
      )}
      <div className="h-4" />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/50 px-4 py-3">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

/* ============================= Jogo: Quiz ============================= */

const QUIZ_SIZE = 8;

function QuizGame() {
  const { games, finishGame } = useEco();
  const [deck, setDeck] = useState(() => shuffle(QUIZ).slice(0, QUIZ_SIZE));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const rewarded = useRef(false);

  const q = deck[index];
  const points = correct * 5;

  useEffect(() => {
    if (done && !rewarded.current) {
      rewarded.current = true;
      finishGame("quiz", correct, points);
    }
  }, [done, correct, points, finishGame]);

  const restart = () => {
    setDeck(shuffle(QUIZ).slice(0, QUIZ_SIZE));
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setDone(false);
    rewarded.current = false;
  };

  if (done) {
    return (
      <section className="px-5 pt-5 md:px-8">
        <div className="animate-eco-pop rounded-3xl border border-border/70 bg-card p-6 text-center shadow-lift">
          <p className="text-5xl">{correct >= deck.length - 1 ? "🌎" : correct >= deck.length / 2 ? "🌿" : "🌱"}</p>
          <p className="mt-3 font-display text-2xl font-semibold">
            {correct} de {deck.length} certas
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            +{points} M Points · recorde {Math.max(games.quizBest, correct)}/{QUIZ_SIZE}
          </p>
          <button
            onClick={restart}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <RotateCcw className="size-4" /> Novas afirmações
          </button>
        </div>
      </section>
    );
  }

  if (!q) return null;
  const isRight = picked === q.answer;

  return (
    <section className="px-5 pt-5 md:px-8">
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-eco-gradient transition-all duration-500"
          style={{ width: `${(index / deck.length) * 100}%` }}
        />
      </div>
      <div key={q.id} className="mt-4 rounded-3xl border border-border/70 bg-surface-gradient p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
          Afirmação {index + 1}/{deck.length}
        </p>
        <p className="mt-3 text-balance-tight font-display text-xl font-semibold leading-snug">
          {q.statement}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[true, false].map((val) => (
          <button
            key={String(val)}
            disabled={picked !== null}
            onClick={() => {
              setPicked(val);
              if (val === q.answer) setCorrect((c) => c + 1);
            }}
            className={cn(
              "rounded-3xl px-4 py-4 text-sm font-semibold ring-1 ring-border/70 transition-all active:scale-95",
              picked === null && "bg-card hover:bg-muted",
              picked !== null && val === q.answer && "bg-leaf/15 text-leaf ring-leaf/40",
              picked !== null && val !== q.answer && "bg-muted/40 text-muted-foreground",
            )}
          >
            {val ? "✅ Verdade" : "❌ Mito"}
          </button>
        ))}
      </div>

      {picked !== null && (
        <div className="animate-eco-pop mt-4 rounded-3xl border border-border/70 bg-card p-4 shadow-soft">
          <p className={cn("text-sm font-semibold", isRight ? "text-leaf" : "text-destructive")}>
            {isRight ? "Você acertou" : "Quase — veja o porquê"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{q.explain}</p>
          <button
            onClick={() => {
              setPicked(null);
              if (index + 1 >= deck.length) setDone(true);
              else setIndex((i) => i + 1);
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {index + 1 >= deck.length ? "Ver resultado" : "Continuar"} <ArrowRight className="size-4" />
          </button>
        </div>
      )}
      <div className="h-4" />
    </section>
  );
}

/* ============================== Dicas ============================== */

const TAGS = ["Todas", "Cozinha", "Compras", "Casa", "Descarte especial"] as const;

function TipsDeck() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("Todas");
  const list = useMemo<Tip[]>(
    () => (tag === "Todas" ? TIPS : TIPS.filter((t) => t.tag === tag)),
    [tag],
  );

  return (
    <section className="px-5 pt-5 md:px-8">
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
              tag === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {list.map((tip, i) => (
          <article
            key={tip.id}
            className="animate-eco-pop rounded-3xl border border-border/70 bg-card p-4 shadow-soft"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-leaf/12 text-2xl">
                {tip.emoji}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf">
                  {tip.tag}
                </p>
                <h3 className="mt-0.5 text-base font-semibold leading-snug">{tip.title}</h3>
              </div>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{tip.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-3xl bg-surface-gradient p-5 ring-1 ring-border/60">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">Ordem que importa</p>
        <ol className="mt-2.5 space-y-2 text-sm">
          {[
            ["Reduzir", "comprar só o necessário evita o resíduo antes de existir"],
            ["Reutilizar", "potes, sacolas e garrafas ganham segunda função"],
            ["Reciclar", "separar limpo e seco garante que o material seja aproveitado"],
          ].map(([title, text], i) => (
            <li key={title} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-eco-gradient text-[11px] font-bold text-leaf-foreground">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="font-semibold">{title}</span>{" "}
                <span className="text-muted-foreground">— {text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <DemoNote>
        Dicas gerais de coleta seletiva. Regras podem variar conforme a cooperativa da sua cidade.
      </DemoNote>
      <div className="h-4" />
    </section>
  );
}
