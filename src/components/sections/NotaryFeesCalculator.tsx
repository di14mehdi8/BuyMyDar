"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { formatCurrency } from "@/lib/mortgage/calculator";
import { cn } from "@/lib/utils";

/** Moroccan notary honorarium — degressive regulated scale */
function notaryHonorarium(price: number): number {
  const brackets = [
    { cap: 100_000,   rate: 0.015  },
    { cap: 500_000,   rate: 0.010  },
    { cap: 2_000_000, rate: 0.005  },
    { cap: Infinity,  rate: 0.0025 },
  ];
  let fee = 0;
  let prev = 0;
  for (const { cap, rate } of brackets) {
    if (price <= prev) break;
    fee += (Math.min(price, cap) - prev) * rate;
    prev = cap;
  }
  return fee;
}

interface FeeRow { label: string; sub: string; value: number }

export function NotaryFeesCalculator() {
  const [price, setPrice] = useState(1_500_000);
  const [loan,  setLoan]  = useState(1_050_000);

  const fmt = (v: number) => formatCurrency(v, "MAD", "fr");
  const pct = (v: number) => `${((v / price) * 100).toFixed(2)}%`;

  const fees = useMemo<{ rows: FeeRow[]; total: number }>(() => {
    const registration  = price * 0.04;
    const conservation  = price * 0.015 + 150;
    const honorarium    = notaryHonorarium(price);
    const tva           = honorarium * 0.10;
    const hypotheque    = loan > 0 ? loan * 0.01 + 150 : 0;
    const timbre        = 200;
    const total = registration + conservation + honorarium + tva + hypotheque + timbre;

    const rows: FeeRow[] = [
      { label: "Droits d'enregistrement",          sub: "4% du prix de vente",                    value: registration  },
      { label: "Conservation foncière + dossier",   sub: "1,5% du prix + 150 DH fixes",            value: conservation  },
      { label: "Honoraires notaire",                sub: "Barème dégressif réglementé",             value: honorarium    },
      { label: "TVA sur honoraires",                sub: "10% des honoraires",                      value: tva           },
      ...(loan > 0 ? [{ label: "Enregistrement hypothèque", sub: "1% du prêt + 150 DH fixes", value: hypotheque }] : []),
      { label: "Timbre fiscal",                     sub: "Forfait estimé",                          value: timbre        },
    ];
    return { rows, total };
  }, [price, loan]);

  const totalPct = ((fees.total / price) * 100).toFixed(1);
  const apport   = price - loan;

  return (
    <motion.section
      id="frais-notaire"
      className="scroll-mt-28"
      aria-labelledby="notary-heading"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="card overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.07)]">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="notary-heading" className="font-bold text-slate-900 text-lg">
                Simulateur de Frais de Notaire
              </h2>
              <p className="text-xs text-slate-400">
                Estimation des frais d'acquisition immobilière au Maroc (droits, conservation, honoraires)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Sliders ── */}
          <div className="space-y-7">
            {/* Price slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">Prix du bien</label>
                <span className="text-sm font-bold text-amber-600">{fmt(price)}</span>
              </div>
              <div className="relative">
                <div
                  className="absolute top-[8px] left-0 h-1 rounded-full bg-amber-500 pointer-events-none transition-all"
                  style={{ width: `${((price - 200_000) / (10_000_000 - 200_000)) * 100}%` }}
                />
                <input
                  type="range" min={200_000} max={10_000_000} step={50_000} value={price}
                  onChange={(e) => {
                    const v = +e.target.value;
                    setPrice(v);
                    setLoan(Math.min(loan, Math.round(v * 0.85)));
                  }}
                  className="relative w-full"
                  style={{ background: "transparent" }}
                  aria-label="Prix du bien"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 font-medium tabular-nums">
                <span>200K</span><span>10M MAD</span>
              </div>
            </div>

            {/* Loan slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">Montant emprunté</label>
                <span className="text-sm font-bold text-amber-600">{fmt(loan)}</span>
              </div>
              <div className="relative">
                <div
                  className="absolute top-[8px] left-0 h-1 rounded-full bg-amber-500 pointer-events-none transition-all"
                  style={{ width: `${(loan / price) * 100}%` }}
                />
                <input
                  type="range" min={0} max={price} step={50_000} value={loan}
                  onChange={(e) => setLoan(+e.target.value)}
                  className="relative w-full"
                  style={{ background: "transparent" }}
                  aria-label="Montant emprunté"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 font-medium tabular-nums">
                <span>0</span><span>{fmt(price)}</span>
              </div>
            </div>

            {/* Apport card */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-amber-700 font-medium">Apport personnel</span>
                <span className="font-bold text-amber-800">{fmt(apport)} ({((apport / price) * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${(apport / price) * 100}%` }}
                />
              </div>
              {apport / price < 0.30 && (
                <p className="text-[11px] text-amber-700">
                  Pour les <strong>MRE</strong>, l'apport minimum est de <strong>30%</strong> versé en devises
                  (art. 793–796 Office des Changes).
                </p>
              )}
            </div>
          </div>

          {/* ── Results ── */}
          <div>
            {/* Total hero */}
            <div
              className="rounded-2xl p-5 text-white mb-4"
              style={{ background: "linear-gradient(135deg,#D97706 0%,#92400e 100%)" }}
            >
              <p className="text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                Total frais estimés
              </p>
              <p className="text-4xl font-bold tracking-tight mb-0.5">{fmt(fees.total)}</p>
              <p className="text-amber-300 text-xs">≈ {totalPct}% du prix du bien</p>
            </div>

            {/* Breakdown */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              {fees.rows.map(({ label, sub, value }, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition-colors",
                    i !== fees.rows.length - 1 && "border-b border-slate-50"
                  )}
                >
                  <div>
                    <p className="text-sm text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400">{sub}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">{fmt(value)}</p>
                    <p className="text-[10px] text-slate-400 tabular-nums">{pct(value)}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed px-1">
              Estimation indicative. Les honoraires de notaire suivent un barème dégressif réglementé
              par décret. Les droits d'enregistrement peuvent être réduits à 1,5% pour certains
              logements sociaux. Vérifiez avec votre notaire.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
