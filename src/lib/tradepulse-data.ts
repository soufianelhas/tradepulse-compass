import type {
  ExportMarketFit,
  LandedCostLine,
  Market,
  Quadrant,
  SeriesPoint,
  Tone,
  TradeDataMarketFit,
} from "@/types/tradepulse";

export type {
  ExportMarketFit,
  LandedCostLine,
  Market,
  MarketSeriesBundle,
  Quadrant,
  Region,
  SeriesPoint,
  SummaryCardData,
  TableFilters,
  Tone,
  TradeDataMarketFit,
} from "@/types/tradepulse";

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

/* ---------------------------------------------------------------------------
 * Export Market Demand Fit — social listening & localized intelligence layer
 * ------------------------------------------------------------------------- */

interface FitFlavour {
  platforms: { platform: string; sharePercentage: number }[];
  marketplaces: string[];
  dialects: { dialectRegion: string; topIdioms: string[] }[];
  cultural: { attribute: string; status: "compliant" | "friction"; details: string }[];
  seasons: { eventName: string; month: string; volumeMultiplier: string }[];
  kols: { name: string; handle: string; platform: string }[];
  currencyPhrase: string;
}

const FLAVOURS: Record<Market["region"], FitFlavour> = {
  LATAM: {
    platforms: [
      { platform: "WhatsApp Groups", sharePercentage: 34 },
      { platform: "Instagram", sharePercentage: 24 },
      { platform: "TikTok", sharePercentage: 21 },
      { platform: "Mercado Livre Q&A", sharePercentage: 13 },
      { platform: "X / Twitter", sharePercentage: 8 },
    ],
    marketplaces: ["Mercado Libre", "Amazon MX", "Falabella"],
    dialects: [
      { dialectRegion: "Central / Capital", topIdioms: ["está padrísimo", "sale caro"] },
      { dialectRegion: "Northern Border", topIdioms: ["se agotó", "lo traen de allá"] },
      { dialectRegion: "Coastal South", topIdioms: ["no llega el envío", "vale la pena"] },
    ],
    cultural: [
      { attribute: "Spanish-first packaging", status: "friction", details: "English-only labels flagged in 18% of negative reviews." },
      { attribute: "Family / multi-user sizing", status: "compliant", details: "Large-format SKUs over-index in chatter." },
      { attribute: "Installment payment expectation", status: "friction", details: "Meses sin intereses demanded in 1 of 4 intent posts." },
    ],
    seasons: [
      { eventName: "El Buen Fin", month: "November", volumeMultiplier: "+3.4x" },
      { eventName: "Día de las Madres", month: "May", volumeMultiplier: "+2.1x" },
      { eventName: "Navidad", month: "December", volumeMultiplier: "+2.8x" },
    ],
    kols: [
      { name: "Valeria Ortiz", handle: "@valeoutdoors", platform: "Instagram" },
      { name: "Rodrigo Salas", handle: "@salastech", platform: "TikTok" },
      { name: "Camila Reyes", handle: "@camilareviews", platform: "YouTube" },
    ],
    currencyPhrase: "precio en pesos",
  },
  APAC: {
    platforms: [
      { platform: "LINE / Zalo", sharePercentage: 29 },
      { platform: "TikTok", sharePercentage: 27 },
      { platform: "Shopee Community", sharePercentage: 19 },
      { platform: "Facebook Groups", sharePercentage: 16 },
      { platform: "Local forums", sharePercentage: 9 },
    ],
    marketplaces: ["Shopee", "Lazada", "Tokopedia"],
    dialects: [
      { dialectRegion: "Capital metro", topIdioms: ["hàng nhập", "giá tốt"] },
      { dialectRegion: "Secondary cities", topIdioms: ["ship lâu", "chính hãng?"] },
    ],
    cultural: [
      { attribute: "Halal certification", status: "friction", details: "Requested in 22% of household-category threads." },
      { attribute: "Compact-living form factor", status: "compliant", details: "Foldable / small-footprint framing resonates strongly." },
      { attribute: "Livestream-first discovery", status: "compliant", details: "Peak intent occurs during evening live sessions." },
    ],
    seasons: [
      { eventName: "Ramadan / Lebaran", month: "March", volumeMultiplier: "+3.2x" },
      { eventName: "9.9 / 11.11 Mega Sale", month: "November", volumeMultiplier: "+4.1x" },
      { eventName: "Lunar New Year", month: "February", volumeMultiplier: "+2.6x" },
    ],
    kols: [
      { name: "Anh Pham", handle: "@anhreviewz", platform: "TikTok" },
      { name: "Dewi Larasati", handle: "@dewihaul", platform: "Instagram" },
      { name: "Kenji Tan", handle: "@kenjiunbox", platform: "YouTube" },
    ],
    currencyPhrase: "giá nhập khẩu",
  },
  EMEA: {
    platforms: [
      { platform: "WhatsApp Groups", sharePercentage: 26 },
      { platform: "Instagram", sharePercentage: 23 },
      { platform: "TikTok", sharePercentage: 18 },
      { platform: "Reddit / forums", sharePercentage: 18 },
      { platform: "YouTube", sharePercentage: 15 },
    ],
    marketplaces: ["Amazon EU", "Allegro", "Jumia"],
    dialects: [
      { dialectRegion: "Metropolitan", topIdioms: ["gutes Preis-Leistungs-Verhältnis", "schnell geliefert"] },
      { dialectRegion: "Regional / rural", topIdioms: ["Ersatzteile?", "lange Lieferzeit"] },
    ],
    cultural: [
      { attribute: "CE marking & EPR compliance", status: "compliant", details: "Documentation cited positively in seller threads." },
      { attribute: "Repairability / spare parts", status: "friction", details: "Top complaint cluster in long-form reviews." },
      { attribute: "Recyclable packaging", status: "compliant", details: "Sustainability mentions skew 71% positive." },
    ],
    seasons: [
      { eventName: "Ramadan", month: "March", volumeMultiplier: "+2.4x" },
      { eventName: "Black Friday", month: "November", volumeMultiplier: "+3.6x" },
      { eventName: "Back to school", month: "September", volumeMultiplier: "+1.9x" },
    ],
    kols: [
      { name: "Youssef Amrani", handle: "@youssef.tech", platform: "Instagram" },
      { name: "Lena Brandt", handle: "@lenatests", platform: "YouTube" },
      { name: "Zineb El Fassi", handle: "@zinebhome", platform: "TikTok" },
    ],
    currencyPhrase: "prix import",
  },
  NA: {
    platforms: [
      { platform: "TikTok", sharePercentage: 28 },
      { platform: "Reddit", sharePercentage: 24 },
      { platform: "YouTube", sharePercentage: 21 },
      { platform: "Instagram", sharePercentage: 17 },
      { platform: "Amazon Q&A", sharePercentage: 10 },
    ],
    marketplaces: ["Amazon US", "Walmart.com", "Target.com"],
    dialects: [
      { dialectRegion: "West Coast", topIdioms: ["worth the hype", "shipping took forever"] },
      { dialectRegion: "Midwest / South", topIdioms: ["built cheap", "great value"] },
    ],
    cultural: [
      { attribute: "FCC / UL certification", status: "compliant", details: "Certification badges reduce purchase hesitation." },
      { attribute: "Warranty & returns clarity", status: "friction", details: "Return policy ambiguity drives 14% of negative chatter." },
      { attribute: "Prop 65 labeling", status: "friction", details: "Mentioned in listing-suppression discussions." },
    ],
    seasons: [
      { eventName: "Prime Day", month: "July", volumeMultiplier: "+2.9x" },
      { eventName: "Black Friday", month: "November", volumeMultiplier: "+4.3x" },
      { eventName: "Holiday gifting", month: "December", volumeMultiplier: "+3.1x" },
    ],
    kols: [
      { name: "Marcus Hale", handle: "@haletested", platform: "YouTube" },
      { name: "Jenna Cole", handle: "@jennafinds", platform: "TikTok" },
      { name: "Priya Raman", handle: "@priyagear", platform: "Instagram" },
    ],
    currencyPhrase: "landed price",
  },
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export function getMarketFit(m: Market): ExportMarketFit {
  const f = FLAVOURS[m.region];
  const heat = Math.max(5, m.searchVelocity);
  const volume = round1(38 + heat * 0.9 + m.stockoutRate * 1.4);
  const localShare = Math.min(88, Math.max(22, Math.round(58 - m.searchVelocity / 6 + m.tariffRate * 0.6)));

  return {
    demandSignals: {
      categoryVolume: `${volume.toFixed(1)}K mentions/mo`,
      growthVelocityMom: round1(m.searchVelocity / 5.8),
      explicitIntentPhrases: [
        { phrase: `where can I buy ${m.country === "Mexico" ? "en México" : "locally"}`, count: Math.round(1200 + heat * 24), growth: signum(m.searchVelocity * 0.7) + "%" },
        { phrase: "is it available for import", count: Math.round(760 + heat * 15), growth: signum(m.searchVelocity * 0.5) + "%" },
        { phrase: `${f.currencyPhrase}`, count: Math.round(540 + heat * 11), growth: signum(m.searchVelocity * 0.4) + "%" },
        { phrase: "which store has it in stock", count: Math.round(410 + m.stockoutRate * 22), growth: signum(m.stockoutRate * 0.9) + "%" },
      ],
      crossBorderChatterVolume: `${round1(3.2 + heat / 9).toFixed(1)}K queries`,
      unmetNeedClusters: [
        { topic: "Packaging arrives damaged", sentimentRatio: round1(-0.4 - m.stockoutRate / 90), complaintShare: `${round1(9 + m.stockoutRate / 4).toFixed(1)}%` },
        { topic: "No local after-sales support", sentimentRatio: round1(-0.3 - m.tariffRate / 90), complaintShare: `${round1(7 + m.tariffRate / 3).toFixed(1)}%` },
        { topic: "Stock never restocked", sentimentRatio: round1(-0.2 - m.stockoutRate / 120), complaintShare: `${round1(5 + m.stockoutRate / 5).toFixed(1)}%` },
        { topic: "Missing local-voltage variant", sentimentRatio: -0.15, complaintShare: "4.6%" },
      ],
    },
    competitiveBenchmark: {
      localVsImportedSOV: { localShare, importShare: 100 - localShare },
      netSentimentGap: { brandSentiment: round1(18 + m.searchVelocity / 12), incumbentSentiment: round1(6 + m.teuVolume / 8) },
      featurePreferenceMatrix: [
        { attribute: "Durability", importanceScore: 92, sentiment: "negative" },
        { attribute: "Price / value", importanceScore: 88, sentiment: m.tariffRate > 10 ? "negative" : "positive" },
        { attribute: "Delivery speed", importanceScore: 74, sentiment: m.freightCost > 3000 ? "negative" : "neutral" },
        { attribute: "Design & finish", importanceScore: 61, sentiment: "positive" },
        { attribute: "Local warranty", importanceScore: 57, sentiment: "neutral" },
      ],
      priceSensitivityChatter: { category: "Mid-tier import segment", intensityScore: Math.min(99, Math.round(48 + m.tariffRate * 1.6 + m.landedCost / 6)) },
    },
    localizationContext: {
      geoLinguisticSentiment: f.dialects.map((d, i) => ({
        dialectRegion: d.dialectRegion,
        sentimentScore: round1(0.42 - i * 0.14 + m.searchVelocity / 500),
        topIdioms: d.topIdioms,
      })),
      usageContexts: [
        { occasion: "Daily routine", frequencyShare: 38 },
        { occasion: "Gift-giving", frequencyShare: 24 },
        { occasion: "Small business use", frequencyShare: 21 },
        { occasion: "Travel / outdoor", frequencyShare: 17 },
      ],
      culturalAttributeSentiment: f.cultural,
      seasonalSpikes: f.seasons,
    },
    channelMapping: {
      platformDistribution: f.platforms,
      topKOLs: f.kols.map((k, i) => ({
        ...k,
        engagementRate: `${round1(7.4 - i * 1.6 + m.searchVelocity / 90).toFixed(1)}%`,
        reach: `${round1(1.8 - i * 0.5 + heat / 120).toFixed(1)}M`,
      })),
      eCommerceReviewSentiment: f.marketplaces.slice(0, 2).map((marketplace, i) => ({
        marketplace,
        averageRating: round1(4.4 - i * 0.5 - m.stockoutRate / 120),
        positiveAspects: ["Build quality", "Value for money", "Compact design"],
        negativeAspects: i === 0 ? ["Slow delivery", "Damaged packaging"] : ["Unclear warranty", "Counterfeit sellers"],
      })),
    },
    operationalRisks: {
      customsChatterSpikes: [
        {
          issue: "Unexpected duty charged on delivery",
          severity: m.tariffRate > 15 ? "high" : m.tariffRate > 5 ? "medium" : "low",
          trend: signum(m.tariffRate * 1.4) + "% MoM",
        },
        {
          issue: "Clearance delays at port of entry",
          severity: m.freightCost > 3400 ? "high" : m.freightCost > 2400 ? "medium" : "low",
          trend: signum(m.freightCost / 220) + "% MoM",
        },
        {
          issue: "Missing import documentation",
          severity: "low",
          trend: signum(m.teuVolume / 4) + "% MoM",
        },
      ],
      logisticsComplaintsShare: round1(12 + m.freightCost / 260),
      counterfeitMentionsShare: round1(4 + m.searchVelocity / 22),
    },
  };
}

/* ------------------------------------------------------------------ *
 * MODULE 2 — Trade Data Market Fit (raw trade intelligence, 6 layers)
 * Kept fully separate from the social-listening ExportMarketFit layer.
 * ------------------------------------------------------------------ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TRADE_PROFILE: Record<
  string,
  {
    tariffLineSuffix: string;
    fta: string | null;
    ftaRate: number | null;
    currency: { currencyCode: string; changeYoYPercent: number; stability: "Stable" | "Moderate" | "Volatile" };
    risk: { creditRating: string; easeOfImportRank: number };
    transitDays: number;
    suppliers: { country: string; flag: string; marketSharePercent: number }[];
  }
> = {
  mx: {
    tariffLineSuffix: "5090",
    fta: "USMCA",
    ftaRate: 0,
    currency: { currencyCode: "MXN", changeYoYPercent: -3.4, stability: "Moderate" },
    risk: { creditRating: "BBB", easeOfImportRank: 61 },
    transitDays: 26,
    suppliers: [
      { country: "China", flag: "🇨🇳", marketSharePercent: 48 },
      { country: "United States", flag: "🇺🇸", marketSharePercent: 27 },
      { country: "Vietnam", flag: "🇻🇳", marketSharePercent: 11 },
      { country: "Germany", flag: "🇩🇪", marketSharePercent: 8 },
      { country: "Others", flag: "🌐", marketSharePercent: 6 },
    ],
  },
  br: {
    tariffLineSuffix: "0000",
    fta: "Mercosur",
    ftaRate: 12,
    currency: { currencyCode: "BRL", changeYoYPercent: -8.1, stability: "Volatile" },
    risk: { creditRating: "BB", easeOfImportRank: 108 },
    transitDays: 38,
    suppliers: [
      { country: "China", flag: "🇨🇳", marketSharePercent: 56 },
      { country: "Argentina", flag: "🇦🇷", marketSharePercent: 14 },
      { country: "United States", flag: "🇺🇸", marketSharePercent: 12 },
      { country: "Others", flag: "🌐", marketSharePercent: 18 },
    ],
  },
  ae: {
    tariffLineSuffix: "0010",
    fta: "GCC Common Tariff",
    ftaRate: 0,
    currency: { currencyCode: "AED", changeYoYPercent: 0.1, stability: "Stable" },
    risk: { creditRating: "AA-", easeOfImportRank: 16 },
    transitDays: 21,
    suppliers: [
      { country: "China", flag: "🇨🇳", marketSharePercent: 44 },
      { country: "India", flag: "🇮🇳", marketSharePercent: 19 },
      { country: "Turkey", flag: "🇹🇷", marketSharePercent: 13 },
      { country: "Others", flag: "🌐", marketSharePercent: 24 },
    ],
  },
  vn: {
    tariffLineSuffix: "9000",
    fta: "CPTPP",
    ftaRate: 0,
    currency: { currencyCode: "VND", changeYoYPercent: -2.2, stability: "Moderate" },
    risk: { creditRating: "BB+", easeOfImportRank: 74 },
    transitDays: 12,
    suppliers: [
      { country: "China", flag: "🇨🇳", marketSharePercent: 62 },
      { country: "South Korea", flag: "🇰🇷", marketSharePercent: 15 },
      { country: "Japan", flag: "🇯🇵", marketSharePercent: 9 },
      { country: "Others", flag: "🌐", marketSharePercent: 14 },
    ],
  },
  de: {
    tariffLineSuffix: "0080",
    fta: "EU Common Customs Tariff",
    ftaRate: 2.7,
    currency: { currencyCode: "EUR", changeYoYPercent: 1.4, stability: "Stable" },
    risk: { creditRating: "AAA", easeOfImportRank: 8 },
    transitDays: 34,
    suppliers: [
      { country: "China", flag: "🇨🇳", marketSharePercent: 39 },
      { country: "Poland", flag: "🇵🇱", marketSharePercent: 17 },
      { country: "Netherlands", flag: "🇳🇱", marketSharePercent: 12 },
      { country: "Others", flag: "🌐", marketSharePercent: 32 },
    ],
  },
  us: {
    tariffLineSuffix: "5090",
    fta: null,
    ftaRate: null,
    currency: { currencyCode: "USD", changeYoYPercent: 0, stability: "Stable" },
    risk: { creditRating: "AA+", easeOfImportRank: 5 },
    transitDays: 30,
    suppliers: [
      { country: "China", flag: "🇨🇳", marketSharePercent: 51 },
      { country: "Mexico", flag: "🇲🇽", marketSharePercent: 21 },
      { country: "Vietnam", flag: "🇻🇳", marketSharePercent: 13 },
      { country: "Others", flag: "🌐", marketSharePercent: 15 },
    ],
  },
};

const DEFAULT_SUPPLIERS = [
  { country: "China", flag: "🇨🇳", marketSharePercent: 46 },
  { country: "Germany", flag: "🇩🇪", marketSharePercent: 16 },
  { country: "United States", flag: "🇺🇸", marketSharePercent: 12 },
  { country: "Turkey", flag: "🇹🇷", marketSharePercent: 9 },
  { country: "Others", flag: "🌐", marketSharePercent: 17 },
];

const seasonalShape = [6.4, 5.9, 7.1, 7.8, 8.4, 8.9, 9.6, 9.2, 8.7, 9.8, 10.4, 7.8];

export function getTradeFit(m: Market): TradeDataMarketFit {
  const p = TRADE_PROFILE[m.id];
  const suppliers = p?.suppliers ?? DEFAULT_SUPPLIERS;
  const hhi = Math.round(suppliers.reduce((acc, s) => acc + s.marketSharePercent ** 2, 0));
  const hhiMarketType: TradeDataMarketFit["supplyConcentration"]["hhiMarketType"] =
    hhi > 2500 ? "Highly Concentrated" : hhi > 1500 ? "Moderately Concentrated" : "Diversified";

  const unitValue = round1(m.landedCost * 1.62);
  const fob = round1(m.landedCost * 0.68);
  const freightIns = round1(m.freightCost / 240 + 3.4);
  const duty = round1((fob * m.tariffRate) / 100);
  const importValue = Math.round((28_000_000 + m.teuVolume * 640_000 + m.searchVelocity * 210_000) / 1000) * 1000;

  return {
    macroDemand: {
      hsCode6: "8716.80",
      nationalTariffLine: `8716.80.${p?.tariffLineSuffix ?? "0000"}`,
      annualImportValueUsd: Math.max(4_000_000, importValue),
      annualImportQuantity: { value: Math.round(Math.max(4_000_000, importValue) / unitValue), unit: "units" },
      cagr3To5Yr: round1(4.8 + m.searchVelocity / 14),
      yoyGrowth: round1(m.teuVolume + m.searchVelocity / 6),
      seasonalityMonths: MONTHS.map((month, i) => ({
        month,
        importSharePercent: round1(seasonalShape[i]! + (i === 10 ? m.stockoutRate / 40 : 0)),
      })),
    },
    commercialPricing: {
      averageUnitValueUsd: unitValue,
      unitValueSegment: unitValue > 170 ? "premium" : unitValue > 95 ? "mid-tier" : "economy",
      multiYearPriceTrend: [2021, 2022, 2023, 2024, 2025].map((year, i) => ({
        year,
        unitPriceUsd: round1(unitValue * (0.84 + i * 0.04) + (i === 1 ? 4.2 : 0)),
      })),
      landedCostBreakdownUsd: {
        fobPrice: fob,
        estimatedFreightInsurance: freightIns,
        appliedDutyCost: duty,
        effectiveLandedPrice: round1(fob + freightIns + duty),
      },
    },
    tariffAndRegulatory: {
      mfnTariffRatePercent: m.tariffRate,
      preferentialFtaRatePercent: p?.ftaRate ?? null,
      activeFtaName: p?.fta ?? null,
      nonTariffMeasures: [
        {
          type: "TBT",
          title: "Electrical safety & EMC conformity",
          mandatoryCertifications: m.region === "EMEA" ? ["CE", "UKCA", "RoHS"] : ["UL / IEC 60335", "FCC Part 15"],
        },
        {
          type: "Labeling",
          title: "Local-language labeling & country of origin marking",
          mandatoryCertifications: m.region === "LATAM" ? ["NOM-024", "Spanish label"] : ["Origin mark", "Local-language manual"],
        },
        {
          type: "Pre-Shipment",
          title: "Pre-shipment inspection for consumer mobility goods",
          mandatoryCertifications: ["PSI certificate", "Packing list attestation"],
        },
      ],
      tradeBarriers:
        m.tariffRate >= 20
          ? [
              {
                type: "Anti-Dumping",
                description: "Provisional anti-dumping duty on lithium-powered wheeled goods from selected origins.",
                impactLevel: "high",
              },
            ]
          : m.tariffRate >= 10
            ? [{ type: "Quota", description: "Tariff-rate quota applies above 12,000 units per calendar year.", impactLevel: "medium" }]
            : [{ type: "Quota", description: "No active quota; standard clearance regime.", impactLevel: "low" }],
    },
    supplyConcentration: {
      supplyingCountriesBreakdown: suppliers,
      hhiIndexScore: hhi,
      hhiMarketType,
      shipmentRecords: {
        activeBuyerCount: Math.round(180 + m.searchVelocity * 2.4),
        activeSupplierCount: Math.round(60 + m.teuVolume * 1.8 + 20),
        annualTeuVolume: Math.round(9_000 + m.teuVolume * 220 + m.landedCost * 30),
      },
    },
    algorithmicFitScores: {
      tradeComplementarityScore: Math.min(99, Math.round(52 + m.searchVelocity / 4 - m.tariffRate / 2)),
      marketAttractivenessIndex: Math.min(
        99,
        Math.round(46 + m.searchVelocity / 3.4 - m.tariffRate * 0.9 - m.freightCost / 400 + m.stockoutRate / 4),
      ),
      competitiveDistanceUsd: round1(fob - unitValue * 0.62),
    },
    logisticsAndMacro: {
      averageTransitDays: p?.transitDays ?? 28,
      spotFreightRatePerTeuUsd: m.freightCost,
      currencyVolatilityIndex: p?.currency ?? { currencyCode: "USD", changeYoYPercent: -1.2, stability: "Moderate" },
      geopoliticalSovereignRisk: p?.risk ?? { creditRating: "BBB-", easeOfImportRank: 84 },
    },
  };
}
