import { Sparkles, Languages, Filter } from "lucide-react";

export function SemanticBar({ origin, onChangeOrigin }: { origin: string; onChangeOrigin: () => void }) {
  return (
    <div className="border-b border-border bg-surface/60">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 text-xs">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan" aria-hidden="true" />
          <span className="text-muted-foreground">Semantic resolution</span>
          <span className="truncate text-foreground">“Foldable Electric Wagons”</span>
          <span className="text-muted-foreground" aria-hidden="true">
            →
          </span>
          <span className="num rounded border border-border-strong bg-surface-hover px-1.5 py-0.5 text-foreground">
            HS 8716.80
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Origin:</span>
          <span className="text-foreground">{origin}</span>
          <button
            type="button"
            onClick={onChangeOrigin}
            className="text-cyan underline-offset-2 hover:underline"
          >
            [Change]
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Languages className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          {[
            ["🇺🇸 EN", "Foldable Wagon"],
            ["🇲🇽 ES", "Carrito Plegable"],
            ["🇧🇷 PT", "Carrinho Dobrável"],
          ].map(([loc, term]) => (
            <span
              key={loc}
              className="rounded-full border border-border bg-surface-hover px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              <span className="text-foreground">{loc}</span> {term}
            </span>
          ))}
        </div>

        <span className="signal-amber ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px]">
          <Filter className="h-3 w-3" aria-hidden="true" />
          <span className="num">Negative Chatter: 1.2%</span> (Filtered)
        </span>
      </div>
    </div>
  );
}
