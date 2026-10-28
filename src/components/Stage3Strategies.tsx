import React, { useState } from "react";
import { StockItem } from "../types";
import {
  Target,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface Stage3StrategiesProps {
  stocks: StockItem[];
  onSelectStockDetail: (stock: StockItem) => void;
  onAnalyzeTicker: (ticker: string) => void;
}

export const Stage3Strategies: React.FC<Stage3StrategiesProps> = ({
  stocks,
  onSelectStockDetail,
  onAnalyzeTicker,
}) => {
  const [sortBy, setSortBy] = useState<"rr" | "rvol" | "gap">("rr");

  const sortedStocks = [...stocks].sort((a, b) => {
    if (sortBy === "rr") return b.riskRewardRatio - a.riskRewardRatio;
    if (sortBy === "rvol") return b.rvol - a.rvol;
    return b.preMarketGap - a.preMarketGap;
  });

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              STAGE 3 FINAL PICK
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              장중 타점 & 손익비 1:2 최적 매수 전략 ({stocks.length}선)
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            A급 재료를 보유한 50종목 중 <strong className="text-cyan-300">VWAP(거래량 가중 평균가) 지지</strong>,
            명확한 <strong className="text-emerald-300">지지선·저항선</strong> 및{" "}
            <strong className="text-yellow-300">최소 1:2 이상의 Risk/Reward 구조</strong>를 충족한 종목별 구체적 매수 실행 계획입니다.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 font-mono">정렬:</span>
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setSortBy("rr")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                sortBy === "rr" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              손익비(R:R)순
            </button>
            <button
              onClick={() => setSortBy("rvol")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                sortBy === "rvol" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              RVOL 순
            </button>
            <button
              onClick={() => setSortBy("gap")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                sortBy === "gap" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              갭 크기순
            </button>
          </div>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sortedStocks.map((stock) => {
          const entryMid = (stock.entryRangeMin + stock.entryRangeMax) / 2;
          const riskPercent = (((entryMid - stock.stopLoss) / entryMid) * 100).toFixed(1);
          const rewardPercent = (((stock.targetPrice2 - entryMid) / entryMid) * 100).toFixed(1);

          return (
            <div
              key={stock.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition-all duration-200 hover:shadow-emerald-950/30 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Ticker, Name, Sector & Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col items-center justify-center font-mono shadow-inner">
                      <span className="text-sm font-extrabold text-white tracking-wider">
                        {stock.ticker}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold">
                        1:{stock.riskRewardRatio}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {stock.companyName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                          {stock.sector}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                        <span>현재가: <strong className="text-white">${stock.currentPrice.toFixed(2)}</strong></span>
                        <span>·</span>
                        <span className="text-emerald-400 font-semibold">
                          장전 갭: +{stock.preMarketGap.toFixed(1)}%
                        </span>
                        <span>·</span>
                        <span className="text-cyan-400 font-semibold">
                          RVOL: {stock.rvol.toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Catalyst Grade Badge */}
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-mono">
                      <Award className="w-3 h-3 text-amber-400" />
                      촉매 {stock.catalystGrade || "A"}급
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">
                      수급점수 {stock.institutionalFlowScore}점
                    </span>
                  </div>
                </div>

                {/* Catalyst Summary */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="line-clamp-1">{stock.catalystTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {stock.catalystDescription}
                  </p>
                </div>

                {/* Risk-Reward & Key Technical Levels Visualization */}
                <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 mb-4 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      손익비(Risk : Reward 구조)
                    </span>
                    <span className="text-emerald-400 font-bold text-sm bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      1 : {stock.riskRewardRatio} (리스크 -{riskPercent}% vs 수익 +{rewardPercent}%)
                    </span>
                  </div>

                  {/* Visual Price Roadmap */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span className="text-rose-400 font-semibold">
                        손절가: ${stock.stopLoss.toFixed(2)}
                      </span>
                      <span className="text-cyan-300 font-semibold">
                        VWAP: ${stock.vwap.toFixed(2)}
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        진입가: ${stock.entryRangeMin.toFixed(2)}~${stock.entryRangeMax.toFixed(2)}
                      </span>
                      <span className="text-purple-400 font-semibold">
                        2차목표: ${stock.targetPrice2.toFixed(2)}
                      </span>
                    </div>

                    {/* Progress Bar of Levels */}
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex relative border border-slate-700/60">
                      {/* Risk Section */}
                      <div
                        className="bg-rose-500/80 h-full flex items-center justify-center text-[9px] text-white font-bold"
                        style={{ width: "25%" }}
                        title="리스크 구간 (손절폭)"
                      >
                        Risk
                      </div>
                      {/* Buffer/VWAP Entry Zone */}
                      <div
                        className="bg-cyan-500/80 h-full flex items-center justify-center text-[9px] text-slate-950 font-bold"
                        style={{ width: "15%" }}
                        title="VWAP 지지 및 진입존"
                      >
                        Zone
                      </div>
                      {/* Reward 1 */}
                      <div
                        className="bg-emerald-500/80 h-full flex items-center justify-center text-[9px] text-slate-950 font-bold"
                        style={{ width: "30%" }}
                        title="1차 익절 TP1 구간"
                      >
                        TP1 (+{(Number(riskPercent) * 1.4).toFixed(1)}%)
                      </div>
                      {/* Reward 2 */}
                      <div
                        className="bg-purple-500/80 h-full flex items-center justify-center text-[9px] text-white font-bold"
                        style={{ width: "30%" }}
                        title="2차 목표가 TP2 구간"
                      >
                        TP2 (+{rewardPercent}%)
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-sans">
                      <span className="text-slate-400">
                        핵심 지지: <strong className="text-slate-200">${stock.keySupport.toFixed(2)}</strong>
                      </span>
                      <span className="text-slate-400">
                        1차 목표: <strong className="text-emerald-300">${stock.targetPrice1.toFixed(2)}</strong>
                      </span>
                      <span className="text-slate-400">
                        저항 매물대: <strong className="text-purple-300">${stock.keyResistance.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Execution Strategy Rules */}
                {stock.executionStrategy && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-semibold text-[11px] mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        진입 트리거 (Trigger)
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {stock.executionStrategy.trigger}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
                      <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-[11px] mb-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        손절 및 무효화 기준 (Invalidation)
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        {stock.executionStrategy.invalidation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectStockDetail(stock)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>상세 플랜 & 차트 타점</span>
                </button>

                <button
                  onClick={() => onAnalyzeTicker(stock.ticker)}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/40 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>실시간 AI 뉴스 검증</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
