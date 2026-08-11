/* Shared domain types for TradePulse. Kept free of data and logic so the
 * mock service layer can be swapped for a real backend without touching UI. */

export type Quadrant = "unmet" | "competitive" | "glut" | "dormant";

export type Tone = "green" | "amber" | "rose" | "muted";

export type Region = "LATAM" | "APAC" | "EMEA" | "NA";

export interface Market {
  id: string;
  country: string;
  flag: string;
  region: Region;
  searchVelocity: number; // 30d %
  teuVolume: number; // 60d %
  stockoutRate: number; // %
  tariffRate: number; // %
  landedCost: number; // $/unit
  freightCost: number; // $/TEU spot
  quadrant: Quadrant;
  note: string;
}

export interface TableFilters {
  region: string;
  maxTariff: number;
  maxFreight: number;
  minVelocity: number;
  text: string;
}

export interface SeriesPoint {
  week: string;
  a: number;
  b: number;
}

export interface LandedCostLine {
  label: string;
  value: number;
}

export interface MarketSeriesBundle {
  demand: SeriesPoint[];
  supply: SeriesPoint[];
  commerce: SeriesPoint[];
  landedCost: LandedCostLine[];
}

export interface SummaryCardData {
  id: string;
  label: string;
  value: string;
  detail: string;
  icon: "trending" | "clock" | "ship" | "percent";
  tone: "green" | "amber" | "rose" | "cyan";
}

/* ---- Module 1: Social listening — Export Market Demand Fit ---- */

export interface ExportMarketFit {
  // 1. Demand & Purchase Intent Signals
  demandSignals: {
    categoryVolume: string;
    growthVelocityMom: number;
    explicitIntentPhrases: { phrase: string; count: number; growth: string }[];
    crossBorderChatterVolume: string;
    unmetNeedClusters: { topic: string; sentimentRatio: number; complaintShare: string }[];
  };

  // 2. Competitive & SOV Benchmarking
  competitiveBenchmark: {
    localVsImportedSOV: { localShare: number; importShare: number };
    netSentimentGap: { brandSentiment: number; incumbentSentiment: number };
    featurePreferenceMatrix: {
      attribute: string;
      importanceScore: number;
      sentiment: "positive" | "neutral" | "negative";
    }[];
    priceSensitivityChatter: { category: string; intensityScore: number };
  };

  // 3. Localization & Cultural Context
  localizationContext: {
    geoLinguisticSentiment: { dialectRegion: string; sentimentScore: number; topIdioms: string[] }[];
    usageContexts: { occasion: string; frequencyShare: number }[];
    culturalAttributeSentiment: { attribute: string; status: "compliant" | "friction"; details: string }[];
    seasonalSpikes: { eventName: string; month: string; volumeMultiplier: string }[];
  };

  // 4. Local Channel & Community Mapping
  channelMapping: {
    platformDistribution: { platform: string; sharePercentage: number }[];
    topKOLs: { name: string; handle: string; platform: string; engagementRate: string; reach: string }[];
    eCommerceReviewSentiment: {
      marketplace: string;
      averageRating: number;
      positiveAspects: string[];
      negativeAspects: string[];
    }[];
  };

  // 5. Market Friction & Operational Risks
  operationalRisks: {
    customsChatterSpikes: { issue: string; severity: "low" | "medium" | "high"; trend: string }[];
    logisticsComplaintsShare: number;
    counterfeitMentionsShare: number;
  };
}

/* ---- Module 2: Trade data market fit (raw trade intelligence, 6 layers) ---- */

export interface TradeDataMarketFit {
  macroDemand: {
    hsCode6: string;
    nationalTariffLine: string;
    annualImportValueUsd: number;
    annualImportQuantity: { value: number; unit: "metric_tons" | "units" | "kg" };
    cagr3To5Yr: number;
    yoyGrowth: number;
    seasonalityMonths: { month: string; importSharePercent: number }[];
  };
  commercialPricing: {
    averageUnitValueUsd: number;
    unitValueSegment: "premium" | "mid-tier" | "economy";
    multiYearPriceTrend: { year: number; unitPriceUsd: number }[];
    landedCostBreakdownUsd: {
      fobPrice: number;
      estimatedFreightInsurance: number;
      appliedDutyCost: number;
      effectiveLandedPrice: number;
    };
  };
  tariffAndRegulatory: {
    mfnTariffRatePercent: number;
    preferentialFtaRatePercent: number | null;
    activeFtaName: string | null;
    nonTariffMeasures: {
      type: "SPS" | "TBT" | "Pre-Shipment" | "Labeling";
      title: string;
      mandatoryCertifications: string[];
    }[];
    tradeBarriers: {
      type: "Anti-Dumping" | "Quota" | "Embargo";
      description: string;
      impactLevel: "low" | "medium" | "high";
    }[];
  };
  supplyConcentration: {
    supplyingCountriesBreakdown: { country: string; flag: string; marketSharePercent: number }[];
    hhiIndexScore: number;
    hhiMarketType: "Diversified" | "Moderately Concentrated" | "Highly Concentrated";
    shipmentRecords: { activeBuyerCount: number; activeSupplierCount: number; annualTeuVolume: number };
  };
  algorithmicFitScores: {
    tradeComplementarityScore: number;
    marketAttractivenessIndex: number;
    competitiveDistanceUsd: number;
  };
  logisticsAndMacro: {
    averageTransitDays: number;
    spotFreightRatePerTeuUsd: number;
    currencyVolatilityIndex: { currencyCode: string; changeYoYPercent: number; stability: "Stable" | "Moderate" | "Volatile" };
    geopoliticalSovereignRisk: { creditRating: string; easeOfImportRank: number };
  };
}
