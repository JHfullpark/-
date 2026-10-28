export interface StockItem {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  preMarketGap: number;
  rvol: number;
  dollarVolume: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  vwap: number;
  hasGradeACatalyst: boolean;
  catalystType?: "EARNINGS_SURPRISE" | "EXCLUSIVE_CONTRACT" | "FDA_APPROVAL" | "BREAKTHROUGH_TECH" | "GOV_CONTRACT";
  catalystGrade?: "A+" | "A" | "A-";
  catalystTitle?: string;
  catalystDescription?: string;
  institutionalFlowScore?: number;
  institutionalRationale?: string;
  meetsSetupCriteria: boolean;
  vwapSupportConfirmed: boolean;
  keySupport: number;
  keyResistance: number;
  entryRangeMin: number;
  entryRangeMax: number;
  stopLoss: number;
  targetPrice1: number;
  targetPrice2: number;
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
  setupType?: "VWAP_PULLBACK_BOUNCE" | "ORB_BREAKOUT_RETEST" | "KEY_LEVEL_REVERSAL";
  executionStrategy?: {
    summary: string;
    trigger: string;
    invalidation: string;
    positionSizingTip: string;
    volumeCondition: string;
  };
}

export interface FilterParams {
  minRvol: number;
  minDollarVolume: number;
  minShares: number;
  minPrice: number;
  maxPrice: number;
  minGap: number;
  maxGap: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface TickerAnalysisData {
  ticker: string;
  companyName: string;
  sector: string;
  estimatedPrice: number;
  estimatedGap: number;
  estimatedRvol: number;
  stage1Verdict: {
    passed: boolean;
    rvolAnalysis: string;
    liquidityAnalysis: string;
    priceGapAnalysis: string;
  };
  stage2Verdict: {
    hasGradeACatalyst: boolean;
    catalystType: string;
    catalystGrade: string;
    catalystTitle: string;
    catalystDetail: string;
    institutionalInflowPotential: string;
  };
  stage3Strategy: {
    meetsSetup: boolean;
    vwapLevel: number;
    keySupport: number;
    keyResistance: number;
    entryPrice: number;
    stopLoss: number;
    targetPrice1: number;
    targetPrice2: number;
    riskRewardRatio: number;
    entryTrigger: string;
    invalidationRule: string;
    positionSizingGuide: string;
  };
  aiExecutiveSummary: string;
}
