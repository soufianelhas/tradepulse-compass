import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { AppHeader } from "@/components/tradepulse/AppHeader";
import { SemanticBar } from "@/components/tradepulse/SemanticBar";
import { ScraperBanner } from "@/components/tradepulse/ScraperBanner";
import { SummaryCards } from "@/components/tradepulse/SummaryCards";
import { SignalMatrix } from "@/components/tradepulse/SignalMatrix";
import { MarketTable, type TableFilters } from "@/components/tradepulse/MarketTable";
import { CountryDrawer } from "@/components/tradepulse/CountryDrawer";
import { MARKETS, type Market } from "@/lib/tradepulse-data";

const TITLE = "TradePulse AI — Predictive Trade Demand & Manifest Signals";
const DESCRIPTION =
  "Synthesize real-time search intent against pre-border manifest supply to find unmet demand lanes, tariff advantages and landed cost per destination market.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [origin, setOrigin] = useState("🇨🇳 China");
  const [currency, setCurrency] = useState("USD");
  const [query, setQuery] = useState("Foldable Electric Wagons");
  const [loading, setLoading] = useState(true);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Market | null>(null);
  const [filters, setFilters] = useState<TableFilters>({
    region: "All",
    maxTariff: 30,
    maxFreight: 4200,
    minVelocity: -20,
    text: "",
  });

  const markets = useMemo(
    () =>
      MARKETS.filter(
        (m) =>
          (filters.region === "All" || m.region === filters.region) &&
          m.tariffRate <= filters.maxTariff &&
          m.freightCost <= filters.maxFreight &&
          m.searchVelocity >= filters.minVelocity &&
          m.country.toLowerCase().includes(filters.text.toLowerCase()),
      ).sort((a, b) => b.searchVelocity - a.searchVelocity),
    [filters],
  );

  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <div className="min-h-dvh bg-canvas">
      <AppHeader
        origin={origin}
        onOriginChange={setOrigin}
        currency={currency}
        onCurrencyChange={setCurrency}
        query={query}
        onQueryChange={setQuery}
      />
      <SemanticBar
        origin={origin}
        onChangeOrigin={() => setOrigin(origin === "🇨🇳 China" ? "🇲🇽 Mexico" : "🇨🇳 China")}
      />

      <main className="mx-auto max-w-[1600px] space-y-4 px-4 py-5 pb-32">
        <h1 className="sr-only">TradePulse AI executive trade demand dashboard</h1>

        <SummaryCards loading={loading} />

        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <SignalMatrix
            markets={markets}
            highlightId={highlightId}
            onHover={setHighlightId}
            onSelect={setSelected}
          />
          <MarketTable
            markets={markets}
            filters={filters}
            onFiltersChange={setFilters}
            loading={loading}
            highlightId={highlightId}
            onHover={setHighlightId}
            onSelect={setSelected}
            currency={currency}
          />
        </div>
      </main>

      {loading && <ScraperBanner onComplete={handleComplete} />}

      <CountryDrawer
        market={selected}
        origin={origin}
        currency={currency}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
