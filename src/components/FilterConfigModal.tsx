import React, { useState } from "react";
import { FilterParams } from "../types";
import { X, SlidersHorizontal, RefreshCw, RotateCcw } from "lucide-react";

interface FilterConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: FilterParams;
  onApply: (newParams: FilterParams) => void;
}

export const FilterConfigModal: React.FC<FilterConfigModalProps> = ({
  isOpen,
  onClose,
  params,
  onApply,
}) => {
  const [localParams, setLocalParams] = useState<FilterParams>({ ...params });

  if (!isOpen) return null;

  const handleReset = () => {
    setLocalParams({
      minRvol: 2.0,
      minDollarVolume: 20000000,
      minShares: 1000000,
      minPrice: 10,
      maxPrice: 150,
      minGap: 3.0,
      maxGap: 8.0,
    });
  };

  const handleSave = () => {
    onApply(localParams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              스크리너 조건 파라미터 설정
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* RVOL */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="font-semibold text-slate-300">
                최소 상대 거래량 (Relative Volume, RVOL)
              </label>
              <span className="font-mono text-cyan-400 font-bold">
                {localParams.minRvol.toFixed(1)}x 이상
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={localParams.minRvol}
              onChange={(e) =>
                setLocalParams({ ...localParams, minRvol: Number(e.target.value) })
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              기본값 2.0x (평소 대비 최소 2배 이상 거래량 집중)
            </p>
          </div>

          {/* Dollar Volume & Shares */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                당일 최소 거래대금 ($)
              </label>
              <input
                type="number"
                value={localParams.minDollarVolume}
                onChange={(e) =>
                  setLocalParams({
                    ...localParams,
                    minDollarVolume: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                기본 $20,000,000 ($2,000만)
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                당일 최소 거래량 (주)
              </label>
              <input
                type="number"
                value={localParams.minShares}
                onChange={(e) =>
                  setLocalParams({
                    ...localParams,
                    minShares: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                기본 1,000,000주 (100만 주)
              </p>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                최소 주가 ($)
              </label>
              <input
                type="number"
                value={localParams.minPrice}
                onChange={(e) =>
                  setLocalParams({
                    ...localParams,
                    minPrice: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">기본 $10</p>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                최대 주가 ($)
              </label>
              <input
                type="number"
                value={localParams.maxPrice}
                onChange={(e) =>
                  setLocalParams({
                    ...localParams,
                    maxPrice: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">기본 $150</p>
            </div>
          </div>

          {/* Gap Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                최소 장전 갭 (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={localParams.minGap}
                onChange={(e) =>
                  setLocalParams({
                    ...localParams,
                    minGap: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">기본 +3.0%</p>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                최대 장전 갭 (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={localParams.maxGap}
                onChange={(e) =>
                  setLocalParams({
                    ...localParams,
                    maxGap: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">기본 +8.0%</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 초기화</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 text-xs"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>적용 및 재스캔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
