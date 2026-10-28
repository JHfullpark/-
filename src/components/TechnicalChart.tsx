import React, { useState, useMemo } from "react";
import { StockItem } from "../types";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import {
  Eye,
  Activity,
  Layers,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  Maximize2,
} from "lucide-react";

interface TechnicalChartProps {
  stock: StockItem;
}

interface PriceDataPoint {
  time: string;
  price: number;
  vwap: number;
  volume: number;
  isBullish: boolean;
  high: number;
  low: number;
}

export const TechnicalChart: React.FC<TechnicalChartProps> = ({ stock }) => {
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m">("5m");
  const [showVwap, setShowVwap] = useState<boolean>(true);
  const [showTradeZones, setShowTradeZones] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  // Generate realistic intraday tick/bar series around VWAP, Entry, and Current Price
  const chartData = useMemo<PriceDataPoint[]>(() => {
    const points: PriceDataPoint[] = [];
    const basePrice = stock.currentPrice;
    const vwapTarget = stock.vwap;
    const preClose = basePrice / (1 + stock.preMarketGap / 100);

    // Number of bars based on timeframe
    const count = timeframe === "1m" ? 45 : timeframe === "5m" ? 28 : 16;
    const startHour = 9;
    const startMin = 30;

    let rollingPrice = Number((preClose * (1 + (stock.preMarketGap * 0.9) / 100)).toFixed(2));
    let cumVolume = 0;
    let cumVolPrice = 0;

    for (let i = 0; i < count; i++) {
      // Calculate clock label
      const totalMinutes = (timeframe === "1m" ? i : timeframe === "5m" ? i * 5 : i * 15);
      const curHour = startHour + Math.floor((startMin + totalMinutes) / 60);
      const curMin = (startMin + totalMinutes) % 60;
      const timeStr = `${String(curHour).padStart(2, "0")}:${String(curMin).padStart(2, "0")}`;

      // Price path simulation:
      // Early bars (open volatility): quick dip toward VWAP/support to shake out weak hands
      // Middle bars: bounce off VWAP with increasing volume
      // Final bars: consolidating at stock.currentPrice
      const progress = i / (count - 1);
      let noise = (Math.sin(i * 1.3) * 0.4 + (Math.cos(i * 0.7) * 0.2)) * (basePrice * 0.004);

      if (progress < 0.25) {
        // Opening dip towards VWAP
        rollingPrice = vwapTarget + (basePrice - vwapTarget) * (1 - progress * 3) + noise;
      } else if (progress < 0.6) {
        // Testing VWAP support line
        rollingPrice = vwapTarget + noise * 0.6 + (progress - 0.25) * (basePrice - vwapTarget);
      } else {
        // Rebound and hold above VWAP towards currentPrice
        const blend = (progress - 0.6) / 0.4;
        rollingPrice = vwapTarget * (1 - blend) + basePrice * blend + noise * 0.3;
      }

      if (i === count - 1) {
        rollingPrice = basePrice;
      }

      rollingPrice = Math.max(stock.stopLoss * 1.002, Number(rollingPrice.toFixed(2)));

      // Simulate volume: spikes at market open and at VWAP bounce point
      let barVolume = Math.floor(40000 + Math.random() * 80000);
      if (i < 4 || (progress > 0.45 && progress < 0.65)) {
        barVolume = Math.floor(180000 + Math.random() * 250000);
      }

      cumVolume += barVolume;
      cumVolPrice += rollingPrice * barVolume;
      const currentVwap = Number((cumVolPrice / cumVolume).toFixed(2));

      const isBullish = i > 0 ? rollingPrice >= points[i - 1].price : true;

      points.push({
        time: timeStr,
        price: rollingPrice,
        vwap: currentVwap,
        volume: barVolume,
        isBullish,
        high: Number((rollingPrice * 1.003).toFixed(2)),
        low: Number((rollingPrice * 0.997).toFixed(2)),
      });
    }

    return points;
  }, [stock, timeframe]);

  // Compute disparity from VWAP
  const vwapDisparity = (
    ((stock.currentPrice - stock.vwap) / stock.vwap) *
    100
  ).toFixed(2);
  const isAboveVwap = stock.currentPrice >= stock.vwap;

  // Min and max for Y-Axis
  const allPrices = chartData.map((d) => d.price);
  const minChartPrice = Math.min(...allPrices, stock.stopLoss * 0.992);
  const maxChartPrice = Math.max(...allPrices, stock.targetPrice2 * 1.008);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 font-sans">
      {/* Chart Top Controls & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-white font-mono">
              ${stock.ticker} 장중 기술적 차트
            </span>
          </div>

          {/* VWAP Status Badge */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
              isAboveVwap
                ? "bg-cyan-950/70 text-cyan-300 border-cyan-800/70"
                : "bg-amber-950/70 text-amber-300 border-amber-800/70"
            }`}
          >
            <span>VWAP: ${stock.vwap.toFixed(2)}</span>
            <span className="text-[10px] opacity-80">
              ({Number(vwapDisparity) >= 0 ? `+${vwapDisparity}%` : `${vwapDisparity}%`})
            </span>
            {isAboveVwap ? (
              <span className="text-[9px] bg-cyan-500/20 px-1 rounded text-cyan-200">
                지지 중
              </span>
            ) : (
              <span className="text-[9px] bg-amber-500/20 px-1 rounded text-amber-200">
                하회
              </span>
            )}
          </div>
        </div>

        {/* Timeframe & Indicators Switchers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[11px] font-mono">
            {(["1m", "5m", "15m"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timeframe === tf
                    ? "bg-cyan-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator toggles */}
          <button
            onClick={() => setShowVwap(!showVwap)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
              showVwap
                ? "bg-cyan-950 text-cyan-300 border-cyan-700"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            VWAP선
          </button>

          <button
            onClick={() => setShowTradeZones(!showTradeZones)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
              showTradeZones
                ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            진입/손절 라인
          </button>

          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
              showVolume
                ? "bg-indigo-950 text-indigo-300 border-indigo-700"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            거래량
          </button>
        </div>
      </div>

      {/* Main Interactive Recharts Area */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 12, right: 18, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              domain={[minChartPrice, maxChartPrice]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(v) => `$${Number(v).toFixed(1)}`}
              orientation="right"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload as PriceDataPoint;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 text-[11px]">
                        <span>시간: {label}</span>
                        <span className={pData.isBullish ? "text-emerald-400" : "text-rose-400"}>
                          {pData.isBullish ? "▲ 양봉" : "▼ 음봉"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">주가 (Price):</span>
                        <span className="text-white font-bold">${pData.price.toFixed(2)}</span>
                      </div>
                      {showVwap && (
                        <div className="flex justify-between gap-4 text-cyan-300">
                          <span>VWAP:</span>
                          <span className="font-bold">${pData.vwap.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between gap-4 text-slate-400">
                        <span>거래량 (Vol):</span>
                        <span className="text-slate-200">
                          {pData.volume.toLocaleString()} 주
                        </span>
                      </div>
                      <div className="pt-1 border-t border-slate-800 flex justify-between gap-2 text-[10px]">
                        <span className="text-slate-500">추천 진입존:</span>
                        <span className="text-emerald-400 font-semibold">
                          ${stock.entryRangeMin.toFixed(2)}~${stock.entryRangeMax.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Entry Range Highlight Area */}
            {showTradeZones && (
              <ReferenceArea
                y1={stock.entryRangeMin}
                y2={stock.entryRangeMax}
                fill="#10b981"
                fillOpacity={0.12}
                stroke="#10b981"
                strokeOpacity={0.3}
                strokeDasharray="3 3"
              />
            )}

            {/* Stop Loss Line (Red) */}
            {showTradeZones && (
              <ReferenceLine
                y={stock.stopLoss}
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: `🛑 손절가 $${stock.stopLoss.toFixed(2)}`,
                  fill: "#f43f5e",
                  fontSize: 10,
                  position: "left",
                }}
              />
            )}

            {/* Entry Target Line (Emerald) */}
            {showTradeZones && (
              <ReferenceLine
                y={(stock.entryRangeMin + stock.entryRangeMax) / 2}
                stroke="#10b981"
                strokeWidth={1.5}
                label={{
                  value: `🎯 진입가 $${((stock.entryRangeMin + stock.entryRangeMax) / 2).toFixed(2)}`,
                  fill: "#10b981",
                  fontSize: 10,
                  position: "left",
                }}
              />
            )}

            {/* 1st Target TP1 (Cyan/Green) */}
            {showTradeZones && (
              <ReferenceLine
                y={stock.targetPrice1}
                stroke="#34d399"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{
                  value: `1차익절 $${stock.targetPrice1.toFixed(2)}`,
                  fill: "#34d399",
                  fontSize: 9,
                  position: "right",
                }}
              />
            )}

            {/* 2nd Target TP2 / Resistance (Purple) */}
            {showTradeZones && (
              <ReferenceLine
                y={stock.targetPrice2}
                stroke="#a855f7"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: `🏁 2차목표 $${stock.targetPrice2.toFixed(2)}`,
                  fill: "#c084fc",
                  fontSize: 10,
                  position: "right",
                }}
              />
            )}

            {/* VWAP Line (Cyan) */}
            {showVwap && (
              <Line
                type="monotone"
                dataKey="vwap"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                name="VWAP"
                isAnimationActive={false}
              />
            )}

            {/* Price Area / Line */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#e2e8f0"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              isAnimationActive={false}
            />

            {/* Optional Volume Bars in background */}
            {showVolume && (
              <Bar
                dataKey="volume"
                yAxisId="vol"
                fill="#3b82f6"
                opacity={0.25}
                isAnimationActive={false}
              />
            )}

            <YAxis
              yAxisId="vol"
              domain={[0, (dataMax: number) => dataMax * 4]}
              hide
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Level Labels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>손절선: ${stock.stopLoss.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>VWAP 지지: ${stock.vwap.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>진입존: ${stock.entryRangeMin.toFixed(2)}~${stock.entryRangeMax.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-purple-400">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>목표선(TP2): ${stock.targetPrice2.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
