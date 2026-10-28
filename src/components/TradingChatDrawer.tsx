import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Search,
  Target,
  Flame,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface TradingChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeTicker: (ticker: string) => void;
}

export const TradingChatDrawer: React.FC<TradingChatDrawerProps> = ({
  isOpen,
  onClose,
  onAnalyzeTicker,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `반갑습니다. 월스트리트 모멘텀 데이트레이딩 AI 에이전트 **'알파 스나이퍼(Alpha Sniper)'**입니다.

오늘 시장에서 다음 3단계 엄격한 원칙으로 선별된 종목과 실시간 매수 전략을 브리핑해 드립니다:
1. **RVOL 2.0+ 및 당일 거래대금 $20M+ (주가 $10~$150, 장전 갭 +3%~+8%)**
2. **A급 촉매(어닝 서프라이즈, 대형 독점 계약, FDA 승인 등 기관 연속 매수 당위성)**
3. **VWAP 지지 + 손익비 1:2 이상 보장되는 명확한 지지/저항 타점**

특정 티커(예: **NVDA, TSLA, SMCI, IONQ**)를 물어보시거나, 오늘 가장 유력한 1:2 타점 종목을 요청하세요.`,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentContext: true,
        }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "응답을 받지 못했습니다.",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "네트워크 오류 또는 API 호출 중 문제가 발생했습니다. 잠시 후 다시 질문해주세요.",
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "오늘 손익비 1:2 이상 가장 확실한 종목 Top 3 브리핑",
    "VWAP 눌림목에서 진입할 때 매도 거래량(Volume Dry-up) 확인법",
    "SMCI와 IONQ의 A급 재료 강도와 기관 수급 연속성 분석",
    "장전 갭이 +8%를 초과하는 종목은 왜 조심해야 하나요?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-md animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white font-mono">
                ALPHA SNIPER AGENT
              </h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Search className="w-2.5 h-2.5 text-emerald-400" /> Google Search 실시간 그라운딩 가동 중
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> 추천 질문:
        </span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-700 text-slate-300 text-[11px] whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                m.role === "user"
                  ? "bg-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-950/40"
                  : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs space-y-1.5">
                {m.content}
              </div>
              <span
                className={`text-[9px] block text-right mt-1.5 ${
                  m.role === "user" ? "text-cyan-200" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 rounded-bl-none flex items-center gap-2 text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>실시간 시장 데이터 및 촉매 분석 중...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="질문 또는 티커를 입력하세요 (예: TSLA의 오늘 A급 재료와 VWAP 타점은?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl transition-colors shadow-md shadow-cyan-950/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
          ※ Gemini 3.8 Flash + Google Search 기반 모멘텀 트레이딩 의사결정 보조
        </p>
      </div>
    </div>
  );
};
