import React, { useState } from "react";
import { StockItem } from "../types";
import {
  Flame,
  Award,
  ShieldCheck,
  TrendingUp,
  Filter,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Target,
  ArrowRight,
} from "lucide-react";

interface Stage2CatalystsProps {
  stocks: StockItem[];
  onSelectStockDetail: (stock: StockItem) => void;
  onAnalyzeTicker: (ticker: string) => void;
  onGoToStage3: () => void;
}

export const Stage2Catalysts: React.FC<Stage2CatalystsProps> = ({
  stocks,
  onSelectStockDetail,
  onAnalyzeTicker,
  onGoToStage3,
}) => {
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const filtered = selectedType === "ALL"
    ? stocks
    : stocks.filter((s) => s.catalystType === selectedType);

  const getCategoryLabel = (type?: string) => {
    switch (type) {
      case "EARNINGS_SURPRISE":
        return { label: "어닝 서프라이즈", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
      case "EXCLUSIVE_CONTRACT":
        return { label: "독점 계약 체결", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" };
      case "FDA_APPROVAL":
        return { label: "FDA 승인 / 바이오", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
      case "BREAKTHROUGH_TECH":
        return { label: "독점 특허 / 혁신기술", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
      case "GOV_CONTRACT":
        return { label: "정부 / 방산 수주", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
      default:
        return { label: "A급 기관 촉매", color: "bg-slate-700/50 text-slate-300 border-slate-600" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              STAGE 2 CATALYST FILTER
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              기관 및 거대 자금 연속 매수 A급 재료 ({stocks.length}선)
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            단순 테마성 찌라시가 아닌, <strong className="text-amber-300">시장 예상치 대폭 상회 어닝 서프라이즈</strong>,
            <strong className="text-indigo-300"> 대형 고객사 독점 계약</strong>, <strong className="text-rose-300">FDA 승인</strong> 등
            스마트머니가 수일간 연속으로 지분을 매집할 수밖에 없는 강력한 펀더멘털 근거를 보유한 50개 엄선 종목입니다.
          </p>
        </div>

        <button
          onClick={onGoToStage3}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all"
        >
          <Target className="w-4 h-4" />
          <span>3단계 VWAP 1:2 타점 종목 보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Tabs by Catalyst Type */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" /> 재료분류:
        </span>
        {[
          { id: "ALL", label: `전체 (${stocks.length})` },
          { id: "EARNINGS_SURPRISE", label: "어닝 서프라이즈" },
          { id: "EXCLUSIVE_CONTRACT", label: "독점 계약" },
          { id: "FDA_APPROVAL", label: "FDA 승인" },
          { id: "BREAKTHROUGH_TECH", label: "혁신 기술/특허" },
          { id: "GOV_CONTRACT", label: "정부/국방 수주" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedType(item.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all border ${
              selectedType === item.id
                ? "bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-md shadow-amber-950/40"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Grid of 50 Stocks with Institutional Catalysts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((stock) => {
          const category = getCategoryLabel(stock.catalystType);

          return (
            <div
              key={stock.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white font-mono group-hover:text-amber-300 transition-colors">
                        {stock.ticker}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${category.color}`}>
                        {category.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[190px]">
                      {stock.companyName}
                    </p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-white">
                      ${stock.currentPrice.toFixed(2)}
                    </span>
                    <span className="block text-[11px] text-emerald-400 font-semibold">
                      +{stock.preMarketGap.toFixed(1)}% Gap
                    </span>
                  </div>
                </div>

                {/* Catalyst Title & Rationale */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2 mb-3">
                  <h5 className="text-xs font-bold text-amber-200 leading-snug">
                    {stock.catalystTitle}
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {stock.catalystDescription}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[10px] text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">기관 연속 매수 당위성: </strong>
                      {stock.institutionalRationale}
                    </div>
                  </div>
                </div>

                {/* Score & Stage 3 Indicator */}
                <div className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-950 font-mono mb-3">
                  <span className="text-slate-400 text-[11px]">스마트머니 수급지수</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                        style={{ width: `${stock.institutionalFlowScore || 85}%` }}
                      />
                    </div>
                    <span className="text-amber-300 font-bold text-xs">
                      {stock.institutionalFlowScore}점
                    </span>
                  </div>
                </div>
              </div>

              {/* Action & Status */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {stock.meetsSetupCriteria ? (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    3단계 타점 충족 (1:{stock.riskRewardRatio})
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">
                    VWAP 지지 확인 관망 중
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAnalyzeTicker(stock.ticker)}
                    title="실시간 AI 뉴스 검증"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </button>
                  <button
                    onClick={() => onSelectStockDetail(stock)}
                    className="px-2.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-xs rounded-lg font-medium transition-colors"
                  >
                    상세
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
