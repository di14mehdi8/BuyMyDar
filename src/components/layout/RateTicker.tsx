"use client";

import { TrendingDown, TrendingUp, Minus, Zap } from "lucide-react";
import { BANK_RATES, MARKET_AVERAGE_RATE } from "@/lib/mortgage/calculator";
import type { Locale } from "@/lib/i18n/config";

interface RateTickerProps {
  lang: Locale;
  dict: { label: string; cta: string };
}

export function RateTicker({ lang, dict }: RateTickerProps) {
  const avgPct = (MARKET_AVERAGE_RATE * 100).toFixed(2);

  const items = BANK_RATES.map((b) => ({
    name: b.shortName,
    rate: b.fixedRate,
    trend:
      b.fixedRate < MARKET_AVERAGE_RATE
        ? "down"
        : b.fixedRate > MARKET_AVERAGE_RATE
        ? "up"
        : "flat",
    color: b.color,
  }));

  return (
    <div
      className="fixed inset-x-0 z-40 flex items-center overflow-hidden"
      style={{
        top: "var(--header-height)",
        height: "var(--ticker-height)",
        background: "linear-gradient(90deg,#0D47A1 0%,#1565C0 40%,#1976D2 100%)",
      }}
      role="marquee"
      aria-label={`${dict.label}: ${avgPct}%`}
    >
      {/* Pinned label */}
      <div className="shrink-0 flex items-center gap-2 h-full px-4 border-e border-white/20"
           style={{ background: "rgba(0,0,0,0.18)" }}>
        <Zap className="w-3 h-3 text-amber-300" />
        <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest hidden sm:block">
          {dict.label}
        </span>
        <span className="text-white text-sm font-bold">{avgPct}%</span>
      </div>

      {/* Scrolling strip */}
      <div className="ticker-wrap flex-1">
        <div className="ticker-content flex items-center gap-10 ps-10">
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-xs font-medium whitespace-nowrap"
            >
              {/* Color dot matching bank color */}
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/60">{item.name}</span>
              <span className="text-white font-bold">{(item.rate * 100).toFixed(2)}%</span>
              {item.trend === "down" && <TrendingDown className="w-3 h-3 text-emerald-300" />}
              {item.trend === "up"   && <TrendingUp   className="w-3 h-3 text-red-300" />}
              {item.trend === "flat" && <Minus        className="w-3 h-3 text-amber-300" />}
              <span className="text-white/20">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
