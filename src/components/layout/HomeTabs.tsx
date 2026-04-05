"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Newspaper, Globe, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MortgageSimulator }    from "@/components/simulator/MortgageSimulator";
import { BankDirectory }        from "@/components/sections/BankDirectory";
import { FAQSection }           from "@/components/sections/FAQSection";
import { DaamSakaneBanner }     from "@/components/sections/DaamSakaneBanner";
import { InsightsGrid }         from "@/components/sections/InsightsGrid";
import { RateAlert }            from "@/components/sections/RateAlert";
import { MRESection }           from "@/components/sections/MRESection";
import { DocumentsSection }     from "@/components/sections/DocumentsSection";
import { NotaryFeesCalculator } from "@/components/sections/NotaryFeesCalculator";
import { cn }                   from "@/lib/utils";
import type { Dictionary }      from "@/lib/i18n/getDictionary";

type TabId = "compare" | "actualites" | "mre";

interface HomeTabsProps {
  lang: string;
  dict: Dictionary;
}

const TAB_ICONS: Record<TabId, React.ElementType> = {
  compare:    BarChart2,
  actualites: Newspaper,
  mre:        Globe,
};

export function HomeTabs({ lang, dict }: HomeTabsProps) {
  const [active, setActive] = useState<TabId>("compare");

  return (
    <>
      {/* ── Sticky tab bar ────────────────────────────────────── */}
      <div className="sticky top-[var(--header-height)] z-30 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {(["compare", "actualites", "mre"] as TabId[]).map((tabId) => {
              const Icon = TAB_ICONS[tabId];
              const label = tabId === "compare" ? dict.tabs.compare : tabId === "actualites" ? dict.tabs.news : dict.tabs.guides;
              const isActive = active === tabId;
              return (
                <button
                  key={tabId}
                  onClick={() => setActive(tabId)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors",
                    isActive ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
                  )}
                  aria-selected={isActive}
                  role="tab"
                >
                  <Icon className="w-4 h-4" />
                  {label}
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
              <BankDirectory lang={lang} dict={dict.banks} />
              <FAQSection dict={dict.faq} />
              {/* Contact CTA strip */}
              <div className="rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
                   style={{ background: "linear-gradient(135deg,#1E3A6E 0%,#0F2040 100%)" }}>
                <div>
                  <p className="text-white font-bold text-xl mb-1">
                    {lang === "ar" ? "هل لديك سؤال؟" : lang === "en" ? "Have a question?" : "Vous avez une question ?"}
                  </p>
                  <p className="text-blue-200 text-sm">
                    {lang === "ar"
                      ? "فريقنا مستعد للإجابة على استفساراتك."
                      : lang === "en"
                      ? "Our team is ready to answer your questions."
                      : "Notre équipe est disponible pour répondre à vos questions."}
                  </p>
                </div>
                <Link
                  href={`/${lang}/contact`}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-slate-900
                             font-semibold text-sm hover:bg-blue-50 transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  {lang === "ar" ? "اتصل بنا" : lang === "en" ? "Contact us" : "Nous contacter"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
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
