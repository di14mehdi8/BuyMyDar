"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface FAQSectionProps { dict: Dictionary["faq"]; }

export function FAQSection({ dict }: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-28" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircleQuestion className="w-6 h-6 text-brand-600" />
          </div>
          <h2 id="faq-heading" className="heading-2">{dict.title}</h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {dict.items.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "card overflow-hidden transition-shadow",
                  isOpen && "shadow-[0_4px_20px_rgba(21,101,192,0.1)] border-brand-100"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-start justify-between gap-4 p-5 text-start"
                  aria-expanded={isOpen}
                  id={`faq-btn-${idx}`}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <h3 className={cn(
                    "font-semibold text-sm leading-relaxed transition-colors",
                    isOpen ? "text-brand-700" : "text-slate-800"
                  )}>
                    {item.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 mt-0.5"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                      isOpen ? "bg-brand-100" : "bg-slate-100"
                    )}>
                      <ChevronDown className={cn(
                        "w-3.5 h-3.5 transition-colors",
                        isOpen ? "text-brand-600" : "text-slate-400"
                      )} />
                    </div>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="h-px bg-brand-50 mb-4" />
                        <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
