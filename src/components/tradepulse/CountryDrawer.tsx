import { useEffect, useRef, useState } from "react";
import { X, FileDown, Table2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { signum } from "@/lib/tradepulse-data";
import type { Market } from "@/types/tradepulse";
import { PanelError, PanelSkeleton } from "@/components/tradepulse/QueryStates";
import { marketFitQuery, marketSeriesQuery, tradeFitQuery } from "@/services/queries";
import {
  ChannelPanel,
  CompetitivePanel,
  IntentPanel,
  LocalizationPanel,
  RiskPanel,
} from "@/components/tradepulse/MarketFitPanels";
import {
  FitScorePanel,
  LogisticsMacroPanel,
  MacroDemandPanel,
  PricingPanel,
  SupplyConcentrationPanel,
  TariffPanel,
} from "@/components/tradepulse/TradeFitPanels";

const MODULES = [
  { id: "trade", label: "Trade Data" },
  { id: "social", label: "Social Listening" },
] as const;

type ModuleId = (typeof MODULES)[number]["id"];

const TRADE_TABS = [
  { id: "demand", label: "Demand Signals" },
  { id: "supply", label: "Supply & Manifests" },
  { id: "commerce", label: "Local E-Commerce" },
  { id: "cost", label: "Landed Cost" },
  { id: "macro", label: "Macro Demand" },
  { id: "pricing", label: "Pricing & Margin" },
  { id: "tariff", label: "Tariff & Access" },
  { id: "concentration", label: "Supply Concentration" },
  { id: "fit", label: "Demand Fit Score" },
  { id: "logistics", label: "Logistics & Macro" },
] as const;

const SOCIAL_TABS = [
  { id: "intent", label: "Intent & Chatter" },
  { id: "sov", label: "Competitive SOV" },
  { id: "localization", label: "Localization" },
  { id: "channels", label: "Channels & KOLs" },
  { id: "risk", label: "Friction & Risk" },
] as const;

type TabId = (typeof TRADE_TABS)[number]["id"] | (typeof SOCIAL_TABS)[number]["id"];



function MiniChart({
  data,
  labelA,
  labelB,
}: {
  data: { week: string; a: number; b: number }[];
  labelA: string;
  labelB: string;
}) {
  const w = 560;
  const h = 180;
  const all = data.flatMap((d) => [d.a, d.b]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const px = (i: number) => (i / (data.length - 1)) * (w - 20) + 10;
  const py = (v: number) => h - 20 - ((v - min) / (max - min || 1)) * (h - 40);
  const path = (key: "a" | "b") => data.map((d, i) => `${i ? "L" : "M"}${px(i)},${py(d[key])}`).join(" ");

  return (
    <figure className="rounded-md border border-border bg-canvas p-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={`${labelA} versus ${labelB} over 12 weeks`}>
        <path d={path("a")} fill="none" stroke="var(--accent-cyan)" strokeWidth="2" />
        <path d={path("b")} fill="none" stroke="var(--accent-brand)" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-cyan" aria-hidden="true" />
          {labelA}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-primary" aria-hidden="true" />
          {labelB}
        </span>
      </figcaption>
    </figure>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-canvas p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`num mt-1 text-lg font-semibold ${tone ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}

export function CountryDrawer({
  market,
  origin,
  currency,
  onClose,
}: {
  market: Market | null;
  origin: string;
  currency: string;
  onClose: () => void;
}) {
  const [module_, setModule] = useState<ModuleId>("trade");
  const [tab, setTab] = useState<TabId>("demand");
  const panelRef = useRef<HTMLDivElement>(null);
  const open = market !== null;

  useEffect(() => {
    if (!open) return undefined;
    setModule("trade");
    setTab("demand");
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);

  const marketId = market?.id ?? "";
  const seriesResult = useQuery({ ...marketSeriesQuery(marketId), enabled: open });
  const fitResult = useQuery({ ...marketFitQuery(marketId), enabled: open && module_ === "social" });
  const tradeFitResult = useQuery({ ...tradeFitQuery(marketId), enabled: open && module_ === "trade" });

  const series = seriesResult.data;
  const fit = fitResult.data;
  const tradeFit = tradeFitResult.data;

  const renderSocial = (node: (f: NonNullable<typeof fit>) => JSX.Element) => {
    if (fitResult.isError) {
      return <PanelError message="Social listening signals failed to load." onRetry={() => void fitResult.refetch()} />;
    }
    if (!fit) return <PanelSkeleton />;
    return node(fit);
  };

  const renderTrade = (node: (f: NonNullable<typeof tradeFit>) => JSX.Element) => {
    if (tradeFitResult.isError) {
      return <PanelError message="Trade intelligence signals failed to load." onRetry={() => void tradeFitResult.refetch()} />;
    }
    if (!tradeFit) return <PanelSkeleton />;
    return node(tradeFit);
  };

  if (!market) return null;


  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${market.country} deep-dive analytics`}
        className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l border-border-strong bg-surface shadow-[var(--shadow-panel)]"
      >
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border p-4">
          <div className="min-w-0">
            <h2 className="flex min-w-0 items-center gap-2 text-lg font-semibold">
              <span aria-hidden="true">{market.flag}</span>
              <span className="truncate">{market.country}</span>
            </h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Export origin: {origin} · Lane currency: {currency} · {market.note}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close deep-dive drawer (Escape)"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-canvas text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex gap-1 border-b border-border bg-canvas p-2" role="group" aria-label="Intelligence module">
          {MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={module_ === m.id}
              onClick={() => {
                setModule(m.id);
                setTab(m.id === "trade" ? "demand" : "intent");
              }}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                module_ === m.id
                  ? "border border-border-strong bg-surface text-foreground"
                  : "border border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          role="tablist"
          aria-label={module_ === "trade" ? "Trade data analytics tabs" : "Social listening analytics tabs"}
          className="flex overflow-x-auto border-b border-border"
        >
          {(module_ === "trade" ? TRADE_TABS : SOCIAL_TABS).map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ${
                tab === t.id
                  ? "border-cyan text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>


        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {tab === "demand" && (
            <div role="tabpanel" id="panel-demand" aria-labelledby="tab-demand" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Stat label="30d search velocity" value={`${signum(market.searchVelocity)}%`} tone="text-signal-green" />
                <Stat label="Social buzz index" value={`${(60 + market.searchVelocity / 3).toFixed(0)}`} />
              </div>
              {seriesResult.isError ? (
                <PanelError message="Time series failed to load." onRetry={() => void seriesResult.refetch()} />
              ) : series ? (
                <MiniChart data={series.demand} labelA="Search velocity index" labelB="Social media buzz" />
              ) : (
                <PanelSkeleton rows={2} />
              )}
            </div>
          )}
          {tab === "supply" && (
            <div role="tabpanel" id="panel-supply" aria-labelledby="tab-supply" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Stat label="60d inbound TEU volume" value={`${signum(market.teuVolume)}%`} />
                <Stat label="Spot ocean freight" value={`$${market.freightCost.toLocaleString()}/TEU`} />
              </div>
              {seriesResult.isError ? (
                <PanelError message="Time series failed to load." onRetry={() => void seriesResult.refetch()} />
              ) : series ? (
                <MiniChart data={series.supply} labelA="Weekly B/L TEU volume" labelB="Spot freight rate ($)" />
              ) : (
                <PanelSkeleton rows={2} />
              )}
            </div>
          )}
          {tab === "commerce" && (
            <div role="tabpanel" id="panel-commerce" aria-labelledby="tab-commerce" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Stat label="Out-of-stock rate" value={`${market.stockoutRate.toFixed(1)}%`} tone="text-signal-amber" />
                <Stat label="Active competitor listings" value={`${Math.round(120 + market.teuVolume * 4)}`} />
                <Stat label="Local price inflation" value={`${(market.stockoutRate / 6).toFixed(1)}%`} />
              </div>
              {seriesResult.isError ? (
                <PanelError message="Time series failed to load." onRetry={() => void seriesResult.refetch()} />
              ) : series ? (
                <MiniChart data={series.commerce} labelA="Out-of-stock rate (%)" labelB="Competitor listings" />
              ) : (
                <PanelSkeleton rows={2} />
              )}
            </div>
          )}
          {tab === "cost" && (
            <div role="tabpanel" id="panel-cost" aria-labelledby="tab-cost" className="space-y-3">
              <table className="w-full text-sm">
                <caption className="sr-only">Landed cost breakdown per unit</caption>
                <tbody>
                  {breakdown.map((b) => (
                    <tr key={b.label} className="border-b border-border">
                      <th scope="row" className="py-2.5 text-left font-normal text-muted-foreground">
                        {b.label}
                      </th>
                      <td className="num py-2.5 text-right text-foreground">${b.value.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="py-2.5 text-left font-medium">
                      Total landed cost
                    </th>
                    <td className="num py-2.5 text-right text-lg font-semibold text-cyan">
                      ${market.landedCost.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[11px] text-muted-foreground">
                MFN baseline vs preferential rate applied where a valid FTA claim exists on this lane.
              </p>
            </div>
          )}
          {tab === "intent" && (
            <div role="tabpanel" id="panel-intent" aria-labelledby="tab-intent">
              {renderSocial((f) => <IntentPanel fit={f} />)}
            </div>
          )}
          {tab === "sov" && (
            <div role="tabpanel" id="panel-sov" aria-labelledby="tab-sov">
              {renderSocial((f) => <CompetitivePanel fit={f} />)}
            </div>
          )}
          {tab === "localization" && (
            <div role="tabpanel" id="panel-localization" aria-labelledby="tab-localization">
              {renderSocial((f) => <LocalizationPanel fit={f} />)}
            </div>
          )}
          {tab === "channels" && (
            <div role="tabpanel" id="panel-channels" aria-labelledby="tab-channels">
              {renderSocial((f) => <ChannelPanel fit={f} />)}
            </div>
          )}
          {tab === "risk" && (
            <div role="tabpanel" id="panel-risk" aria-labelledby="tab-risk">
              {renderSocial((f) => <RiskPanel fit={f} />)}
            </div>
          )}
          {tab === "macro" && (
            <div role="tabpanel" id="panel-macro" aria-labelledby="tab-macro">
              {renderTrade((f) => <MacroDemandPanel fit={f} />)}
            </div>
          )}
          {tab === "pricing" && (
            <div role="tabpanel" id="panel-pricing" aria-labelledby="tab-pricing">
              {renderTrade((f) => <PricingPanel fit={f} />)}
            </div>
          )}
          {tab === "tariff" && (
            <div role="tabpanel" id="panel-tariff" aria-labelledby="tab-tariff">
              {renderTrade((f) => <TariffPanel fit={f} />)}
            </div>
          )}
          {tab === "concentration" && (
            <div role="tabpanel" id="panel-concentration" aria-labelledby="tab-concentration">
              {renderTrade((f) => <SupplyConcentrationPanel fit={f} />)}
            </div>
          )}
          {tab === "fit" && (
            <div role="tabpanel" id="panel-fit" aria-labelledby="tab-fit">
              {renderTrade((f) => <FitScorePanel fit={f} />)}
            </div>
          )}
          {tab === "logistics" && (
            <div role="tabpanel" id="panel-logistics" aria-labelledby="tab-logistics">
              {renderTrade((f) => <LogisticsMacroPanel fit={f} />)}
            </div>
          )}
        </div>


        <footer className="flex flex-wrap gap-2 border-t border-border bg-surface p-4">
          <button
            type="button"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            Export Executive PDF Report
          </button>
          <button
            type="button"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md border border-border-strong bg-canvas px-4 text-sm font-medium text-foreground hover:border-cyan hover:text-cyan"
          >
            <Table2 className="h-4 w-4" aria-hidden="true" />
            Download CSV Raw Data
          </button>
        </footer>
      </div>
    </div>
  );
}
