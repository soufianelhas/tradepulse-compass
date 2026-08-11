/* Mock API service layer.
 * Every function returns a promise with a realistic network delay so the UI
 * exercises real loading/error states. Swapping in a real backend means
 * replacing the bodies here with fetch / server-function calls — nothing else. */

import {
  MARKETS,
  commerceSeries,
  demandSeries,
  getMarketFit,
  getTradeFit,
  landedCostBreakdown,
  supplySeries,
} from "@/lib/tradepulse-data";
import type {
  ExportMarketFit,
  Market,
  MarketSeriesBundle,
  SummaryCardData,
  TableFilters,
  TradeDataMarketFit,
} from "@/types/tradepulse";

/** Set above 0 locally to exercise error fallbacks. */
export const SIMULATED_FAILURE_RATE = 0;

const delay = (min: number, max: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

async function request<T>(value: () => T, min = 220, max = 620): Promise<T> {
  await delay(min, max);
  if (SIMULATED_FAILURE_RATE > 0 && Math.random() < SIMULATED_FAILURE_RATE) {
    throw new Error("Upstream signal service is unavailable.");
  }
  return value();
}

function requireMarket(id: string): Market {
  const market = MARKETS.find((m) => m.id === id);
  if (!market) throw new Error(`Unknown destination market: ${id}`);
  return market;
}

export async function fetchMarkets(filters: TableFilters): Promise<Market[]> {
  return request(
    () =>
      MARKETS.filter(
        (m) =>
          (filters.region === "All" || m.region === filters.region) &&
          m.tariffRate <= filters.maxTariff &&
          m.freightCost <= filters.maxFreight &&
          m.searchVelocity >= filters.minVelocity &&
          m.country.toLowerCase().includes(filters.text.toLowerCase()),
      ).sort((a, b) => b.searchVelocity - a.searchVelocity),
    400,
    900,
  );
}

export async function fetchMarket(id: string): Promise<Market> {
  return request(() => requireMarket(id));
}

export async function fetchMarketSeries(id: string): Promise<MarketSeriesBundle> {
  return request(() => {
    const m = requireMarket(id);
    return {
      demand: demandSeries(m),
      supply: supplySeries(m),
      commerce: commerceSeries(m),
      landedCost: landedCostBreakdown(m),
    };
  });
}

export async function fetchMarketFit(id: string): Promise<ExportMarketFit> {
  return request(() => getMarketFit(requireMarket(id)));
}

export async function fetchTradeFit(id: string): Promise<TradeDataMarketFit> {
  return request(() => getTradeFit(requireMarket(id)));
}

export async function fetchSummary(): Promise<SummaryCardData[]> {
  return request(
    () => [
      {
        id: "intent",
        label: "Top Search Intent Growth",
        value: "+142%",
        detail: "Mexico · 30d search velocity",
        icon: "trending",
        tone: "green",
      },
      {
        id: "lead-time",
        label: "Pre-Border Inbound Lead Time",
        value: "+52 Days",
        detail: "Manifest lead vs official customs statistics",
        icon: "clock",
        tone: "cyan",
      },
      {
        id: "supply",
        label: "Inbound Supply Trend",
        value: "-4.1%",
        detail: "Veracruz ports · 60d TEU volume",
        icon: "ship",
        tone: "rose",
      },
      {
        id: "tariff",
        label: "Best Bilateral Tariff Lane",
        value: "0%",
        detail: "CPTPP FTA · preferential duty rate",
        icon: "percent",
        tone: "amber",
      },
    ],
    300,
    700,
  );
}
