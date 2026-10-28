import React, { useState, useEffect } from "react";
import { StockItem, FilterParams } from "./types";
import { Header } from "./components/Header";
import { FunnelProgress } from "./components/FunnelProgress";
import { Stage3Strategies } from "./components/Stage3Strategies";
import { Stage2Catalysts } from "./components/Stage2Catalysts";
import { Stage1Screening } from "./components/Stage1Screening";
import { TradingChatDrawer } from "./components/TradingChatDrawer";
import { TickerAnalysisModal } from "./components/TickerAnalysisModal";
import { StrategyDetailModal } from "./components/StrategyDetailModal";
import { FilterConfigModal } from "./components/FilterConfigModal";
import {
  Sparkles,
  Bot,
  RefreshCw,
  Target,
  ShieldCheck,
  TrendingUp,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"stage3" | "stage2" | "stage1">("stage3");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stage1Stocks, setStage1Stocks] = useState<StockItem[]>([]);
  const [stage2Stocks, setStage2Stocks] = useState<StockItem[]>([]);
  const [stage3Stocks, setStage3Stocks] = useState<StockItem[]>([]);
  const [stageCounts, setStageCounts] = useState({
    stage1Count: 0,
    stage2Count: 0,
    stage3Count: 0,
  });

  const [filterParams, setFilterParams] = useState<FilterParams>({
    minRvol: 2.0,
    minDollarVolume: 20000000,
    minShares: 1000000,
    minPrice: 10,
    maxPrice: 150,
    minGap: 3.0,
    maxGap: 8.0,
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedStockForDetail, setSelectedStockForDetail] = useState<StockItem | null>(null);
  const [selectedTickerForAnalysis, setSelectedTickerForAnalysis] = useState<string | null>(null);

  // Fetch full scan pipeline
  const runScreeningScan = async (params = filterParams, refresh = false) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          refresh,
        }),
      });

      if (!res.ok) {
        throw new Error("스캔 데이터를 가져오지 못했습니다.");
      }

      const data = await res.json();
      setStage1Stocks(data.stage1 || []);
      setStage2Stocks(data.stage2 || []);
      setStage3Stocks(data.stage3 || []);
      setStageCounts(data.counts || { stage1Count: 0, stage2Count: 0, stage3Count: 0 });
    } catch (err) {
      console.error("Screening scan failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runScreeningScan();
  }, []);

  const handleApplyFilters = (newParams: FilterParams) => {
    setFilterParams(newParams);
    runScreeningScan(newParams, true);
  };

  const handleSearchTicker = (ticker: string) => {
    setSelectedTickerForAnalysis(ticker);
  };

  const handleOpenChatWithTicker = (ticker: string) => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        onRefresh={() => runScreeningScan(filterParams, true)}
        isLoading={isLoading}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onSearchTicker={handleSearchTicker}
        stageCounts={stageCounts}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 3-Stage Selection Funnel Bar */}
        <FunnelProgress
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          counts={stageCounts}
        />

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab("stage3")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === "stage3"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>3단계 : VWAP & 1:2 타점 매수 전략 ({stageCounts.stage3Count})</span>
            </button>

            <button
              onClick={() => setCurrentTab("stage2")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === "stage2"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-950/50 ring-1 ring-amber-400"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2단계 : A급 재료 & 스마트머니 50선 ({stageCounts.stage2Count})</span>
            </button>

            <button
              onClick={() => setCurrentTab("stage1")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === "stage1"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1단계 : 기술적 모니터링 100선 ({stageCounts.stage1Count})</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> RVOL ≥ {filterParams.minRvol}x
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> 갭 +{filterParams.minGap}%~+{filterParams.maxGap}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> $20M+ or 1M주+
            </span>
          </div>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white font-mono">
                미국 주식 시장 실시간 모니터링 & 3단계 스크리닝 진행 중...
              </h3>
              <p className="text-xs text-slate-400">
                1단계 RVOL 2.0+ 100선 추출 → 2단계 A급 기관 촉매 50선 압축 → 3단계 VWAP 1:2 타점 확립
              </p>
            </div>
          </div>
        ) : (
          <>
            {currentTab === "stage3" && (
              <Stage3Strategies
                stocks={stage3Stocks}
                onSelectStockDetail={(stock) => setSelectedStockForDetail(stock)}
                onAnalyzeTicker={handleSearchTicker}
              />
            )}

            {currentTab === "stage2" && (
              <Stage2Catalysts
                stocks={stage2Stocks}
                onSelectStockDetail={(stock) => setSelectedStockForDetail(stock)}
                onAnalyzeTicker={handleSearchTicker}
                onGoToStage3={() => setCurrentTab("stage3")}
              />
            )}

            {currentTab === "stage1" && (
              <Stage1Screening
                stocks={stage1Stocks}
                onSelectStockDetail={(stock) => setSelectedStockForDetail(stock)}
                onAnalyzeTicker={handleSearchTicker}
                onGoToStage2={() => setCurrentTab("stage2")}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Action Bar / Mobile AI Chat Trigger */}
      <div className="fixed bottom-5 right-5 z-20">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-950/80 border border-white/20 transition-all transform hover:scale-105 active:scale-95 group"
        >
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: "3s" }} />
          <Bot className="w-5 h-5" />
          <span className="text-sm">알파 트레이딩 AI 브리핑</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
            Gemini
          </span>
        </button>
      </div>

      {/* Modals & Drawers */}
      <TradingChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAnalyzeTicker={handleSearchTicker}
      />

      <TickerAnalysisModal
        ticker={selectedTickerForAnalysis}
        onClose={() => setSelectedTickerForAnalysis(null)}
        onOpenChatWithTicker={handleOpenChatWithTicker}
      />

      <StrategyDetailModal
        stock={selectedStockForDetail}
        onClose={() => setSelectedStockForDetail(null)}
        onAnalyzeTicker={handleSearchTicker}
      />

      <FilterConfigModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        params={filterParams}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
