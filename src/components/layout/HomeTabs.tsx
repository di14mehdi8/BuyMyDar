"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Newspaper, Globe } from "lucide-react";
import { MortgageSimulator }    from "@/components/simulator/MortgageSimulator";
import { BankDirectory }        from "@/components/sections/BankDirectory";
import { FAQSection }           from "@/components/sections/FAQSection";
import { DaamSakaneBanner }     from "@/components/sections/DaamSakaneBanner";
import { InsightsGrid }         from "@/components/sections/InsightsGrid";
import { RateAlert }            from "@/components/sections/RateAlert";
import { MRESection }           from "@/components/sections/MRESection";
import { DocumentsSection }     from "@/components/sections/DocumentsSection";
import { NotaryFeesCalculator } from "@/components/sections/NotaryFeesCalculator";
import { AdSlot }               from "@/components/ads/AdSlot";
import { cn }                   from "@/lib/utils";
import type { Dictionary }      from "@/lib/i18n/getDictionary";

type TabId = "compare" | "actualites" | "mre";

interface HomeTabsProps {
  lang: string;
  dict: Dictionary;
}

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "compare",   label: "Comparer",    icon: BarChart2  },
  { id: "actualites",label: "Actualités",  icon: Newspaper  },
  { id: "mre",       label: "Guide MRE",   icon: Globe      },
];

export function HomeTabs({ lang, dict }: HomeTabsProps) {
  const [active, setActive] = useState<TabId>("compare");

  return (
    <>
      {/* ── Sticky tab bar ────────────────────────────────────── */}
      <div className="sticky top-[var(--header-height)] z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors",
                    isActive ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
                  )}
                  aria-selected={isActive}
                  role="tab"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-bar-indicator"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-600 rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-12 pb-24"
        >
          {active === "compare" && (
            <>
              <MortgageSimulator lang={lang} dict={dict.simulator} />
              <div className="flex justify-center">
                <AdSlot slotId="0987654321" format="rectangle" label={dict.ads.label} />
              </div>
              <BankDirectory lang={lang} dict={dict.banks} />
              <FAQSection dict={dict.faq} />
            </>
          )}

          {active === "actualites" && (
            <>
              <DaamSakaneBanner />
              <InsightsGrid lang={lang} dict={dict.insights} />
              <RateAlert />
            </>
          )}

          {active === "mre" && (
            <>
              <MRESection lang={lang} dict={dict.mre_section} />
              <NotaryFeesCalculator />
              <DocumentsSection />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
