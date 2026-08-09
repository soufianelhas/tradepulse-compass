export type Quadrant = "unmet" | "competitive" | "glut" | "dormant";

export interface Market {
  id: string;
  country: string;
  flag: string;
  region: "LATAM" | "APAC" | "EMEA" | "NA";
  searchVelocity: number; // 30d %
  teuVolume: number; // 60d %
  stockoutRate: number; // %
  tariffRate: number; // %
  landedCost: number; // $/unit
  freightCost: number; // $/TEU spot
  quadrant: Quadrant;
  note: string;
}

export const MARKETS: Market[] = [
  {
    id: "mx",
    country: "Mexico",
    flag: "🇲🇽",
    region: "LATAM",
    searchVelocity: 142.4,
    teuVolume: -4.1,
    stockoutRate: 38.6,
    tariffRate: 0,
    landedCost: 74.2,
    freightCost: 2840,
    quadrant: "unmet",
    note: "Veracruz inbound TEUs contracting while intent accelerates.",
  },
  {
    id: "br",
    country: "Brazil",
    flag: "🇧🇷",
    region: "LATAM",
    searchVelocity: 88.1,
    teuVolume: 3.2,
    stockoutRate: 27.4,
    tariffRate: 18,
    landedCost: 112.9,
    freightCost: 3410,
    quadrant: "unmet",
    note: "Santos manifests flat; Mercado Livre listings thin.",
  },
  {
    id: "ae",
    country: "UAE",
    flag: "🇦🇪",
    region: "EMEA",
    searchVelocity: 61.7,
    teuVolume: 22.5,
    stockoutRate: 11.2,
    tariffRate: 5,
    landedCost: 63.5,
    freightCost: 1920,
    quadrant: "competitive",
    note: "Jebel Ali re-export volume rising with demand.",
  },
  {
    id: "vn",
    country: "Vietnam",
    flag: "🇻🇳",
    region: "APAC",
    searchVelocity: 47.3,
    teuVolume: 31.8,
    stockoutRate: 8.4,
    tariffRate: 0,
    landedCost: 55.8,
    freightCost: 1180,
    quadrant: "competitive",
    note: "CPTPP preferential lane, dense competitor set.",
  },
  {
    id: "de",
    country: "Germany",
    flag: "🇩🇪",
    region: "EMEA",
    searchVelocity: -12.6,
    teuVolume: 26.4,
    stockoutRate: 3.1,
    tariffRate: 4.7,
    landedCost: 96.4,
    freightCost: 2610,
    quadrant: "glut",
    note: "Hamburg bonded inventory overhang, price deflation.",
  },
  {
    id: "us",
    country: "United States",
    flag: "🇺🇸",
    region: "NA",
    searchVelocity: 18.9,
    teuVolume: 44.2,
    stockoutRate: 5.6,
    tariffRate: 25,
    landedCost: 128.3,
    freightCost: 3980,
    quadrant: "glut",
    note: "Section 301 duty exposure plus heavy inbound supply.",
  },
  {
    id: "cl",
    country: "Chile",
    flag: "🇨🇱",
    region: "LATAM",
    searchVelocity: 96.8,
    teuVolume: -11.7,
    stockoutRate: 44.9,
    tariffRate: 0,
    landedCost: 81.6,
    freightCost: 3120,
    quadrant: "unmet",
    note: "San Antonio arrivals down; stockouts at record highs.",
  },
  {
    id: "pl",
    country: "Poland",
    flag: "🇵🇱",
    region: "EMEA",
    searchVelocity: 33.2,
    teuVolume: 9.6,
    stockoutRate: 16.8,
    tariffRate: 4.7,
    landedCost: 88.1,
    freightCost: 2480,
    quadrant: "competitive",
    note: "Gdansk lane steady, mid-tier competitor density.",
  },
  {
    id: "za",
    country: "South Africa",
    flag: "🇿🇦",
    region: "EMEA",
    searchVelocity: -6.4,
    teuVolume: -18.2,
    stockoutRate: 22.1,
    tariffRate: 15,
    landedCost: 104.7,
    freightCost: 3660,
    quadrant: "dormant",
    note: "Durban congestion suppressing both signals.",
  },
  {
    id: "id",
    country: "Indonesia",
    flag: "🇮🇩",
    region: "APAC",
    searchVelocity: 74.5,
    teuVolume: 14.9,
    stockoutRate: 19.7,
    tariffRate: 10,
    landedCost: 69.4,
    freightCost: 1540,
    quadrant: "competitive",
    note: "Tanjung Priok inbound accelerating alongside intent.",
  },
];

export const QUADRANT_META: Record<Quadrant, { label: string; tone: "green" | "amber" | "rose" | "muted" }> = {
  unmet: { label: "Unmet Demand", tone: "green" },
  competitive: { label: "Competitive Growth", tone: "amber" },
  glut: { label: "Over-Supply Risk", tone: "rose" },
  dormant: { label: "Dormant Lane", tone: "muted" },
};

export const toneClass = (tone: "green" | "amber" | "rose" | "muted") =>
  tone === "green"
    ? "signal-green"
    : tone === "amber"
      ? "signal-amber"
      : tone === "rose"
        ? "signal-rose"
        : "border border-border bg-surface-hover text-muted-foreground";

export const signum = (n: number) => (n > 0 ? `+${n.toFixed(1)}` : n.toFixed(1));

export interface SeriesPoint {
  week: string;
  a: number;
  b: number;
}

export function demandSeries(m: Market): SeriesPoint[] {
  return Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    a: Math.round(50 + (m.searchVelocity / 3) * (i / 11) + Math.sin(i) * 6),
    b: Math.round(40 + (m.searchVelocity / 5) * (i / 11) + Math.cos(i) * 8),
  }));
}

export function supplySeries(m: Market): SeriesPoint[] {
  return Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    a: Math.round(900 + m.teuVolume * 9 * (i / 11) + Math.sin(i * 1.3) * 60),
    b: Math.round(m.freightCost + Math.sin(i * 0.8) * 180),
  }));
}

export function commerceSeries(m: Market): SeriesPoint[] {
  return Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    a: Math.max(0, Math.round(m.stockoutRate + Math.sin(i * 0.9) * 6 - 3)),
    b: Math.round(120 + Math.cos(i * 0.7) * 18 + i * 2),
  }));
}

export function landedCostBreakdown(m: Market) {
  const goods = m.landedCost * 0.52;
  const freight = m.landedCost * 0.21;
  const tariff = m.landedCost * (m.tariffRate / 100) * 0.9;
  const vat = m.landedCost * 0.13;
  const handling = Math.max(0, m.landedCost - goods - freight - tariff - vat);
  return [
    { label: "Goods (FOB)", value: goods },
    { label: "Ocean Freight + Insurance", value: freight },
    { label: `Tariff Duty (${m.tariffRate}% applied)`, value: tariff },
    { label: "Import VAT / IVA", value: vat },
    { label: "Customs Brokerage & Handling", value: handling },
  ];
}
