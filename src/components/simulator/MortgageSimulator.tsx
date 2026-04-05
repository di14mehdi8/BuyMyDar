"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, TrendingDown, Info, ExternalLink,
  ArrowRight, RefreshCw, ChevronRight, Download,
  Users, RotateCcw,
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
type Tab = "simulator" | "amortization" | "comparison" | "capacite" | "rachat";

const CURRENCIES: { value: Currency; flag: string; symbol: string }[] = [
  { value: "MAD", flag: "🇲🇦", symbol: "DH" },
  { value: "EUR", flag: "🇪🇺", symbol: "€"  },
  { value: "USD", flag: "🇺🇸", symbol: "$"  },
];

const DEFAULTS = {
  principal:    1_500_000,
  annualRate:   MARKET_AVERAGE_RATE,
  termYears:    20,
  insuranceRate: 0.0043,
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
      <div className="relative">
        {/* Full grey track */}
        <div className="absolute top-[8px] left-0 right-0 h-1 rounded-full bg-slate-200 pointer-events-none" />
        {/* Brand fill — covers left portion up to thumb */}
        <div className="absolute top-[8px] left-0 h-1 rounded-full bg-brand-600 pointer-events-none transition-all"
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
    { id: "capacite",     label: "Capacité d'emprunt" },
    { id: "rachat",       label: "Rachat de crédit" },
  ];

  /* ── Borrowing-capacity state ───────────────────────────────────────── */
  const [bcSalary,    setBcSalary]    = useState(15_000);
  const [bcOther,     setBcOther]     = useState(0);
  const [bcDebts,     setBcDebts]     = useState(0);
  const [bcTerm,      setBcTerm]      = useState(20);
  const [bcRate,      setBcRate]      = useState(MARKET_AVERAGE_RATE);

  const bcMaxMonthly = useMemo(() => {
    const totalIncome = bcSalary + bcOther;
    return Math.max(0, totalIncome * 0.33 - bcDebts);
  }, [bcSalary, bcOther, bcDebts]);

  const bcMaxCapital = useMemo(() => {
    if (bcMaxMonthly <= 0) return 0;
    const r = bcRate / 12;
    const n = bcTerm * 12;
    const insMonthly = (1 * bcRate * 0.0043) / 12; // insurance per MAD
    // net monthly available for amortization (subtract insurance on capital)
    // iterate: capital = (maxMonthly - capital*ins/12) * [(1+r)^n-1]/[r*(1+r)^n]
    // Simplified: capital ≈ maxMonthly / (r*(1+r)^n/[(1+r)^n-1] + ins/12)
    const factor = Math.pow(1 + r, n);
    const annuityCoeff = (r * factor) / (factor - 1);
    const insCoeff = 0.0043 / 12;
    return Math.round(bcMaxMonthly / (annuityCoeff + insCoeff));
  }, [bcMaxMonthly, bcRate, bcTerm]);

  /* ── Refinancing state ──────────────────────────────────────────────── */
  const [reCapital,     setReCapital]     = useState(800_000);
  const [reCurrentRate, setReCurrentRate] = useState(0.055);
  const [reNewRate,     setReNewRate]     = useState(MARKET_AVERAGE_RATE);
  const [reRemaining,   setReRemaining]   = useState(15);

  const refi = useMemo(() => {
    const n = reRemaining * 12;
    const currentSim = calculateMortgage({ principal: reCapital, annualRate: reCurrentRate, termMonths: n });
    const newSim     = calculateMortgage({ principal: reCapital, annualRate: reNewRate,     termMonths: n });
    const monthlySavings = currentSim.totalMonthly - newSim.totalMonthly;
    // IRA = min(3% of capital, 6 months interest) — BAM regulation
    const sixMonthInterest = (reCapital * reCurrentRate * 6) / 12;
    const ira = Math.min(reCapital * 0.03, sixMonthInterest);
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(ira / monthlySavings) : Infinity;
    const totalSavings = monthlySavings > 0
      ? Math.max(0, monthlySavings * n - ira)
      : 0;
    return { currentMonthly: currentSim.totalMonthly, newMonthly: newSim.totalMonthly, monthlySavings, ira, breakEvenMonths, totalSavings };
  }, [reCapital, reCurrentRate, reNewRate, reRemaining]);

  /* ── CSV export ─────────────────────────────────────────────────────── */
  const downloadCSV = () => {
    const header = "Mois,Mensualité,Capital,Intérêts,Assurance,Capital restant";
    const rows = result.schedule.map((r) =>
      [r.month,
       (r.payment + result.monthlyInsurance).toFixed(2),
       r.principal.toFixed(2),
       r.interest.toFixed(2),
       result.monthlyInsurance.toFixed(2),
       r.balance.toFixed(2)
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "amortissement-buymydar.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const bestBank = useMemo(
    () => [...BANK_RATES].sort((a, b) => a.fixedRate - b.fixedRate)[0],
    []
  );

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
                  style={{ background: "linear-gradient(135deg,#1E3A6E 0%,#0F2040 100%)" }}
                >
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                    {dict.result_monthly}
                  </p>
                  <p className="text-4xl font-bold tracking-tight mb-0.5">
                    {fmt(result.totalMonthly)}
                  </p>
                  <p className="text-blue-300 text-xs">/ {dict.months_suffix}</p>

                  {/* Minimum income required for 33% DTI */}
                  <div className="mt-4 pt-3 border-t border-white/15">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-blue-200">Revenu min. requis</span>
                      <span className="text-white font-bold">
                        {fmt(result.totalMonthly / 0.33)}
                        <span className="text-blue-300 font-normal ms-1">/mois</span>
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-300/70">Pour un taux d&apos;effort de 33% (norme BAM)</p>
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
                      {(bestBank.fixedRate * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <BankLogo bankId={bestBank.id} size={36} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{bestBank.name}</p>
                        <p className="text-xs text-slate-400">Taux le plus bas</p>
                      </div>
                    </div>
                    <a
                      href={bestBank.applyUrl}
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
              <div className="flex justify-end">
                <button
                  onClick={downloadCSV}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                             bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Exporter CSV
                </button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1E3A6E" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1E3A6E" stopOpacity={0} />
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
                    <Area type="monotone" dataKey="balance"  name="Capital restant" stroke="#1E3A6E" strokeWidth={2} fill="url(#gBalance)" />
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
                  const isBest = bank.id === bestBank.id;
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
          {/* BORROWING CAPACITY TAB */}
          {activeTab === "capacite" && (
            <motion.div
              key="capacite"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8"
            >
              {/* Inputs */}
              <div className="lg:col-span-3 space-y-6">
                <Slider label="Revenu mensuel net" value={bcSalary} min={3_000} max={100_000} step={500}
                  onChange={setBcSalary} display={fmt(bcSalary)} hint="/mois" />
                <Slider label="Autres revenus (loyers, dividendes…)" value={bcOther} min={0} max={50_000} step={500}
                  onChange={setBcOther} display={fmt(bcOther)} hint="/mois" />
                <Slider label="Charges de crédit existantes" value={bcDebts} min={0} max={20_000} step={500}
                  onChange={setBcDebts} display={fmt(bcDebts)} hint="/mois" />
                <Slider label="Durée souhaitée" value={bcTerm} min={5} max={30} step={1}
                  onChange={setBcTerm} display={`${bcTerm}`} hint="ans" />
                <Slider label="Taux annuel" value={bcRate} min={0.03} max={0.08} step={0.0005}
                  onChange={setBcRate} display={`${(bcRate * 100).toFixed(2)}%`} hint="fixe" />
              </div>

              {/* Results */}
              <div className="lg:col-span-2 space-y-3">
                <motion.div
                  key={bcMaxCapital}
                  initial={{ scale: 0.98, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-2xl p-5 text-white"
                  style={{ background: "linear-gradient(135deg,#059669 0%,#065f46 100%)" }}
                >
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                    Capacité d'emprunt maximale
                  </p>
                  <p className="text-4xl font-bold tracking-tight mb-0.5">
                    {fmt(bcMaxCapital)}
                  </p>
                  <p className="text-emerald-300 text-xs">capital empruntable (assurance incluse)</p>
                  <div className="mt-4 pt-3 border-t border-white/15">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-200">Mensualité max (33% DTI)</span>
                      <span className="text-white font-bold">{fmt(bcMaxMonthly)}/mois</span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/70 rounded-full" style={{ width: "33%" }} />
                    </div>
                    <p className="text-[10px] text-emerald-300/70 mt-1.5">Taux d'effort ≤ 33% (norme BAM)</p>
                  </div>
                </motion.div>

                <div className="card p-4 space-y-0">
                  <ResultRow label="Revenu total pris en compte" value={fmt(bcSalary + bcOther)} />
                  <ResultRow label="Charges déduites" value={fmt(bcDebts)} />
                  <ResultRow label="Mensualité disponible" value={fmt(bcMaxMonthly)} />
                  <ResultRow
                    label="Capital (taux sélectionné)"
                    value={fmt(bcMaxCapital)}
                    sub={`sur ${bcTerm} ans à ${(bcRate * 100).toFixed(2)}%`}
                  />
                </div>

                {bcMaxCapital > 0 && (
                  <div className="rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 text-xs text-brand-700">
                    Avec la meilleure banque actuelle (CIH 4.45%) sur {bcTerm} ans :{" "}
                    <strong>{fmt(Math.round(bcMaxMonthly / ((0.0445/12 * Math.pow(1+0.0445/12, bcTerm*12)) / (Math.pow(1+0.0445/12, bcTerm*12)-1) + 0.0043/12)))}</strong>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* REFINANCING TAB */}
          {activeTab === "rachat" && (
            <motion.div
              key="rachat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8"
            >
              {/* Inputs */}
              <div className="lg:col-span-3 space-y-6">
                <Slider label="Capital restant dû" value={reCapital} min={100_000} max={5_000_000} step={50_000}
                  onChange={setReCapital} display={fmt(reCapital)} />
                <Slider label="Taux actuel" value={reCurrentRate} min={0.04} max={0.10} step={0.0005}
                  onChange={setReCurrentRate} display={`${(reCurrentRate * 100).toFixed(2)}%`} hint="annuel" />
                <Slider label="Nouveau taux proposé" value={reNewRate} min={0.03} max={0.09} step={0.0005}
                  onChange={setReNewRate} display={`${(reNewRate * 100).toFixed(2)}%`} hint="annuel" />
                <Slider label="Durée restante" value={reRemaining} min={2} max={30} step={1}
                  onChange={setReRemaining} display={`${reRemaining}`} hint="ans" />

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-500 space-y-1">
                  <p><strong className="text-slate-700">IRA (Indemnité de remboursement anticipé)</strong></p>
                  <p>
                    Plafonnée par BAM au minimum de : 3% du capital restant dû ou 6 mois d'intérêts.
                    Votre IRA estimée : <strong className="text-slate-700">{fmt(refi.ira)}</strong>
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-2 space-y-3">
                <motion.div
                  key={refi.totalSavings}
                  initial={{ scale: 0.98, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "rounded-2xl p-5 text-white",
                  )}
                  style={{ background: refi.monthlySavings > 0
                    ? "linear-gradient(135deg,#7c3aed 0%,#4c1d95 100%)"
                    : "linear-gradient(135deg,#6b7280 0%,#374151 100%)"
                  }}
                >
                  <p className="text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
                    {refi.monthlySavings > 0 ? "Économie totale estimée" : "Rachat non rentable"}
                  </p>
                  <p className="text-4xl font-bold tracking-tight mb-0.5">
                    {refi.monthlySavings > 0 ? fmt(refi.totalSavings) : "—"}
                  </p>
                  <p className="text-purple-300 text-xs">
                    {refi.monthlySavings > 0
                      ? `après remboursement de l'IRA (${fmt(refi.ira)})`
                      : "Le nouveau taux est supérieur ou égal à l'actuel"}
                  </p>
                  {refi.monthlySavings > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/15">
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-200">Point mort</span>
                        <span className="text-white font-bold">
                          {refi.breakEvenMonths === Infinity ? "—" : `${refi.breakEvenMonths} mois`}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>

                <div className="card p-4">
                  <ResultRow label="Mensualité actuelle"     value={fmt(refi.currentMonthly)} />
                  <ResultRow label="Nouvelle mensualité"     value={fmt(refi.newMonthly)} />
                  <ResultRow
                    label="Économie mensuelle"
                    value={refi.monthlySavings > 0 ? fmt(refi.monthlySavings) : "—"}
                    sub={refi.monthlySavings > 0 ? `×${reRemaining * 12} mois` : undefined}
                  />
                  <ResultRow label="IRA estimée" value={fmt(refi.ira)} sub="3% capital ou 6 mois intérêts" />
                </div>

                <div className="rounded-xl bg-purple-50 border border-purple-100 px-4 py-3 text-xs text-purple-700">
                  Vérifiez avec votre banque si l'IRA est incluse dans le nouveau prêt ou à régler au comptant.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
