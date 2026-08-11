# Backend-Ready Data Layer Refactor

Prepare TradePulse for a real backend by separating types, data access, and UI — with zero visual or layout changes.

## 1. Types module (`src/types/tradepulse.ts`)

Move every type/interface out of `src/lib/tradepulse-data.ts`:
`Quadrant`, `Market`, `SeriesPoint`, `ExportMarketFit`, `TradeDataMarketFit`, plus the tone union used by `QUADRANT_META`/`toneClass`, and a `TableFilters` type (currently declared in `MarketTable.tsx`).

`src/lib/tradepulse-data.ts` keeps only mock data and derivation logic (`MARKETS`, `QUADRANT_META`, `toneClass`, `signum`, the series builders, `getMarketFit`, `getTradeFit`) and imports its types from the new module. It re-exports the types so no existing import path breaks.

## 2. Mock API service (`src/services/api.ts`)

Promise-based functions simulating network latency (randomized delays, e.g. 200–600 ms; ~900 ms for the market list), each returning typed DTOs:

- `fetchMarkets(filters)` — filtered + sorted market list
- `fetchMarket(id)`
- `fetchMarketFit(id)` — social listening layer
- `fetchTradeFit(id)` — trade data layer
- `fetchMarketSeries(id)` — demand/supply/commerce series + landed cost breakdown
- `fetchSummary()` — executive summary cards

Each throws an `Error` for unknown ids so error states are exercisable. A single `delay()` helper and a `SIMULATED_FAILURE_RATE = 0` constant make it easy to swap in real `fetch`/server-function calls later.

## 3. Query layer (`src/services/queries.ts`)

Central `queryOptions` factories (`marketsQuery(filters)`, `marketFitQuery(id)`, `tradeFitQuery(id)`, `marketSeriesQuery(id)`, `summaryQuery()`) with stable, parameterized query keys so the swap to a real backend touches only `api.ts`.

## 4. Component refactor

- `src/routes/index.tsx`: replaces the in-component `useMemo` filtering with `useQuery(marketsQuery(filters))`; `loading` for the table/cards derives from query `isPending` (the existing scraper banner behaviour is preserved).
- `MarketTable`: consumes markets and `isPending`/`isError` from the parent; keeps its current `Skeleton` rows for loading and gains an error row in the same table shell.
- `SignalMatrix`: renders a same-height skeleton block while pending and an inline error message on failure; the scatter geometry uses the fetched market list rather than importing `MARKETS` directly.
- `SummaryCards`: driven by `summaryQuery()`, keeping the existing skeleton markup.
- `CountryDrawer`: fetches series/landed cost per selected market; the two module tab groups fetch via `marketFitQuery` / `tradeFitQuery` when a tab in that module is active.
- `MarketFitPanels` / `TradeFitPanels`: stay presentational and receive already-resolved data; the drawer supplies skeleton and error fallbacks.

## 5. Shared loading/error fallbacks

Add `src/components/tradepulse/QueryStates.tsx` with `PanelSkeleton` and `PanelError` built from the existing `Skeleton` component and current design tokens (`panel`, `text-muted-foreground`, `text-signal-rose`). `PanelError` includes a Retry button wired to the query's `refetch`.

## Notes

- No CSS, token, class-name, or layout changes anywhere; skeleton and panel markup keep their current dimensions.
- All existing state connections in `src/routes/index.tsx` (origin, currency, query, filters, hover highlight, selection) stay intact.
- Queries stay client-side (`useQuery`) rather than route loaders, so nothing changes about routing or SSR behaviour.
