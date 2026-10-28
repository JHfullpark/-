import React, { useState, useEffect } from "react";
import {
  Activity,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Bot,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onOpenFilters: () => void;
  onOpenChat: () => void;
  onSearchTicker: (ticker: string) => void;
  stageCounts: {
    stage1Count: number;
    stage2Count: number;
    stage3Count: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  isLoading,
  onOpenFilters,
  onOpenChat,
  onSearchTicker,
  stageCounts,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [nyTime, setNyTime] = useState("");
  const [marketStatus, setMarketStatus] = useState<"PRE_MARKET" | "REGULAR" | "POST_MARKET" | "CLOSED">("PRE_MARKET");

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      // Formatter for New York Time
      const nyString = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setNyTime(nyString);

      // Determine Market Session (EST/EDT)
      const nyHour = parseInt(nyString.split(":")[0], 10);
      const nyMin = parseInt(nyString.split(":")[1], 10);
      const totalMinutes = nyHour * 60 + nyMin;

      // 04:00 - 09:30: Pre-market (240 to 570)
      // 09:30 - 16:00: Regular hours (570 to 960)
      // 16:00 - 20:00: After-hours (960 to 1200)
      if (totalMinutes >= 240 && totalMinutes < 570) {
        setMarketStatus("PRE_MARKET");
      } else if (totalMinutes >= 570 && totalMinutes < 960) {
        setMarketStatus("REGULAR");
      } else if (totalMinutes >= 960 && totalMinutes < 1200) {
        setMarketStatus("POST_MARKET");
      } else {
        setMarketStatus("PRE_MARKET");
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchTicker(searchInput.trim().toUpperCase());
      setSearchInput("");
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-400 p-[2px] shadow-lg shadow-cyan-950/50 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 font-mono">
                  ALPHA SNIPER
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-sans font-medium">
                    PRO TRADING AGENT
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                RVOL 2.0+ · Gap +3~8% · A급 촉매 · VWAP 1:2 손익비 전략
              </p>
            </div>

            {/* Session Indicator */}
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-2 border-l border-slate-800">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300 font-mono text-[11px]">NY {nyTime || "09:15:00"}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ml-1 ${
                    marketStatus === "PRE_MARKET"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : marketStatus === "REGULAR"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {marketStatus === "PRE_MARKET"
                    ? "장전 PRE-MARKET"
                    : marketStatus === "REGULAR"
                    ? "정규장 REGULAR"
                    : "장후 AFTER-HOURS"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Search Input for Individual Ticker AI Analysis */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-56 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="티커 검색 (예: NVDA, TSLA, PLTR)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/70 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors uppercase font-mono"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 bg-slate-800 px-1 rounded border border-slate-700">
                ↵
              </span>
            </form>

            {/* Filter Params Button */}
            <button
              onClick={onOpenFilters}
              title="조건 파라미터 미세조정"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">조건설정</span>
            </button>

            {/* Refresh Scan Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="실시간 시장 스캔 재실행"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-md shadow-cyan-900/40 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "스캐닝..." : "시장 스캔"}</span>
            </button>

            {/* Chat Agent Trigger */}
            <button
              onClick={onOpenChat}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-900/40 transition-all border border-indigo-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <Bot className="w-3.5 h-3.5" />
              <span>AI 브리핑 에이전트</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
