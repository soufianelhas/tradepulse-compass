# TradePulse Compass

TradePulse AI — Master Technical & UX Architecture Prompt

System Overview & Role

You are an expert Principal UI/UX Architect and Lead Web Frontend Engineer specializing in high-density data visualization and institutional analytics platforms. Your task is to design and build a clean, modern, responsive, accessible, and production-ready frontend interface for "TradePulse AI" — a predictive market demand and trade flow synthesizer.




Architecture Strategy & Design Language

Framework & Styling: Fully Stack-Agnostic. Built with standard semantic HTML5, CSS Design Tokens (CSS Variables), native web accessibility standards (WAI-ARIA), and framework-neutral component patterns.

Visual Philosophy: Dark Mode First with high-density data readability, crisp contrast, clean grid borders, and modular surface layering.

Typography & Data Layout:




Body & UI Controls: Sans-serif (system-ui, -apple-system, Inter).

Financial Metrics, HS Codes, TEU Counts: Monospaced with tabular numbers (font-variant-numeric: tabular-nums).

Design System & CSS Tokens

CSS

:root {
  /* Canvas & Surface Layers */
  --bg-canvas: #0B0F17;
  --bg-surface: #111827;
  --bg-surface-hover: #1F2937;
  --border-subtle: #1F2937;
  --border-strong: #374151;

  /* Typography */
  --text-main: #F9FAFB;
  --text-muted: #9CA3AF;

  /* Accents */
  --accent-brand: #6366F1; /* Electric Indigo */
  --accent-cyan: #06B6D4;  /* Interactive Cyan */

  /* Semantic Signal Badges & Indicators */
  /* High Demand / Low Supply (Unmet Intent) */
  --color-green-text: #34D399;
  --color-green-bg: rgba(16, 185, 129, 0.1);
  --color-green-border: rgba(5, 150, 105, 0.3);

  /* High Demand / High Supply (Competitive Growth) */
  --color-amber-text: #FBBF24;
  --color-amber-bg: rgba(245, 158, 11, 0.1);
  --color-amber-border: rgba(217, 119, 6, 0.3);

  /* Low Demand / High Supply (Over-Supply Risk) */
  --color-rose-text: #FB7185;
  --color-rose-bg: rgba(244, 63, 94, 0.1);
  --color-rose-border: rgba(225, 29, 72, 0.3);
}


Interface Layout & Module Specifications

1. Global Header & Command Palette

Left: Brand logo "TradePulse AI" with a pulsing live status indicator light.

Center: Command Search Bar with explicit hotkey indicator ([Cmd+K] / [Ctrl+K]).




Placeholder: "Type product or HS code (e.g., 'Foldable Electric Wagons' or '8716.80')..."

Right Control Group:




Export Origin Selector: Dropdown menu displaying current origin (Default: 🇨🇳 China).

Currency Selector: Dropdown (USD, EUR, GBP).

Data Freshness Pill: Status badge ("Manifests: Live").

Workspace Picker & User Profile Trigger.

2. Disambiguation & Semantic Mapping Bar

Positioned directly below the header/search inputs for real-time adjustments.




Semantic LLM Resolution: Natural Query $\rightarrow$ Base HS-6 Code:




Example: "Foldable Electric Wagons" $\rightarrow$ HS Code: 8716.80

Active Export Origin Switcher: Quick-action indicator showing active lane origin (e.g., Origin: 🇲🇽 Mexico [Change]).

Multi-Language Search Translation Badges:




🇺🇸 EN: "Foldable Wagon"

🇲🇽 ES: "Carrito Plegable"

🇧🇷 PT: "Carrinho Dobrável"

Sentiment Filter Status Pill: "Negative Chatter: 1.2% (Filtered)".

3. Async Background Scraper Progress Banner

Behavior: Sticky overlay banner (top or bottom) active during real-time background scraping jobs (10–30s duration).

Step-State Progress Indicators:




[✓] Official Customs API Ingested

[✓] Pre-Border Manifests Streamed

[⟳] Scraping Local Marketplace Stock (78%)

4. Executive Dashboard Core Grid (Modular 3-Column Layout)

A. Dual-Pillar Summary Cards Strip (Top)

Four key signal summary cards highlighting macro trends without composite abstraction:




Top Search Intent Growth: "Mexico: +142% 30d Search Velocity"

Pre-Border Inbound Lead Time: "+52 Days Lead Time vs Official Customs Statistics"

Inbound Supply Trend: "Veracruz Ports: -4.1% 60d TEU Volume"

Best Bilateral Tariff Lane: "CPTPP FTA: 0% Tariff Duty"

B. Bivariate Signal Matrix (Interactive Scatter Plot)

Y-Axis (Real-Time Intent): Search Velocity Growth Rate (%)

X-Axis (Official Supply): Inbound Manifest Growth Rate (% TEUs)

Quadrant Overlay Strategy (Natural Divergence):




Top-Left: Unmet Market Demand (High Search Velocity, Low Import TEU Growth)

Top-Right: High Growth / Competitive Lane

Bottom-Right: Inventory Glut / Over-Supply Risk

Scatter Plot Nodes: Destination Countries (e.g., Mexico, Brazil, UAE, Vietnam, Germany).

Hover Interaction: Tooltip card displaying raw data (30d Search Growth %, 60d TEU Volume, Out-of-Stock Rate %, Bilateral Tariff Rate).

C. Market Selection Data Table (Raw Data Priority)

Table Columns:




Rank & Destination Country (Flag + Country Name)

Search Velocity (30d %) (Pillar 2 Signal)

Inbound TEU Volume (60d %) (Pillar 1 Signal)

Local Marketplace Stockout Rate (%) (Pillar 2 Signal)

Applicable Bilateral Tariff Rate (%) (Pillar 1 Signal)

Landed Cost Estimate ($/Unit) (Pillar 1 Signal)

Action CTA: Button [Compare & Analyze Signals]

Controls & Filtering: Region Filter, Max Tariff Slider, Max Freight Cost, Min Search Velocity Filter, Table Text Search.

Cross-Component Interaction: Hovering or selecting a table row automatically highlights the matching node on the Bivariate Signal Matrix scatter plot.

5. Country Deep-Dive Slide-Over Drawer

Trigger: Click on any scatter node or table row CTA. Opens as a modal overlay (role="dialog").

Header: Destination Flag, Country Name, Active Export Origin, Close button (Esc).

Tabbed Signal Analytics:




Tab 1 (Demand Signals): Search Velocity vs. Social Media Buzz over time.

Tab 2 (Supply & Manifests): Weekly B/L TEU volume & spot ocean freight rates.

Tab 3 (Local E-Commerce): Out-of-stock rates, active competitor listings, local price inflation.

Tab 4 (Landed Cost Breakdown): MFN Tariffs, Preferential FTA rates, Freight costs, Import VAT.

Sticky Footer Bar:




CTA 1: [Export Executive PDF Report]

CTA 2: [Download CSV Raw Data]

Accessibility, Performance & Micro-Interactions

Keyboard Navigation:




Cmd+K / Ctrl+K: Focuses command search bar.

Escape: Closes active slide-over drawer or modal dialog.

Tab / Shift+Tab: Focus-trapped within active drawer overlays.

Loading & State Feedback: Skeleton loading overlays on data cards and table rows during active recalculations or API fetches.

Tooltips: Explanatory info-tooltips on complex column headers (e.g., Landed Cost breakdown methodology).

Responsive Layout: Grid dynamically reorganizes from multi-column desktop views into single-column layouts for tablet and mobile viewports.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8c7304b2-7f36-48ae-af85-635cb9f41c0a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
