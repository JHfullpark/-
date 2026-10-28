import React, { useState } from "react";
import { StockItem } from "../types";
import {
  BarChart3,
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

interface Stage1ScreeningProps {
  stocks: StockItem[];
  onSelectStockDetail: (stock: StockItem) => void;
  onAnalyzeTicker: (ticker: string) => void;
  onGoToStage2: () => void;
}

export const Stage1Screening: React.FC<Stage1ScreeningProps> = ({
  stocks,
  onSelectStockDetail,
  onAnalyzeTicker,
  onGoToStage2,
}) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState<"rvol" | "dollarVolume" | "preMarketGap" | "currentPrice">("rvol");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filtered = stocks.filter(
    (s) =>
      s.ticker.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.sector.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
              STAGE 1 TECHNICAL POOL
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              미국 주식 시장 모니터링 상위 100종목 풀
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            기관 수급과 데이트레이더의 거래가 집중되는{" "}
            <strong className="text-cyan-300">RVOL 2.0+</strong>,{" "}
            <strong className="text-emerald-300">거래대금 $20M+ (or 1M주+)</strong>,{" "}
            <strong className="text-white">주가 $10~$150</strong>,{" "}
            <strong className="text-amber-300">장전 갭 +3%~+8%</strong> 조건을 완벽히 충족한 종목 풀입니다.
          </p>
        </div>

        <button
          onClick={onGoToStage2}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-950/50 transition-all"
        >
          <span>2단계 A급 재료(50선) 필터링 보기</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Table Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="100종목 내 티커/기업명/섹터 검색"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono w-full sm:w-auto justify-between sm:justify-end">
          <span>
            총 <strong className="text-white">{stocks.length}</strong>개 중{" "}
            <strong className="text-cyan-400">{filtered.length}</strong>개 표시
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 2단계 통과: 50개
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> 3단계 타점: {stocks.filter(s => s.meetsSetupCriteria).length}개
            </span>
          </div>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">티커 / 기업명</th>
                <th className="py-3 px-4">섹터</th>
                <th
                  onClick={() => handleSort("currentPrice")}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    현재가 <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("preMarketGap")}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1 text-emerald-400">
                    장전 갭(%) <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("rvol")}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1 text-cyan-400">
                    RVOL <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("dollarVolume")}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    거래대금 ($) <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">단계별 판정</th>
                <th className="py-3 px-4 text-right">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sorted.map((stock, idx) => (
                <tr
                  key={stock.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">
                        {stock.ticker}
                      </span>
                      <span className="text-[11px] text-slate-400 font-sans truncate max-w-[150px]">
                        {stock.companyName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-400 font-sans">
                    {stock.sector}
                  </td>
                  <td className="py-3 px-4 text-white font-bold">
                    ${stock.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    +{stock.preMarketGap.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 font-bold text-cyan-300">
                    {stock.rvol.toFixed(2)}x
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    ${(stock.dollarVolume / 1000000).toFixed(1)}M
                    <span className="text-[10px] text-slate-500 ml-1">
                      ({(stock.volume / 1000000).toFixed(1)}M주)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {stock.hasGradeACatalyst ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                          2단계 A급
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">
                          촉매 미달
                        </span>
                      )}

                      {stock.meetsSetupCriteria && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                          3단계 1:{stock.riskRewardRatio}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onAnalyzeTicker(stock.ticker)}
                        title="실시간 AI 뉴스 검증"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      </button>
                      <button
                        onClick={() => onSelectStockDetail(stock)}
                        className="px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 text-[11px] rounded border border-cyan-800/60 font-medium"
                      >
                        상세
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
