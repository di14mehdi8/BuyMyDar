"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CreditCard, Send, FileCheck, Bell, ArrowRight, Globe, MapPin } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface MRESectionProps {
  lang: string;
  dict: Dictionary["mre_section"];
}

const ICONS = { dirham: CreditCard, transfer: Send, preapproval: FileCheck, tracking: Bell };

const COUNTRIES = [
  { flag: "🇫🇷", name: "France",      count: "2.2M" },
  { flag: "🇪🇸", name: "Espagne",     count: "0.8M" },
  { flag: "🇮🇹", name: "Italie",      count: "0.5M" },
  { flag: "🇧🇪", name: "Belgique",    count: "0.5M" },
  { flag: "🇩🇪", name: "Allemagne",   count: "0.3M" },
  { flag: "🇳🇱", name: "Pays-Bas",    count: "0.3M" },
  { flag: "🇨🇦", name: "Canada",      count: "0.2M" },
  { flag: "🇺🇸", name: "États-Unis",  count: "0.1M" },
];

const stagger = {
  visible: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } },
};

export function MRESection({ lang, dict }: MRESectionProps) {
  return (
    <section id="mre" className="scroll-mt-28" aria-labelledby="mre-heading">
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg,#040B17 0%,#1E3A6E 60%,#3358CB 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -end-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -start-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
             style={{ backgroundImage: `linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)`, backgroundSize: "48px 48px" }} />

        <div className="relative p-8 md:p-12">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-2xl mb-11"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-semibold mb-4">
              <Globe className="w-3.5 h-3.5" />
              Marocains du monde
            </motion.div>
            <motion.h2 variants={fadeUp} id="mre-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
              {dict.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/65 text-lg leading-relaxed">
              {dict.subtitle}
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-11"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {(Object.entries(dict.features) as [keyof typeof ICONS, { title: string; desc: string }][]).map(([key, f]) => {
              const Icon = ICONS[key];
              return (
                <motion.div
                  key={key}
                  variants={fadeUp}
                  className="group relative bg-white/6 hover:bg-white/10 border border-white/10
                             hover:border-white/20 rounded-2xl p-5 transition-all duration-200 cursor-default"
                >
                  <div className="w-10 h-10 bg-white/10 group-hover:bg-brand-500/40 rounded-xl
                                  flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-5 h-5 text-white/80" />
                  </div>
                  <h3 className="font-semibold text-white mb-1.5 text-sm">{f.title}</h3>
                  <p className="text-white/55 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Countries */}
          <div className="mb-10">
            <p className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3">
              <MapPin className="w-3 h-3" /> Communauté mondiale
            </p>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <span key={c.name}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
                             bg-white/6 border border-white/10 text-sm hover:bg-white/10 transition-colors"
                >
                  <span>{c.flag}</span>
                  <span className="text-white text-xs font-medium">{c.name}</span>
                  <span className="text-white/35 text-[10px]">{c.count}</span>
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${lang}/guide-mre`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                         bg-white text-brand-700 hover:bg-blue-50 transition-colors shadow-lg shadow-black/20"
            >
              Guide complet MRE <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/${lang}#simulator`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                         border-2 border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Simuler mon crédit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
