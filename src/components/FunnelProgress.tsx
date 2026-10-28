import React from "react";
import { Layers, Flame, Target, ArrowRight, ShieldCheck, BarChart3 } from "lucide-react";

interface FunnelProgressProps {
  currentTab: "stage3" | "stage2" | "stage1";
  onSelectTab: (tab: "stage3" | "stage2" | "stage1") => void;
  counts: {
    stage1Count: number;
    stage2Count: number;
    stage3Count: number;
  };
}

export const FunnelProgress: React.FC<FunnelProgressProps> = ({
  currentTab,
  onSelectTab,
  counts,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white tracking-wide">
            3-STAGE QUANT & CATALYST SELECTION PIPELINE
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          원칙 기반 철저한 모멘텀 압축 프로세스
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1 */}
        <button
          onClick={() => onSelectTab("stage1")}
          className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
            currentTab === "stage1"
              ? "bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-500/50"
              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs font-mono">
                1
              </span>
              <span className="text-xs font-semibold text-slate-300">
                기술적 모니터링 풀
              </span>
            </div>
            <span className="text-lg font-black font-mono text-cyan-400">
              {counts.stage1Count}
              <span className="text-xs text-slate-400 font-normal ml-0.5">선</span>
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-[11px] text-slate-300 font-medium">
              RVOL 2.0+ · 거래대금 $20M+ (or 1M주+)
            </p>
            <p className="text-[10px] text-slate-400">
              주가 $10 ~ $150 · 장전 갭 +3% ~ +8% 내외 상위 100종목
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-cyan-400" />
              유동성 & 변동성 확보
            </span>
            <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">
              보기 <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Step 2 */}
        <button
          onClick={() => onSelectTab("stage2")}
          className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
            currentTab === "stage2"
              ? "bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/60 ring-1 ring-amber-500/50"
              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs font-mono">
                2
              </span>
              <span className="text-xs font-semibold text-slate-300">
                A급 촉매 & 기관 수급
              </span>
            </div>
            <span className="text-lg font-black font-mono text-amber-400">
              {counts.stage2Count}
              <span className="text-xs text-slate-400 font-normal ml-0.5">선</span>
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              어닝 서프라이즈 · 독점 계약 · FDA 승인
            </p>
            <p className="text-[10px] text-slate-400">
              스마트머니가 연속 매수에 참여할 강력한 펀더멘털 이유
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              스마트머니 연속성 검증
            </span>
            <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">
              보기 <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Step 3 - Primary Strategy */}
        <button
          onClick={() => onSelectTab("stage3")}
          className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
            currentTab === "stage3"
              ? "bg-emerald-950/50 border-emerald-500 shadow-xl shadow-emerald-950/70 ring-2 ring-emerald-500/50"
              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs font-mono">
                3
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                장중 타점 & 1:2 손익비 전략
                <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500 text-slate-950 font-black rounded uppercase">
                  FINAL
                </span>
              </span>
            </div>
            <span className="text-lg font-black font-mono text-emerald-400">
              {counts.stage3Count}
              <span className="text-xs text-slate-400 font-normal ml-0.5">선</span>
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" />
              VWAP 지지 + 손익비(Risk/Reward) ≥ 1:2
            </p>
            <p className="text-[10px] text-slate-300">
              명확한 지지선·저항선과 구체적 매수 진입가·손절가 명시
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              실행 매수 플랜 제공
            </span>
            <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center text-[10px] font-bold">
              전략 확인 <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
