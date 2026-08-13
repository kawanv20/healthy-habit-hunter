import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardPaste, Minus, Pencil, Plus, Sparkles, Trash2, X, Check } from "lucide-react";
import { useRef, useState } from "react";
import { ActionBar, AppShell, DemoNote, PageHeader } from "@/components/eco/AppShell";
import { interpret, quickSuggestions } from "@/lib/ecovida-ai";
import { useEco } from "@/lib/ecovida-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lista")({
  head: () => ({
    meta: [
      { title: "Criar minha lista | EcoVida AI" },
      {
        name: "description",
        content:
          "Escreva sua lista de compras livremente: a EcoVida AI interpreta, organiza por seções e compara marcas para cada item.",
      },
      { property: "og:title", content: "Criar minha lista | EcoVida AI" },
      {
        property: "og:description",
        content: "Digite ou cole sua lista de supermercado e deixe a EcoVida AI organizar.",
      },
    ],
  }),
  component: ListaPage,
});

function ListaPage() {
  const { items, addItem, addFromText, updateItem, removeItem, clearList } = useEco();
  const [draft, setDraft] = useState("");
  const [bulk, setBulk] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    if (/[,;\n]/.test(text)) addFromText(text);
    else addItem(text);
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Passo 1 · Sua lista"
        title="O que você precisa comprar?"
        subtitle="Escreva do seu jeito — “coca”, “danone”, “molho”. A EcoVida AI entende depois."
      />

      {/* Campo principal */}
      <div className="sticky top-0 z-30 mt-4 bg-background/92 px-5 py-3 backdrop-blur md:px-8">
        <div className="flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:border-leaf focus-within:ring-2 focus-within:ring-ring/40">
            <Plus className="size-4 shrink-0 text-leaf" />
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitDraft()}
              placeholder="Digite um item…"
              enterKeyHint="done"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {draft && (
              <button onClick={() => setDraft("")} aria-label="Limpar campo">
                <X className="size-4 text-muted-foreground" />
              </button>
            )}
          </label>
          <button
            onClick={submitDraft}
            disabled={!draft.trim()}
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-2xl transition-all active:scale-95",
              draft.trim()
                ? "bg-eco-gradient text-leaf-foreground shadow-glow"
                : "bg-muted text-muted-foreground",
            )}
            aria-label="Adicionar item"
          >
            <Plus className="size-5" />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => setBulk((b) => !b)}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground"
          >
            <ClipboardPaste className="size-3.5" /> Colar lista inteira
          </button>
          {items.length > 0 && (
            <button
              onClick={clearList}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              <Trash2 className="size-3.5" /> Limpar
            </button>
          )}
        </div>

        {bulk && (
          <div className="animate-in fade-in slide-in-from-top-1 mt-2.5 rounded-3xl border border-border bg-card p-3 shadow-soft duration-200">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={3}
              placeholder="arroz, feijão, macarrão, leite, biscoito, refrigerante"
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setBulk(false);
                  setBulkText("");
                }}
                className="rounded-2xl px-3 py-2 text-xs font-medium text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const n = addFromText(bulkText);
                  if (n) {
                    setBulkText("");
                    setBulk(false);
                  }
                }}
                className="rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Adicionar itens
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-44 md:px-8">
        {/* Lista digitada */}
        {items.length === 0 ? (
          <div className="mt-2 rounded-3xl border border-dashed border-border bg-surface-gradient p-7 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-leaf/12 text-2xl">
              📝
            </span>
            <p className="mt-3 font-display text-base font-semibold">Sua lista está vazia</p>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
              Comece escrevendo o que precisa comprar. Você pode usar apelidos e marcas.
            </p>
          </div>
        ) : (
          <ul className="mt-1 space-y-2">
            {items.map((item) => {
              const reading = interpret(item.raw);
              const isEditing = editing === item.id;
              return (
                <li
                  key={item.id}
                  className="animate-in fade-in slide-in-from-bottom-1 rounded-3xl border border-border/70 bg-card p-3.5 shadow-soft duration-200"
                >
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <input
                        autoFocus
                        defaultValue={item.raw}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v) updateItem(item.id, { raw: v });
                          setEditing(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                        className="min-w-0 flex-1 rounded-xl bg-muted px-3 py-2 text-sm outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => setEditing(item.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-sm font-semibold">{item.raw}</p>
                        <p
                          className={cn(
                            "truncate text-[11px]",
                            reading.categoryId ? "text-leaf" : "text-muted-foreground",
                          )}
                        >
                          {reading.categoryId ? reading.reading : "Vamos tentar identificar na análise"}
                        </p>
                      </button>
                    )}

                    {/* quantidade */}
                    <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-muted p-1">
                      <button
                        onClick={() => updateItem(item.id, { qty: Math.max(1, item.qty - 1) })}
                        aria-label="Diminuir quantidade"
                        className="grid size-7 place-items-center rounded-xl text-muted-foreground hover:bg-card"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateItem(item.id, { qty: Math.min(20, item.qty + 1) })}
                        aria-label="Aumentar quantidade"
                        className="grid size-7 place-items-center rounded-xl text-muted-foreground hover:bg-card"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remover ${item.raw}`}
                      className="grid size-9 shrink-0 place-items-center rounded-2xl text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* observação */}
                  {noteFor === item.id ? (
                    <input
                      autoFocus
                      defaultValue={item.note ?? ""}
                      placeholder="Observação: sem lactose, 1 kg, marca preferida…"
                      onBlur={(e) => {
                        updateItem(item.id, { note: e.target.value.trim() || undefined });
                        setNoteFor(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      className="mt-2.5 w-full rounded-2xl bg-muted px-3 py-2 text-xs outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => setNoteFor(item.id)}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3" />
                      {item.note ? item.note : "Adicionar observação"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Sugestões rápidas (opcionais) */}
        <h2 className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Sugestões rápidas <span className="font-normal normal-case tracking-normal">(opcional)</span>
        </h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {quickSuggestions.map((s) => {
            const already = items.some(
              (i) => i.raw.toLowerCase() === s.label.toLowerCase(),
            );
            return (
              <button
                key={s.label}
                onClick={() => addItem(s.label)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-medium transition-all active:scale-95",
                  already ? "border-leaf bg-leaf/10" : "border-border/70 bg-card",
                )}
              >
                <span>{s.emoji}</span>
                {s.label}
                {already ? <Check className="size-3 text-leaf" /> : <Plus className="size-3 opacity-60" />}
              </button>
            );
          })}
        </div>

        <DemoNote>
          Catálogo de demonstração: as marcas e avaliações são ilustrativas e servem para mostrar como
          a comparação funciona. Nada de preços ou números ambientais estimados.
        </DemoNote>
      </div>

      <ActionBar>
        <div className="min-w-0 flex-1 pl-1">
          <p className="truncate text-sm font-semibold">
            {items.length === 0 ? "Nenhum item ainda" : `${items.length} ${items.length === 1 ? "item" : "itens"}`}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {items.length === 0
              ? "Escreva o que precisa comprar"
              : items.map((i) => i.raw).join(" · ")}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/recomendacoes" })}
          disabled={items.length === 0}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]",
            items.length === 0
              ? "bg-muted text-muted-foreground"
              : "bg-eco-gradient text-leaf-foreground shadow-glow",
          )}
        >
          <Sparkles className="size-4" /> Analisar minha lista
        </button>
      </ActionBar>
    </AppShell>
  );
}
