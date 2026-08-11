import { queryOptions } from "@tanstack/react-query";
import {
  fetchMarket,
  fetchMarketFit,
  fetchMarketSeries,
  fetchMarkets,
  fetchSummary,
  fetchTradeFit,
} from "@/services/api";
import type { TableFilters } from "@/types/tradepulse";

export const tradepulseKeys = {
  all: ["tradepulse"] as const,
  markets: (filters: TableFilters) => ["tradepulse", "markets", filters] as const,
  market: (id: string) => ["tradepulse", "market", id] as const,
  series: (id: string) => ["tradepulse", "series", id] as const,
  marketFit: (id: string) => ["tradepulse", "market-fit", id] as const,
  tradeFit: (id: string) => ["tradepulse", "trade-fit", id] as const,
  summary: () => ["tradepulse", "summary"] as const,
};

export const marketsQuery = (filters: TableFilters) =>
  queryOptions({
    queryKey: tradepulseKeys.markets(filters),
    queryFn: () => fetchMarkets(filters),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

export const marketQuery = (id: string) =>
  queryOptions({
    queryKey: tradepulseKeys.market(id),
    queryFn: () => fetchMarket(id),
    staleTime: 60_000,
  });

export const marketSeriesQuery = (id: string) =>
  queryOptions({
    queryKey: tradepulseKeys.series(id),
    queryFn: () => fetchMarketSeries(id),
    staleTime: 60_000,
  });

export const marketFitQuery = (id: string) =>
  queryOptions({
    queryKey: tradepulseKeys.marketFit(id),
    queryFn: () => fetchMarketFit(id),
    staleTime: 60_000,
  });

export const tradeFitQuery = (id: string) =>
  queryOptions({
    queryKey: tradepulseKeys.tradeFit(id),
    queryFn: () => fetchTradeFit(id),
    staleTime: 60_000,
  });

export const summaryQuery = () =>
  queryOptions({
    queryKey: tradepulseKeys.summary(),
    queryFn: fetchSummary,
    staleTime: 60_000,
  });
