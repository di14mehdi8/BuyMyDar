"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator, Info,
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

/* ── Inline translations for strings not in the main dict ───────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const I18N: Record<string, Record<string, any>> = {
  fr: {
    tab_borrowing: "Capacité d'emprunt",
    tab_refinancing: "Rachat de crédit",
    per_month: "/mois",
    annual: "annuel",
    fixed: "fixe",
    years: "ans",
    months: "mois",
    min_income: "Revenu min. requis",
    dti_note: "Pour un taux d'effort de 33% (norme BAM)",
    saved_vs_avg: "économisés vs. taux moyen",
    above_avg: "au-dessus du taux moyen",
    best_offer: "Meilleure offre",
    lowest_rate: "Taux le plus bas",
    how_calc: "Comment est calculée cette simulation ?",
    formula: "Formule",
    formula_desc: "P = capital · r = taux mensuel · n = mensualités. Assurance sur capital initial (BAM).",
    export_csv: "Exporter CSV",
    chart_balance: "Capital restant",
    chart_interest: "Intérêts annuels",
    tbl_year: "Année", tbl_payment: "Mensualité", tbl_principal: "Capital",
    tbl_interest: "Intérêts", tbl_balance: "Restant dû",
    rates_updated: "Taux mis à jour :",
    sim_for: "Simulation pour", over: "sur", years_lbl: "ans",
    bc_salary: "Revenu mensuel net",
    bc_other: "Autres revenus (loyers, dividendes…)",
    bc_debts: "Charges de crédit existantes",
    bc_term: "Durée souhaitée",
    bc_rate: "Taux annuel",
    bc_title: "Capacité d'emprunt maximale",
    bc_sub: "capital empruntable (assurance incluse)",
    bc_max_monthly: "Mensualité max (33% DTI)",
    bc_dti: "Taux d'effort ≤ 33% (norme BAM)",
    bc_total_income: "Revenu total pris en compte",
    bc_deductions: "Charges déduites",
    bc_available: "Mensualité disponible",
    bc_capital: "Capital (taux sélectionné)",
    bc_over_at: (y: number, r: number) => `sur ${y} ans à ${r}%`,
    bc_best_bank: (y: number) => `Avec la meilleure banque actuelle (CIH 4.45%) sur ${y} ans :`,
    re_capital: "Capital restant dû",
    re_current_rate: "Taux actuel",
    re_new_rate: "Nouveau taux proposé",
    re_remaining: "Durée restante",
    ira_title: "IRA (Indemnité de remboursement anticipé)",
    ira_desc: "Plafonnée par BAM au minimum de : 3% du capital restant dû ou 6 mois d'intérêts.",
    ira_your: "Votre IRA estimée :",
    re_savings_title: "Économie totale estimée",
    re_no_savings: "Rachat non rentable",
    re_after_ira: (v: string) => `après remboursement de l'IRA (${v})`,
    re_not_worth: "Le nouveau taux est supérieur ou égal à l'actuel",
    re_breakeven: "Point mort",
    re_months: (n: number) => `${n} mois`,
    re_current_monthly: "Mensualité actuelle",
    re_new_monthly: "Nouvelle mensualité",
    re_monthly_savings: "Économie mensuelle",
    re_ira_row: "IRA estimée",
    re_ira_sub: "3% capital ou 6 mois intérêts",
    re_check: "Vérifiez avec votre banque si l'IRA est incluse dans le nouveau prêt ou à régler au comptant.",
    reset: "Réinitialiser",
    acq_title: "Frais d'acquisition estimés",
    acq_registration: "Droits d'enregistrement (4%)",
    acq_conservation: "Conservation foncière (1,5%)",
    acq_notary: "Honoraires notaire + TVA",
    acq_hypotheque: "Inscription hypothécaire (1%)",
    acq_bank_fees: "Frais de dossier bancaire",
    acq_bank_fees_sub: "souvent négociable",
    acq_total: "Total frais d'acquisition",
    acq_total_budget: "Budget total nécessaire",
    acq_total_budget_sub: "montant emprunté + frais",
  },
  en: {
    tab_borrowing: "Borrowing Capacity",
    tab_refinancing: "Refinancing",
    per_month: "/month",
    annual: "annual",
    fixed: "fixed",
    years: "years",
    months: "months",
    min_income: "Min. income required",
    dti_note: "For a 33% debt-to-income ratio (BAM standard)",
    saved_vs_avg: "saved vs. average rate",
    above_avg: "above average rate",
    best_offer: "Best offer",
    lowest_rate: "Lowest rate",
    how_calc: "How is this simulation calculated?",
    formula: "Formula",
    formula_desc: "P = principal · r = monthly rate · n = payments. Insurance on initial capital (BAM).",
    export_csv: "Export CSV",
    chart_balance: "Remaining balance",
    chart_interest: "Annual interest",
    tbl_year: "Year", tbl_payment: "Payment", tbl_principal: "Principal",
    tbl_interest: "Interest", tbl_balance: "Balance",
    rates_updated: "Rates updated:",
    sim_for: "Simulation for", over: "over", years_lbl: "years",
    bc_salary: "Net monthly income",
    bc_other: "Other income (rent, dividends…)",
    bc_debts: "Existing debt payments",
    bc_term: "Desired duration",
    bc_rate: "Annual rate",
    bc_title: "Maximum borrowing capacity",
    bc_sub: "borrowable capital (insurance included)",
    bc_max_monthly: "Max monthly payment (33% DTI)",
    bc_dti: "Debt-to-income ratio ≤ 33% (BAM standard)",
    bc_total_income: "Total income considered",
    bc_deductions: "Deductions",
    bc_available: "Available monthly payment",
    bc_capital: "Capital (selected rate)",
    bc_over_at: (y: number, r: number) => `over ${y} years at ${r}%`,
    bc_best_bank: (y: number) => `With the best current bank (CIH 4.45%) over ${y} years:`,
    re_capital: "Remaining capital",
    re_current_rate: "Current rate",
    re_new_rate: "Proposed new rate",
    re_remaining: "Remaining duration",
    ira_title: "IRA (Early Repayment Penalty)",
    ira_desc: "Capped by BAM at the lower of: 3% of remaining capital or 6 months of interest.",
    ira_your: "Your estimated IRA:",
    re_savings_title: "Total estimated savings",
    re_no_savings: "Refinancing not profitable",
    re_after_ira: (v: string) => `after repaying the IRA (${v})`,
    re_not_worth: "The new rate is higher than or equal to the current one",
    re_breakeven: "Break-even",
    re_months: (n: number) => `${n} months`,
    re_current_monthly: "Current monthly payment",
    re_new_monthly: "New monthly payment",
    re_monthly_savings: "Monthly savings",
    re_ira_row: "Estimated IRA",
    re_ira_sub: "3% capital or 6 months interest",
    re_check: "Check with your bank if the IRA is included in the new loan or to be paid upfront.",
    reset: "Reset",
    acq_title: "Estimated acquisition fees",
    acq_registration: "Registration duties (4%)",
    acq_conservation: "Land registry (1.5%)",
    acq_notary: "Notary fees + VAT",
    acq_hypotheque: "Mortgage registration (1%)",
    acq_bank_fees: "Bank processing fee",
    acq_bank_fees_sub: "often negotiable",
    acq_total: "Total acquisition fees",
    acq_total_budget: "Total budget needed",
    acq_total_budget_sub: "loan amount + fees",
  },
  ar: {
    tab_borrowing: "قدرة الاقتراض",
    tab_refinancing: "إعادة التمويل",
    per_month: "/شهر",
    annual: "سنوي",
    fixed: "ثابت",
    years: "سنوات",
    months: "أشهر",
    min_income: "الدخل الأدنى المطلوب",
    dti_note: "لنسبة مديونية 33% (معيار BAM)",
    saved_vs_avg: "وفرت مقارنة بالمعدل المتوسط",
    above_avg: "أعلى من المعدل المتوسط",
    best_offer: "أفضل عرض",
    lowest_rate: "أدنى معدل",
    how_calc: "كيف يُحسب هذا المحاكي؟",
    formula: "الصيغة",
    formula_desc: "م = أ × ر(١+ر)^ن / [(١+ر)^ن − ١]. التأمين على رأس المال الأولي (BAM).",
    export_csv: "تصدير CSV",
    chart_balance: "الرصيد المتبقي",
    chart_interest: "الفوائد السنوية",
    tbl_year: "السنة", tbl_payment: "القسط", tbl_principal: "الأصل",
    tbl_interest: "الفوائد", tbl_balance: "الرصيد",
    rates_updated: "تاريخ تحديث الأسعار:",
    sim_for: "محاكاة لـ", over: "على مدى", years_lbl: "سنوات",
    bc_salary: "صافي الدخل الشهري",
    bc_other: "دخل آخر (إيجار، أرباح…)",
    bc_debts: "أقساط قروض موجودة",
    bc_term: "المدة المطلوبة",
    bc_rate: "المعدل السنوي",
    bc_title: "الحد الأقصى لقدرة الاقتراض",
    bc_sub: "رأس المال القابل للاقتراض (شامل التأمين)",
    bc_max_monthly: "الحد الأقصى للقسط (33% DTI)",
    bc_dti: "نسبة المديونية ≤ 33% (معيار BAM)",
    bc_total_income: "إجمالي الدخل المحتسب",
    bc_deductions: "الخصومات",
    bc_available: "القسط الشهري المتاح",
    bc_capital: "رأس المال (المعدل المختار)",
    bc_over_at: (y: number, r: number) => `على ${y} سنة بمعدل ${r}%`,
    bc_best_bank: (y: number) => `مع أفضل بنك حالي (CIH 4.45%) على ${y} سنة:`,
    re_capital: "رأس المال المتبقي",
    re_current_rate: "المعدل الحالي",
    re_new_rate: "المعدل الجديد المقترح",
    re_remaining: "المدة المتبقية",
    ira_title: "غرامة السداد المبكر (IRA)",
    ira_desc: "محددة بـ BAM بأدنى قيمة: 3% من رأس المال أو 6 أشهر فوائد.",
    ira_your: "غرامتك التقديرية:",
    re_savings_title: "إجمالي الوفورات التقديرية",
    re_no_savings: "إعادة التمويل غير مجدية",
    re_after_ira: (v: string) => `بعد سداد الغرامة (${v})`,
    re_not_worth: "المعدل الجديد أعلى أو مساوٍ للمعدل الحالي",
    re_breakeven: "نقطة التعادل",
    re_months: (n: number) => `${n} أشهر`,
    re_current_monthly: "القسط الحالي",
    re_new_monthly: "القسط الجديد",
    re_monthly_savings: "الوفر الشهري",
    re_ira_row: "الغرامة التقديرية",
    re_ira_sub: "3% رأس مال أو 6 أشهر فوائد",
    re_check: "تحقق مع بنكك إذا كانت الغرامة مدرجة في القرض الجديد أم تُدفع نقداً.",
    reset: "إعادة تعيين",
    acq_title: "رسوم الاقتناء المقدرة",
    acq_registration: "رسوم التسجيل (4%)",
    acq_conservation: "المحافظة العقارية (1.5%)",
    acq_notary: "أتعاب الموثق + TVA",
    acq_hypotheque: "تسجيل الرهن (1%)",
    acq_bank_fees: "رسوم ملف البنك",
    acq_bank_fees_sub: "قابلة للتفاوض",
    acq_total: "إجمالي رسوم الاقتناء",
    acq_total_budget: "الميزانية الإجمالية المطلوبة",
    acq_total_budget_sub: "مبلغ القرض + الرسوم",
  },
};
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

  const T = I18N[lang] ?? I18N.fr;

  const tabs: { id: Tab; label: string }[] = [
    { id: "simulator",    label: dict.tabs.simulator },
    { id: "amortization", label: dict.tabs.amortization },
    { id: "comparison",   label: dict.tabs.comparison },
    { id: "capacite",     label: T.tab_borrowing },
    { id: "rachat",       label: T.tab_refinancing },
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
                title={T.reset}
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
                  hint={T.annual}
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
                      {T.how_calc}
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
                            <strong className="text-slate-700">{T.formula} :</strong>{" "}
                            <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                              M = P × r(1+r)ⁿ / [(1+r)ⁿ − 1]
                            </code>
                          </p>
                          <p>{T.formula_desc}</p>
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
                      <span className="text-blue-200">{T.min_income}</span>
                      <span className="text-white font-bold">
                        {fmt(result.totalMonthly / 0.33)}
                        <span className="text-blue-300 font-normal ms-1">{T.per_month}</span>
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-300/70">{T.dti_note}</p>
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
                      ? `✓ ${fmt(Math.abs(savingsVsAverage))}${T.per_month} ${T.saved_vs_avg}`
                      : `↑ ${fmt(Math.abs(savingsVsAverage))}${T.per_month} ${T.above_avg}`}
                  </div>
                )}

                {/* Acquisition fees summary */}
                {(() => {
                  const registration  = principal * 0.04;
                  const conservation  = principal * 0.015 + 150;
                  const notaryH       = (() => { const b = [{c:100000,r:0.015},{c:500000,r:0.01},{c:2000000,r:0.005},{c:Infinity,r:0.0025}]; let f=0,p=0; for(const{c,r}of b){if(principal<=p)break;f+=(Math.min(principal,c)-p)*r;p=c;} return f; })();
                  const tva           = notaryH * 0.10;
                  const hypotheque    = principal * 0.01 + 150;
                  const bankFee       = 1_000;
                  const totalAcqFees  = registration + conservation + notaryH + tva + hypotheque + 200 + bankFee;
                  const totalBudget   = principal + totalAcqFees;
                  return (
                    <div className="card p-4 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {T.acq_title}
                      </p>
                      <ResultRow label={T.acq_registration}  value={fmt(registration)} />
                      <ResultRow label={T.acq_conservation}  value={fmt(conservation)} />
                      <ResultRow label={T.acq_notary}        value={fmt(notaryH + tva)} />
                      <ResultRow label={T.acq_hypotheque}    value={fmt(hypotheque)} />
                      <ResultRow label={T.acq_bank_fees}     value={fmt(bankFee)} sub={T.acq_bank_fees_sub} />
                      <div className="border-t border-slate-100 pt-2 mt-2">
                        <ResultRow label={T.acq_total}       value={fmt(totalAcqFees)} />
                      </div>
                      <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-800">{T.acq_total_budget}</span>
                          <span className="text-sm font-bold text-amber-900">{fmt(totalBudget)}</span>
                        </div>
                        <p className="text-[10px] text-amber-600">{T.acq_total_budget_sub}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Pre-approval conversion card */}
                <div className="rounded-2xl overflow-hidden border border-orange-100">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
                    <p className="text-white font-bold text-sm mb-0.5">
                      {lang === "ar" ? "استمارتك جاهزة!" : lang === "en" ? "Your estimate is ready." : "Votre estimation est prête."}
                    </p>
                    <p className="text-orange-100 text-xs leading-relaxed">
                      {lang === "ar"
                        ? "احصل على موافقة مسبقة خلال ٤٨ ساعة — مجاني وبدون التزام."
                        : lang === "en"
                        ? "Get a pre-approval in 48h — free, no commitment."
                        : "Obtenez une pré-approbation en 48h — gratuit, sans engagement."}
                    </p>
                  </div>
                  <div className="bg-orange-50 px-5 py-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-orange-700 font-medium">
                      {lang === "ar" ? "دوسيه رقمي • ١٠ دقائق" : lang === "en" ? "Online dossier · 10 min" : "Dossier en ligne · 10 min"}
                    </p>
                    <a
                      href={`https://credit.buymydar.com/${lang}/register`}
                      className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white
                                 text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                    >
                      {lang === "ar" ? "ابدأ →" : lang === "en" ? "Start my file →" : "Démarrer mon dossier →"}
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
                  <Download className="w-3.5 h-3.5" /> {T.export_csv}
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
                    <Area type="monotone" dataKey="balance"  name={T.chart_balance}  stroke="#1E3A6E" strokeWidth={2} fill="url(#gBalance)" />
                    <Area type="monotone" dataKey="interest" name={T.chart_interest} stroke="#F59E0B" strokeWidth={2} fill="url(#gInterest)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {[T.tbl_year, T.tbl_payment, T.tbl_principal, T.tbl_interest, T.tbl_balance].map((h) => (
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
                {T.sim_for} <strong className="text-slate-700">{fmt(principal)}</strong> {T.over} <strong className="text-slate-700">{termYears} {T.years_lbl}</strong>
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
                            {fmt(sim.totalMonthly)}<span className="text-slate-400 font-normal">{T.per_month}</span>
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
              <p className="text-[10px] text-slate-400 mt-3 text-right">
                {T.rates_updated} {new Date(
                  Math.max(...BANK_RATES.map(b => new Date(b.lastUpdated).getTime()))
                ).toLocaleDateString(lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric" })}
              </p>
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
                <Slider label={T.bc_salary} value={bcSalary} min={3_000} max={100_000} step={500}
                  onChange={setBcSalary} display={fmt(bcSalary)} hint={T.per_month} />
                <Slider label={T.bc_other} value={bcOther} min={0} max={50_000} step={500}
                  onChange={setBcOther} display={fmt(bcOther)} hint={T.per_month} />
                <Slider label={T.bc_debts} value={bcDebts} min={0} max={20_000} step={500}
                  onChange={setBcDebts} display={fmt(bcDebts)} hint={T.per_month} />
                <Slider label={T.bc_term} value={bcTerm} min={5} max={30} step={1}
                  onChange={setBcTerm} display={`${bcTerm}`} hint={T.years} />
                <Slider label={T.bc_rate} value={bcRate} min={0.03} max={0.08} step={0.0005}
                  onChange={setBcRate} display={`${(bcRate * 100).toFixed(2)}%`} hint={T.fixed} />
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
                    {T.bc_title}
                  </p>
                  <p className="text-4xl font-bold tracking-tight mb-0.5">
                    {fmt(bcMaxCapital)}
                  </p>
                  <p className="text-emerald-300 text-xs">{T.bc_sub}</p>
                  <div className="mt-4 pt-3 border-t border-white/15">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-200">{T.bc_max_monthly}</span>
                      <span className="text-white font-bold">{fmt(bcMaxMonthly)}{T.per_month}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/70 rounded-full" style={{ width: "33%" }} />
                    </div>
                    <p className="text-[10px] text-emerald-300/70 mt-1.5">{T.bc_dti}</p>
                  </div>
                </motion.div>

                <div className="card p-4 space-y-0">
                  <ResultRow label={T.bc_total_income} value={fmt(bcSalary + bcOther)} />
                  <ResultRow label={T.bc_deductions} value={fmt(bcDebts)} />
                  <ResultRow label={T.bc_available} value={fmt(bcMaxMonthly)} />
                  <ResultRow
                    label={T.bc_capital}
                    value={fmt(bcMaxCapital)}
                    sub={T.bc_over_at(bcTerm, parseFloat((bcRate * 100).toFixed(2)))}
                  />
                </div>

                {bcMaxCapital > 0 && (
                  <div className="rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 text-xs text-brand-700">
                    {T.bc_best_bank(bcTerm)}{" "}
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
                <Slider label={T.re_capital} value={reCapital} min={100_000} max={5_000_000} step={50_000}
                  onChange={setReCapital} display={fmt(reCapital)} />
                <Slider label={T.re_current_rate} value={reCurrentRate} min={0.04} max={0.10} step={0.0005}
                  onChange={setReCurrentRate} display={`${(reCurrentRate * 100).toFixed(2)}%`} hint={T.annual} />
                <Slider label={T.re_new_rate} value={reNewRate} min={0.03} max={0.09} step={0.0005}
                  onChange={setReNewRate} display={`${(reNewRate * 100).toFixed(2)}%`} hint={T.annual} />
                <Slider label={T.re_remaining} value={reRemaining} min={2} max={30} step={1}
                  onChange={setReRemaining} display={`${reRemaining}`} hint={T.years} />

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-500 space-y-1">
                  <p><strong className="text-slate-700">{T.ira_title}</strong></p>
                  <p>
                    {T.ira_desc}{" "}
                    {T.ira_your} <strong className="text-slate-700">{fmt(refi.ira)}</strong>
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
                    {refi.monthlySavings > 0 ? T.re_savings_title : T.re_no_savings}
                  </p>
                  <p className="text-4xl font-bold tracking-tight mb-0.5">
                    {refi.monthlySavings > 0 ? fmt(refi.totalSavings) : "—"}
                  </p>
                  <p className="text-purple-300 text-xs">
                    {refi.monthlySavings > 0
                      ? T.re_after_ira(fmt(refi.ira))
                      : T.re_not_worth}
                  </p>
                  {refi.monthlySavings > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/15">
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-200">{T.re_breakeven}</span>
                        <span className="text-white font-bold">
                          {refi.breakEvenMonths === Infinity ? "—" : T.re_months(refi.breakEvenMonths)}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>

                <div className="card p-4">
                  <ResultRow label={T.re_current_monthly}   value={fmt(refi.currentMonthly)} />
                  <ResultRow label={T.re_new_monthly}       value={fmt(refi.newMonthly)} />
                  <ResultRow
                    label={T.re_monthly_savings}
                    value={refi.monthlySavings > 0 ? fmt(refi.monthlySavings) : "—"}
                    sub={refi.monthlySavings > 0 ? `×${reRemaining * 12} ${T.months}` : undefined}
                  />
                  <ResultRow label={T.re_ira_row} value={fmt(refi.ira)} sub={T.re_ira_sub} />
                </div>

                <div className="rounded-xl bg-purple-50 border border-purple-100 px-4 py-3 text-xs text-purple-700">
                  {T.re_check}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
