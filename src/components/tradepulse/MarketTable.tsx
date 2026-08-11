import { Info, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QUADRANT_META, signum, toneClass } from "@/lib/tradepulse-data";
import type { Market, TableFilters } from "@/types/tradepulse";

export type { TableFilters } from "@/types/tradepulse";

const REGIONS = ["All", "LATAM", "APAC", "EMEA", "NA"];

function HeaderCell({ label, hint, align = "right" }: { label: string; hint?: string; align?: "left" | "right" }) {
  return (
    <th
      scope="col"
      className={`px-3 py-2.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase ${align === "right" ? "text-right" : "text-left"}`}
    >
      <span className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={`About ${label}`} className="text-muted-foreground hover:text-foreground">
                <Info className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-64 border-border-strong bg-surface text-xs text-foreground">
              {hint}
            </TooltipContent>
          </Tooltip>
        )}
      </span>
    </th>
  );
}

export function MarketTable({
  markets,
  filters,
  onFiltersChange,
  loading,
  highlightId,
  onHover,
  onSelect,
  currency,
  error = false,
  onRetry,
}: {
  markets: Market[];
  filters: TableFilters;
  onFiltersChange: (f: TableFilters) => void;
  loading: boolean;
  error?: boolean;
  onRetry?: (() => void) | undefined;
  highlightId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (m: Market) => void;
  currency: string;
}) {
  const set = <K extends keyof TableFilters>(k: K, v: TableFilters[K]) =>
    onFiltersChange({ ...filters, [k]: v });

  return (
    <TooltipProvider delayDuration={150}>
      <section className="panel min-w-0" aria-label="Market selection data table">
        <div className="border-b border-border p-4">
          <h2 className="text-sm font-semibold">Market Selection</h2>
          <p className="text-xs text-muted-foreground">
            Raw pillar signals per destination lane — no composite scoring
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="relative block min-w-0">
              <span className="sr-only">Search table</span>
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={filters.text}
                onChange={(e) => set("text", e.target.value)}
                placeholder="Filter destinations..."
                className="h-9 w-full rounded-md border border-border bg-canvas pr-2 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-cyan focus:outline-none"
              />
            </label>

            <label className="block min-w-0 text-[11px] text-muted-foreground">
              <span className="sr-only">Region filter</span>
              <select
                aria-label="Region filter"
                value={filters.region}
                onChange={(e) => set("region", e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-canvas px-2 text-xs text-foreground focus:border-cyan focus:outline-none"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r} className="bg-surface">
                    {r === "All" ? "All regions" : r}
                  </option>
                ))}
              </select>
            </label>

            <div className="min-w-0">
              <label htmlFor="tariff-slider" className="num text-[11px] text-muted-foreground">
                Max tariff: {filters.maxTariff}%
              </label>
              <Slider
                id="tariff-slider"
                className="mt-2.5"
                value={[filters.maxTariff]}
                max={30}
                step={1}
                onValueChange={([v]) => set("maxTariff", v ?? 0)}
              />
            </div>

            <div className="min-w-0">
              <label htmlFor="freight-slider" className="num text-[11px] text-muted-foreground">
                Max freight: ${filters.maxFreight}/TEU
              </label>
              <Slider
                id="freight-slider"
                className="mt-2.5"
                value={[filters.maxFreight]}
                min={1000}
                max={4200}
                step={50}
                onValueChange={([v]) => set("maxFreight", v ?? 0)}
              />
            </div>

            <div className="min-w-0">
              <label htmlFor="velocity-slider" className="num text-[11px] text-muted-foreground">
                Min search velocity: {filters.minVelocity}%
              </label>
              <Slider
                id="velocity-slider"
                className="mt-2.5"
                value={[filters.minVelocity]}
                min={-20}
                max={150}
                step={5}
                onValueChange={([v]) => set("minVelocity", v ?? 0)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="border-b border-border bg-surface-hover/40">
              <tr>
                <HeaderCell label="# Destination" align="left" />
                <HeaderCell label="Search Velocity 30d" hint="Pillar 2: normalized query volume growth across regional search engines and marketplaces." />
                <HeaderCell label="Inbound TEU 60d" hint="Pillar 1: bill-of-lading manifest container volume growth into destination ports." />
                <HeaderCell label="Stockout Rate" hint="Pillar 2: share of tracked local marketplace listings out of stock." />
                <HeaderCell label="Tariff Rate" hint="Pillar 1: applicable bilateral rate — preferential FTA where a claim is valid, else MFN." />
                <HeaderCell label={`Landed Cost (${currency}/unit)`} hint="Pillar 1: FOB goods + ocean freight & insurance + duty + import VAT + brokerage/handling." />
                <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center">
                    <p role="alert" className="text-xs text-signal-rose">
                      Market signal feed failed to load.
                    </p>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        className="mt-3 inline-flex min-h-9 items-center rounded-md border border-border-strong bg-surface px-3 text-xs font-medium text-foreground transition-colors hover:border-cyan hover:text-cyan"
                      >
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ) : loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-3 py-3">
                          <Skeleton className="h-4 w-full bg-surface-hover" />
                        </td>
                      ))}
                    </tr>
                  ))
                : markets.map((m, i) => {
                    const meta = QUADRANT_META[m.quadrant];
                    return (
                      <tr
                        key={m.id}
                        onMouseEnter={() => onHover(m.id)}
                        onMouseLeave={() => onHover(null)}
                        onFocus={() => onHover(m.id)}
                        className={`border-b border-border transition-colors ${highlightId === m.id ? "bg-surface-hover" : "hover:bg-surface-hover"}`}
                      >
                        <th scope="row" className="px-3 py-3 text-left font-normal">
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="num w-5 shrink-0 text-muted-foreground">{i + 1}</span>
                            <span aria-hidden="true">{m.flag}</span>
                            <span className="truncate font-medium">{m.country}</span>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${toneClass(meta.tone)}`}>
                              {meta.label}
                            </span>
                          </span>
                        </th>
                        <td className={`num px-3 py-3 text-right ${m.searchVelocity >= 0 ? "text-signal-green" : "text-signal-rose"}`}>
                          {signum(m.searchVelocity)}%
                        </td>
                        <td className={`num px-3 py-3 text-right ${m.teuVolume >= 0 ? "text-foreground" : "text-signal-amber"}`}>
                          {signum(m.teuVolume)}%
                        </td>
                        <td className="num px-3 py-3 text-right text-foreground">{m.stockoutRate.toFixed(1)}%</td>
                        <td className="num px-3 py-3 text-right text-foreground">{m.tariffRate.toFixed(1)}%</td>
                        <td className="num px-3 py-3 text-right text-foreground">${m.landedCost.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onSelect(m)}
                            className="inline-flex min-h-9 items-center rounded-md border border-border-strong bg-surface px-3 text-xs font-medium text-foreground transition-colors hover:border-cyan hover:text-cyan"
                          >
                            Compare &amp; Analyze Signals
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              {!loading && !error && markets.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-xs text-muted-foreground">
                    No destination lanes match the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </TooltipProvider>
  );
}
