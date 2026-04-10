"use client";

import { motion } from "framer-motion";
import { Gift, ArrowRight, CheckCircle2, Home } from "lucide-react";
import { DAAM_SAKANE } from "@/lib/mortgage/calculator";

export function DaamSakaneBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl"
      aria-label="Programme Daam Sakane — aide gouvernementale"
    >
      {/* Background */}
      <div className="absolute inset-0"
           style={{ background: "linear-gradient(135deg,#065F46 0%,#047857 50%,#059669 100%)" }} />
      <div className="absolute inset-0 opacity-[0.06]"
           style={{ backgroundImage: `radial-gradient(circle,white 1px,transparent 1px)`, backgroundSize: "20px 20px" }} />

      <div className="relative px-6 py-6 md:px-8 md:py-7">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Icon + label */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Gift className="w-3.5 h-3.5 text-green-300" />
                <span className="text-green-300 text-[10px] font-bold uppercase tracking-widest">
                  Programme gouvernemental
                </span>
              </div>
              <h3 className="text-white font-bold text-lg">Daam Sakane — Aide à l&apos;achat</h3>
            </div>
          </div>

          {/* Tiers */}
          <div className="flex flex-wrap gap-3 flex-1">
            {DAAM_SAKANE.tiers.map((tier, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-300 shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm">
                    {(tier.grantMAD / 1000).toFixed(0)}K DH
                  </p>
                  <p className="text-green-200 text-[10px]">
                    Bien ≤ {(tier.maxPriceMAD / 1000).toFixed(0)}K DH
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-300 shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">MRE éligibles</p>
                <p className="text-green-200 text-[10px]">résidence principale 5 ans</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://credit.buymydar.com/fr/register"
            className="inline-flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-xl
                       bg-white text-emerald-800 text-sm font-bold hover:bg-green-50 transition-colors
                       shadow-lg shadow-black/20"
          >
            Vérifier mon éligibilité
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
