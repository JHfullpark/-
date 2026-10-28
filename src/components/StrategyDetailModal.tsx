import React, { useState } from "react";
import { StockItem } from "../types";
import { TechnicalChart } from "./TechnicalChart";
import {
  X,
  Target,
  ShieldAlert,
  TrendingUp,
  DollarSign,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Award,
  Zap,
  BarChart2,
  Copy,
  Check,
} from "lucide-react";

interface StrategyDetailModalProps {
  stock: StockItem | null;
  onClose: () => void;
  onAnalyzeTicker: (ticker: string) => void;
}

export const StrategyDetailModal: React.FC<StrategyDetailModalProps> = ({
  stock,
  onClose,
  onAnalyzeTicker,
}) => {
  const [accountSize, setAccountSize] = useState<number>(20000); // $20,000 account
  const [riskPercent, setRiskPercent] = useState<number>(1.0); // 1% risk
  const [copied, setCopied] = useState(false);

  if (!stock) return null;

  const entryMid = (stock.entryRangeMin + stock.entryRangeMax) / 2;
  const riskPerShare = entryMid - stock.stopLoss;
  const rewardPerShare = stock.targetPrice2 - entryMid;
  const maxRiskDollar = (accountSize * riskPercent) / 100;
  const suggestedShares = riskPerShare > 0 ? Math.floor(maxRiskDollar / riskPerShare) : 0;
  const totalPositionCost = (suggestedShares * entryMid).toFixed(2);
  const potentialProfitDollar = (suggestedShares * rewardPerShare).toFixed(2);

  const handleCopyStrategy = () => {
    const text = `[알파 스나이퍼 매수 전략 - $${stock.ticker}]
• 현재가: $${stock.currentPrice} (갭: +${stock.preMarketGap}%, RVOL: ${stock.rvol}x)
• A급 촉매: ${stock.catalystTitle}
• 진입가 범위: $${stock.entryRangeMin} ~ $${stock.entryRangeMax} (VWAP: $${stock.vwap})
• 손절가(SL): $${stock.stopLoss} (리스크 -$${riskPerShare.toFixed(2)})
• 1차 목표가(TP1): $${stock.targetPrice1}
• 2차 목표가(TP2): $${stock.targetPrice2} (수익 +$${rewardPerShare.toFixed(2)})
• 손익비(Risk:Reward): 1 : ${stock.riskRewardRatio}
• 진입 트리거: ${stock.executionStrategy?.trigger || "VWAP 지지 확인 후 진입"}
• 무효화 기준: ${stock.executionStrategy?.invalidation || "지지선 이탈 시 칼손절"}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-emerald-500/50 flex flex-col items-center justify-center font-mono">
              <span className="text-sm font-black text-white">{stock.ticker}</span>
              <span className="text-[9px] text-emerald-400 font-bold">
                1:{stock.riskRewardRatio}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {stock.companyName}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                현재가 ${stock.currentPrice} · 장전 갭 +{stock.preMarketGap}% · RVOL {stock.rvol}x
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyStrategy}
              title="전략 복사"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "복사됨" : "전략 복사"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Technical Chart Module with VWAP & Trade Lines */}
          <TechnicalChart stock={stock} />

          {/* Catalyst Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {stock.catalystTitle}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                촉매 {stock.catalystGrade || "A"}급
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {stock.catalystDescription}
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <strong className="text-amber-300">스마트머니 연속성: </strong>
              {stock.institutionalRationale}
            </p>
          </div>

          {/* Key Price Levels Table */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" />
                장중 매수 타점 & 손익비 구조화 테이블
              </h4>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Risk/Reward 1 : {stock.riskRewardRatio}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-center">
                <span className="text-[10px] text-rose-300 block mb-0.5">손절가 (Stop Loss)</span>
                <span className="text-sm font-bold text-rose-400">${stock.stopLoss.toFixed(2)}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">-${riskPerShare.toFixed(2)}/주</span>
              </div>

              <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-center">
                <span className="text-[10px] text-cyan-300 block mb-0.5">VWAP 기준선</span>
                <span className="text-sm font-bold text-cyan-400">${stock.vwap.toFixed(2)}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">핵심 지지선</span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                <span className="text-[10px] text-emerald-300 block mb-0.5">권장 진입가</span>
                <span className="text-sm font-bold text-emerald-400">${stock.entryRangeMin.toFixed(2)}~${stock.entryRangeMax.toFixed(2)}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">눌림목 안착 시</span>
              </div>

              <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-center">
                <span className="text-[10px] text-purple-300 block mb-0.5">2차 목표가 (TP2)</span>
                <span className="text-sm font-bold text-purple-400">${stock.targetPrice2.toFixed(2)}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">+${rewardPerShare.toFixed(2)}/주</span>
              </div>
            </div>
          </div>

          {/* Interactive Position Sizing & Risk Calculator */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" />
                스마트 포지션 사이징 & 리스크 계산기
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                총 손실 한도: <strong className="text-rose-400">${maxRiskDollar.toFixed(0)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  내 트레이딩 계좌 총액 ($)
                </label>
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Math.max(100, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  1회 거래당 리스크 한도 (%)
                </label>
                <div className="flex items-center gap-1">
                  {[0.5, 1.0, 2.0].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setRiskPercent(pct)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                        riskPercent === pct
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">권장 매수 수량:</span>
                <span className="text-white font-bold">{suggestedShares} 주</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">총 매수 투입 금액:</span>
                <span className="text-white font-bold">${totalPositionCost}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-rose-400">손절 시 최대 손실 (1%):</span>
                <span className="text-rose-400 font-bold">-${(suggestedShares * riskPerShare).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">목표가 도달 시 기대 수익:</span>
                <span className="text-emerald-400 font-bold">+${potentialProfitDollar}</span>
              </div>
            </div>
          </div>

          {/* Strategy Details */}
          {stock.executionStrategy && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <h5 className="font-semibold text-slate-200 text-xs">
                📋 단계별 진입 및 청산 가이드
              </h5>
              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <p>• <strong>진입 트리거:</strong> {stock.executionStrategy.trigger}</p>
                <p>• <strong>무효화 기준:</strong> {stock.executionStrategy.invalidation}</p>
                <p>• <strong>거래량 확인:</strong> {stock.executionStrategy.volumeCondition}</p>
                <p>• <strong>자금 관리:</strong> {stock.executionStrategy.positionSizingTip}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
