"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Building2, Globe2, Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/getDictionary";
import { MARKET_AVERAGE_RATE, BANK_RATES } from "@/lib/mortgage/calculator";

interface HeroSectionProps {
  lang: string;
  dict: Dictionary["hero"];
}

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroSection({ lang, dict }: HeroSectionProps) {
  const lowestRate = Math.min(...BANK_RATES.map((b) => b.fixedRate));
  const lowestBank = BANK_RATES.find((b) => b.fixedRate === lowestRate)!;

  return (
    <section
      className="relative flex flex-col justify-center overflow-hidden min-h-[95vh]"
      style={{ paddingTop: "calc(var(--header-height) + var(--ticker-height))" }}
      aria-labelledby="hero-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" />
        {/* Blobs */}
        <div className="absolute -top-40 -end-40 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 -start-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-[60px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#1E3A6E 1px, transparent 1px), linear-gradient(90deg, #1E3A6E 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy ── */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                               bg-brand-600/10 text-brand-700 text-sm font-semibold border border-brand-200/60">
                <Sparkles className="w-3.5 h-3.5 fill-brand-500 text-brand-500" />
                {dict.badge}
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1 variants={fadeUp} id="hero-heading" className="heading-display mb-5">
              {dict.headline}{" "}
              <span className="relative text-gradient">
                {dict.headline_accent}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
              {dict.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <Link href={`/${lang}#simulator`} className="btn-primary px-7 py-3.5 text-base shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40">
                {dict.cta_primary}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/${lang}#banks`} className="btn-secondary px-7 py-3.5 text-base">
                {dict.cta_secondary}
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
              {[
                { icon: Building2,   label: dict.trust_labels.banks },
                { icon: Globe2,      label: dict.trust_labels.mre },
                { icon: ShieldCheck, label: dict.trust_labels.secure },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <div className="w-6 h-6 rounded-lg bg-brand-50 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Stat cards ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {/* Best rate — featured */}
            <motion.div
              variants={fadeUp}
              className="col-span-2 card p-6 border-brand-100"
              style={{ background: "linear-gradient(135deg,#1E3A6E 0%,#0F2040 100%)" }}
            >
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3">
                🏆 Meilleur taux fixe du marché
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold text-white tracking-tight">
                    {(lowestRate * 100).toFixed(2)}%
                  </p>
                  <p className="text-blue-200 text-sm mt-1">{lowestBank.name}</p>
                </div>
                <Link
                  href={`/${lang}#simulator`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15
                             hover:bg-white/25 text-white text-sm font-semibold transition-all"
                >
                  Simuler <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Taux moyen */}
            <motion.div variants={fadeUp} className="card p-5 card-hover">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Taux moyen</p>
              <p className="text-2xl font-bold text-slate-900">
                {(MARKET_AVERAGE_RATE * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Maroc 2026</p>
            </motion.div>

            {/* Durée max */}
            <motion.div variants={fadeUp} className="card p-5 card-hover">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Durée max</p>
              <p className="text-2xl font-bold text-slate-900">25 ans</p>
              <p className="text-xs text-slate-400 mt-1">Pour résidents</p>
            </motion.div>

            {/* Banques */}
            <motion.div variants={fadeUp} className="card p-5 card-hover">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Banques</p>
              <p className="text-2xl font-bold text-slate-900">8</p>
              <p className="text-xs text-slate-400 mt-1">Comparées en direct</p>
            </motion.div>

            {/* MRE eligible */}
            <motion.div variants={fadeUp} className="card p-5 card-hover">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">MRE</p>
              <p className="text-2xl font-bold text-emerald-600">
                {BANK_RATES.filter((b) => b.mreEligible).length}
              </p>
              <p className="text-xs text-slate-400 mt-1">Banques éligibles</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <p className="text-xs text-slate-400 font-medium">Défiler pour simuler</p>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center pt-1"
        >
          <div className="w-1 h-2 rounded-full bg-slate-400" />
        </motion.div>
      </div>
    </section>
  );
}
