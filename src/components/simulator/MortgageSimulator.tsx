"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, TrendingDown, Info, ExternalLink,
  ArrowRight, RefreshCw, ChevronRight,
} from "lucide-react";
import {
  calculateMortgage, formatCurrency, convertCurrency,
  BANK_RATES, MARKET_AVERAGE_RATE, CURRENCY_RATES,
} from "@/lib/mortgage/calculator";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface SimulatorProps { lang: string; dict: Dictionary["simulator"]; }
type Currency = "MAD" | "EUR" | "USD";
type Tab = "simulator" | "amortization" | "comparison";

const CURRENCIES: { value: Currency; flag: string; symbol: string }[] = [
  { value: "MAD", flag: "🇲🇦", symbol: "DH" },
  { value: "EUR", flag: "🇪🇺", symbol: "€"  },
  { value: "USD", flag: "🇺🇸", symbol: "$"  },
];

const DEFAULTS = {
  principal:    1_500_000,
  annualRate:   MARKET_AVERAGE_RATE,
  termYears:    20,
  insuranceRate: 0.003,
};

/* ── Slider ─────────────────────────────────────────────────────────── */
function Slider({
  label, value, min, max, step, onChange, display, hint,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; display: string; hint?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-600">{label}</label>
        <div className="text-right">
          <span className="text-sm font-bold text-brand-600">{display}</span>
          {hint && <span className="text-xs text-slate-400 ms-1">{hint}</span>}
        </div>
      </div>
      <div className="relative pb-1">
        {/* Track fill */}
        <div className="absolute top-1.5 left-0 h-1 rounded-full bg-brand-600 pointer-events-none transition-all"
             style={{ width: `${pct}%` }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full"
          style={{ background: "transparent" }}
          aria-label={label} aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-300 font-medium tabular-nums">
        <span>{min.toLocaleString("fr")}</span>
        <span>{max.toLocaleString("fr")}</span>
      </div>
    </div>
  );
}

/* ── Result number ──────────────────────────────────────────────────── */
function ResultRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-slate-900">{value}</span>
        {sub && <span className="text-xs text-slate-400 block">{sub}</span>}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
export function MortgageSimulator({ lang, dict }: SimulatorProps) {
  const [principal,     setPrincipal]     = useState(DEFAULTS.principal);
  const [annualRate,    setAnnualRate]    = useState(DEFAULTS.annualRate);
  const [termYears,     setTermYears]     = useState(DEFAULTS.termYears);
  const [insuranceRate, setInsuranceRate] = useState(DEFAULTS.insuranceRate);
  const [currency,      setCurrency]      = useState<Currency>("MAD");
  const [activeTab,     setActiveTab]     = useState<Tab>("simulator");
  const [showFormula,   setShowFormula]   = useState(false);

  const result = useMemo(
    () => calculateMortgage({ principal, annualRate, termMonths: termYears * 12, insuranceRate }),
    [principal, annualRate, termYears, insuranceRate]
  );

  const fmt = useCallback(
    (mad: number) => formatCurrency(convertCurrency(mad, currency), currency, lang),
    [currency, lang]
  );

  const chartData = useMemo(
    () => result.schedule
      .filter((_, i) => i % 12 === 11)
      .map((row) => ({
        year: Math.ceil(row.month / 12),
        balance:  Math.round(convertCurrency(row.balance, currency)),
        interest: Math.round(convertCurrency(row.interest * 12, currency)),
        principal: Math.round(convertCurrency(row.principal * 12, currency)),
      })),
    [result.schedule, currency]
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "simulator",    label: dict.tabs.simulator },
    { id: "amortization", label: dict.tabs.amortization },
    { id: "comparison",   label: dict.tabs.comparison },
  ];

  const savingsVsAverage = result.totalMonthly - calculateMortgage({
    principal, annualRate: MARKET_AVERAGE_RATE,
    termMonths: termYears * 12, insuranceRate,
  }).totalMonthly;

  return (
    <section id="simulator" className="scroll-mt-28" aria-labelledby="sim-heading">
      <div className="card overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.07)]">

        {/* ── Top bar ── */}
        <div className="px-6 pt-6 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 id="sim-heading" className="font-bold text-slate-900 text-lg">{dict.title}</h2>
                <p className="text-xs text-slate-400">{dict.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Currency tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCurrency(c.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      currency === c.value
                        ? "bg-white text-brand-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                    aria-pressed={currency === c.value}
                  >
                    {c.flag} {c.value}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setPrincipal(DEFAULTS.principal); setAnnualRate(DEFAULTS.annualRate); setTermYears(DEFAULTS.termYears); setInsuranceRate(DEFAULTS.insuranceRate); }}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
                title="Réinitialiser"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold transition-all relative whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-brand-600"
                    : "text-slate-400 hover:text-slate-600"
                )}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-600 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">

          {/* SIMULATOR TAB */}
          {activeTab === "simulator" && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8"
            >
              {/* Left: Sliders */}
              <div className="lg:col-span-3 space-y-7">
                <Slider
                  label={dict.amount_label}
                  value={principal} min={200_000} max={10_000_000} step={50_000}
                  onChange={setPrincipal}
                  display={fmt(principal)}
                />
                <Slider
                  label={dict.duration_label}
                  value={termYears} min={5} max={30} step={1}
                  onChange={setTermYears}
                  display={`${termYears}`}
                  hint={dict.years_suffix}
                />
                <Slider
                  label={dict.rate_label}
                  value={annualRate} min={0.03} max={0.08} step={0.0005}
                  onChange={setAnnualRate}
                  display={`${(annualRate * 100).toFixed(2)}%`}
                  hint="annuel"
                />
                <Slider
                  label={dict.insurance_label}
                  value={insuranceRate} min={0.001} max={0.006} step={0.0005}
                  onChange={setInsuranceRate}
                  display={`${(insuranceRate * 100).toFixed(3)}%`}
                  hint="p.a."
                />

                {/* Formula info */}
                <div className="rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
                  <button
                    onClick={() => setShowFormula(!showFormula)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Info className="w-4 h-4 text-slate-400" />
                      Comment est calculée cette simulation ?
                    </span>
                    <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", showFormula && "rotate-90")} />
                  </button>
                  <AnimatePresence>
                    {showFormula && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-xs text-slate-500 space-y-2 border-t border-slate-100 pt-3">
                          <p>
                            <strong className="text-slate-700">Formule :</strong>{" "}
                            <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                              M = P × r(1+r)ⁿ / [(1+r)ⁿ − 1]
                            </code>
                          </p>
                          <p>P = capital · r = taux mensuel · n = mensualités. Assurance sur capital initial (BAM).</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right: Results */}
              <div className="lg:col-span-2 space-y-3">
                {/* Hero result */}
                <motion.div
                  key={`${result.totalMonthly}-${currency}`}
                  initial={{ scale: 0.98, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-2xl p-5 text-white"
                  style={{ background: "linear-gradient(135deg,#1565C0 0%,#0D47A1 100%)" }}
                >
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                    {dict.result_monthly}
                  </p>
                  <p className="text-4xl font-bold tracking-tight mb-0.5">
                    {fmt(result.totalMonthly)}
                  </p>
                  <p className="text-blue-300 text-xs">/ {dict.months_suffix}</p>

                  {/* DTI hint */}
                  <div className="mt-4 pt-3 border-t border-white/15">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-200">Taux d&apos;effort estimé</span>
                      <span className="text-white font-bold">
                        ~{Math.round((result.totalMonthly / (principal * 0.0008)) * 100)}%
                        <span className="text-blue-300 font-normal ms-1">(max 40%)</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/70 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.round((result.totalMonthly / (principal * 0.0008)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Breakdown */}
                <div className="card p-4">
                  <ResultRow label={dict.result_total}     value={fmt(result.totalPayment)} />
                  <ResultRow label={dict.result_interest}  value={fmt(result.totalInterest)} />
                  <ResultRow label={dict.result_insurance} value={fmt(result.totalInsurance)} />
                </div>

                {/* Savings vs market */}
                {Math.abs(savingsVsAverage) > 10 && (
                  <div className={cn(
                    "rounded-xl px-4 py-3 text-xs font-medium",
                    savingsVsAverage < 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  )}>
                    {savingsVsAverage < 0
                      ? `✓ ${fmt(Math.abs(savingsVsAverage))}/mois économisés vs. taux moyen`
                      : `↑ ${fmt(Math.abs(savingsVsAverage))}/mois au-dessus du taux moyen`}
                  </div>
                )}

                {/* Best bank CTA */}
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meilleure offre</p>
                    <span className="badge-green">
                      <TrendingDown className="w-3 h-3" />
                      {(BANK_RATES[0].fixedRate * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <BankLogo bankId="attijariwafa" size={36} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Attijariwafa</p>
                        <p className="text-xs text-slate-400">Taux le plus bas</p>
                      </div>
                    </div>
                    <a
                      href={BANK_RATES[0].applyUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="btn-primary text-xs py-2 px-3"
                    >
                      {dict.apply_cta}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center px-2 leading-relaxed">
                  {dict.disclaimer}
                </p>
              </div>
            </motion.div>
          )}

          {/* AMORTIZATION TAB */}
          {activeTab === "amortization" && (
            <motion.div
              key="amortization"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-6"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1565C0" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `A${v}`} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                      formatter={(v: number) => [fmt(v / (CURRENCY_RATES[currency] ?? 1)), ""]}
                    />
                    <Area type="monotone" dataKey="balance"  name="Capital restant" stroke="#1565C0" strokeWidth={2} fill="url(#gBalance)" />
                    <Area type="monotone" dataKey="interest" name="Intérêts annuels" stroke="#F59E0B" strokeWidth={2} fill="url(#gInterest)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Année","Mensualité","Capital","Intérêts","Restant dû"].map((h) => (
                        <th key={h} className="py-3 px-4 text-start text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule
                      .filter((_, i) => i % 12 === 11 || i === 0)
                      .slice(0, 12)
                      .map((row) => (
                        <tr key={row.month} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-medium">{Math.ceil(row.month / 12)}</td>
                          <td className="py-3 px-4 tabular-nums">{fmt(row.payment + result.monthlyInsurance)}</td>
                          <td className="py-3 px-4 tabular-nums text-brand-600">{fmt(row.principal)}</td>
                          <td className="py-3 px-4 tabular-nums text-amber-600">{fmt(row.interest)}</td>
                          <td className="py-3 px-4 tabular-nums font-medium">{fmt(row.balance)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* COMPARISON TAB */}
          {activeTab === "comparison" && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <p className="text-xs text-slate-400 mb-4">
                Simulation pour <strong className="text-slate-700">{fmt(principal)}</strong> sur <strong className="text-slate-700">{termYears} ans</strong>
              </p>
              <div className="space-y-2">
                {BANK_RATES.map((bank, i) => {
                  const sim = calculateMortgage({ principal, annualRate: bank.fixedRate, termMonths: termYears * 12, insuranceRate });
                  const isBest = i === 0;
                  const barW = 100 - ((bank.fixedRate - Math.min(...BANK_RATES.map(b => b.fixedRate))) / (Math.max(...BANK_RATES.map(b => b.fixedRate)) - Math.min(...BANK_RATES.map(b => b.fixedRate)))) * 80;
                  return (
                    <div
                      key={bank.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors",
                        isBest ? "bg-brand-50 border border-brand-100" : "hover:bg-slate-50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        <BankLogo bankId={bank.id} size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-700 truncate">{bank.shortName}</span>
                          <span className={cn("text-xs font-bold tabular-nums", isBest ? "text-brand-600" : "text-slate-600")}>
                            {fmt(sim.totalMonthly)}<span className="text-slate-400 font-normal">/mois</span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barW}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: bank.color }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-slate-400">{(bank.fixedRate * 100).toFixed(2)}%</span>
                          {bank.mreEligible && <span className="text-[10px] text-emerald-600 font-medium">MRE ✓</span>}
                        </div>
                      </div>
                      <a
                        href={bank.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="shrink-0 btn-ghost py-1.5 px-2 text-xs"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
