import React, { useState, useEffect } from "react";
import { TickerAnalysisData } from "../types";
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Target,
  ShieldAlert,
  Flame,
  Award,
  TrendingUp,
  RefreshCw,
  Layers,
  ArrowRight,
} from "lucide-react";

interface TickerAnalysisModalProps {
  ticker: string | null;
  onClose: () => void;
  onOpenChatWithTicker: (ticker: string) => void;
}

export const TickerAnalysisModal: React.FC<TickerAnalysisModalProps> = ({
  ticker,
  onClose,
  onOpenChatWithTicker,
}) => {
  const [data, setData] = useState<TickerAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticker) {
      fetchAnalysis(ticker);
    }
  }, [ticker]);

  const fetchAnalysis = async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/ai/analyze-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: symbol }),
      });

      if (!res.ok) {
        throw new Error("분석 데이터를 가져오는데 실패했습니다.");
      }

      const result = await res.json();
      setData(result.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "분석 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  if (!ticker) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col ring-1 ring-cyan-500/20">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-cyan-950/60">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-mono tracking-wider">
                  ${ticker}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-semibold flex items-center gap-1">
                  <Search className="w-2.5 h-2.5 text-cyan-400" />
                  Google Search 실시간 그라운딩
                </span>
              </div>
              <p className="text-xs text-slate-400">
                실시간 뉴스 촉매 및 3단계 모멘텀 프레임워크 정밀 검증
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAnalysis(ticker)}
              disabled={isLoading}
              title="실시간 재분석"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">재검증</span>
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
        <div className="p-6 space-y-6">
          {isLoading && (
            <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
                  <span>${ticker} 실시간 시장 뉴스 및 공시 분석 중...</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-[11px] text-cyan-300 font-mono">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Google Search Grounding 가동 · A급 재료 수급 강도 판정 중
                </div>
                <p className="text-xs text-slate-400 max-w-md pt-1">
                  1단계 RVOL & 갭 검증 → 2단계 독점 계약·어닝 서프라이즈·FDA 승인 촉매 확인 → 3단계 VWAP 1:2 손익비 매수 전략 도출
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">분석을 불러오지 못했습니다.</p>
                <p className="mt-1 text-slate-400">{error}</p>
                <button
                  onClick={() => fetchAnalysis(ticker)}
                  className="mt-2 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
                >
                  재시도
                </button>
              </div>
            </div>
          )}

          {data && !isLoading && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
                    AI AGENT EXECUTIVE SUMMARY
                  </h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {data.aiExecutiveSummary}
                </p>
              </div>

              {/* 3 Steps Verdict Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Step 1 Verdict */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      1단계: 기술/유동성
                    </span>
                    {data.stage1Verdict?.passed ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 통과
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> 조건 미달
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p>• <strong>RVOL:</strong> {data.stage1Verdict?.rvolAnalysis}</p>
                    <p>• <strong>유동성:</strong> {data.stage1Verdict?.liquidityAnalysis}</p>
                    <p>• <strong>가격/갭:</strong> {data.stage1Verdict?.priceGapAnalysis}</p>
                  </div>
                </div>

                {/* Step 2 Verdict */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      2단계: A급 촉매
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        data.stage2Verdict?.hasGradeACatalyst
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {data.stage2Verdict?.catalystGrade || "B"}급 재료
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p className="text-amber-300 font-semibold truncate">
                      {data.stage2Verdict?.catalystTitle}
                    </p>
                    <p className="line-clamp-3">
                      {data.stage2Verdict?.catalystDetail}
                    </p>
                    <p className="text-slate-300 pt-1 text-[10px]">
                      • <strong>기관 수급:</strong> {data.stage2Verdict?.institutionalInflowPotential}
                    </p>
                  </div>
                </div>

                {/* Step 3 Verdict */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      3단계: 타점 & 손익비
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                        data.stage3Strategy?.meetsSetup
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      }`}
                    >
                      1:{data.stage3Strategy?.riskRewardRatio || 2.0} R:R
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                    <p>• <strong>VWAP:</strong> ${data.stage3Strategy?.vwapLevel}</p>
                    <p>• <strong>진입가:</strong> ${data.stage3Strategy?.entryPrice}</p>
                    <p>• <strong>손절가:</strong> <span className="text-rose-400">${data.stage3Strategy?.stopLoss}</span></p>
                    <p>• <strong>목표가:</strong> <span className="text-emerald-400">${data.stage3Strategy?.targetPrice1}</span> / ${data.stage3Strategy?.targetPrice2}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Execution Playbook */}
              {data.stage3Strategy && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-400" />
                      실시간 추천 매수 실행 전략 (Execution Strategy)
                    </span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      손익비 1:{data.stage3Strategy.riskRewardRatio}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-emerald-400 font-semibold block text-[11px] mb-1">
                        🎯 진입 타이밍 & 트리거
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {data.stage3Strategy.entryTrigger}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <span className="text-rose-400 font-semibold block text-[11px] mb-1">
                        🛑 손절 및 전략 무효화 기준
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {data.stage3Strategy.invalidationRule}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/60 text-[11px] font-sans text-slate-400">
                    <strong className="text-slate-200">💡 포지션 사이징 가이드: </strong>
                    {data.stage3Strategy.positionSizingGuide}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenChatWithTicker(ticker);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-950/50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>AI 에이전트와 실시간 대화로 심층 질의하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
