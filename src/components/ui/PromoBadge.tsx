"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Zap, Users, Star, Gift, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Promotion, PromoTag } from "@/lib/mortgage/calculator";

const TAG_CONFIG: Record<PromoTag, { icon: typeof Zap; color: string; label: string }> = {
  youth:      { icon: Sparkles, color: "bg-violet-100 text-violet-700 border-violet-200", label: "Jeunes" },
  mre:        { icon: Users,    color: "bg-blue-100 text-blue-700 border-blue-200",       label: "MRE" },
  "state-aid":{ icon: Gift,     color: "bg-green-100 text-green-700 border-green-200",    label: "Aide État" },
  "rate-promo":{ icon: Zap,     color: "bg-amber-100 text-amber-700 border-amber-200",    label: "Promo taux" },
  "zero-fee": { icon: Star,     color: "bg-pink-100 text-pink-700 border-pink-200",       label: "Frais offerts" },
  extended:   { icon: Clock,    color: "bg-cyan-100 text-cyan-700 border-cyan-200",       label: "Durée étendue" },
  unique:     { icon: Star,     color: "bg-orange-100 text-orange-700 border-orange-200", label: "Exclusif" },
};

interface PromoBadgeProps {
  promo: Promotion;
  size?: "sm" | "md";
}

export function PromoBadge({ promo, size = "sm" }: PromoBadgeProps) {
  const [open, setOpen] = useState(false);
  const cfg = TAG_CONFIG[promo.tag];
  const Icon = cfg.icon;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border font-semibold cursor-pointer transition-all hover:opacity-80",
          cfg.color,
          size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        )}
        aria-label={`Voir les détails: ${promo.labelFr}`}
      >
        <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
        {promo.labelFr.split("—")[0].trim()}
      </button>

      {/* Detail modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] max-w-md mx-auto
                         bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.2)] overflow-hidden"
            >
              {/* Header */}
              <div className={cn("px-5 py-4 flex items-center justify-between", cfg.color.split(" ")[0], "bg-opacity-30")}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", cfg.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={cn("text-xs font-bold uppercase tracking-wider", cfg.color.split(" ").find(c => c.startsWith("text-")))}>
                    {cfg.label}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5">
                <h3 className="font-bold text-slate-900 text-base mb-3 leading-snug">
                  {promo.labelFr}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  {promo.detailFr}
                </p>
                {promo.url && (
                  <a
                    href={promo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                               bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                  >
                    En savoir plus
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
