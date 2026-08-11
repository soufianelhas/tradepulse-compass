# Export Market Demand Fit — Social Listening Suite

Adds a localized social-listening intelligence layer to the country deep-dive, without touching any existing module, tab, or state wiring.

## What the analyst gets

Opening a destination country drawer keeps the four existing tabs (Demand Signals, Supply & Manifests, Local E-Commerce, Landed Cost) and adds five new tabs:

1. **Intent & Chatter** — category mention volume, MoM growth velocity, explicit purchase-intent phrases ("where can I buy…") with counts and growth, cross-border query volume, and unmet-need clusters ranked by complaint share and sentiment ratio.
2. **Competitive SOV** — local vs imported share-of-voice split bar, net sentiment gap vs incumbent, feature preference matrix (attribute importance + sentiment tone), and price-sensitivity intensity.
3. **Localization** — geo-linguistic sentiment by dialect region with top idioms, usage occasions, cultural attribute compliance/friction flags (e.g. Halal, organic), and seasonal spike calendar (e.g. Ramadan +3.2x).
4. **Channels & KOLs** — platform distribution shares, top influencers with reach and engagement, marketplace review sentiment with positive/negative aspect chips.
5. **Friction & Risk** — customs chatter spikes with severity, last-mile logistics complaint share, counterfeit mention share.

Tab strip stays horizontally scrollable so nine tabs work on narrow screens. All numbers use the existing tabular-figure treatment; severity/sentiment use the established green/amber/rose signal tokens.

## Technical approach

**`src/lib/tradepulse-data.ts` (extend only)**
- Add the `ExportMarketFit` interface exactly as specified, plus the small nested types.
- Add `MARKET_FIT: Record<string, ExportMarketFit>` keyed by existing market `id`, with realistic mock values derived per market (Morocco/LATAM/APAC flavoured content where relevant), and a `getMarketFit(market)` helper that falls back to a generated baseline so every market resolves.
- No changes to `Market`, `MARKETS`, existing series functions, or exports.

**`src/components/tradepulse/CountryDrawer.tsx` (extend only)**
- Append five entries to the existing `TABS` array; existing four remain first and `demand` stays the default tab.
- Render each new panel with the same `role="tabpanel"` / `aria-labelledby` pattern and reuse the existing `Stat` and `MiniChart` primitives where a trend line fits.
- New panel bodies live in a sibling file `src/components/tradepulse/MarketFitPanels.tsx` (presentational only, receives `ExportMarketFit`) to keep the drawer file readable; the drawer keeps ownership of tab state and focus trap.
- Small shared presentational bits (share bar, aspect chip, severity pill) defined in that same file using existing tokens — no new colors, no hardcoded hex.

**Untouched:** `AppHeader.tsx`, `SignalMatrix.tsx`, `SummaryCards.tsx`, `ScraperBanner.tsx`, `SemanticBar.tsx`, `MarketTable.tsx`, `src/routes/index.tsx`, `src/styles.css` tokens.

## Verification
- Type check.
- Browser pass: open a country drawer, cycle all nine tabs, confirm keyboard tab-trap and Escape still work and no layout overflow at 1052px and mobile width.
