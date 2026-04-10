"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/mortgage/calculator";
import type { Locale } from "@/lib/i18n/config";

/* ── i18n ──────────────────────────────────────────────────────────── */
const I18N: Record<string, Record<string, string>> = {
  fr: {
    title: "Simulateur Mourabaha",
    subtitle: "Estimation simplifiée — marge fixe (flat-rate)",
    property_price: "Prix du bien",
    down_payment: "Apport personnel",
    margin_rate: "Marge de profit annuelle",
    duration: "Durée",
    years: "ans",
    annual: "annuel",
    monthly_payment: "Mensualité",
    per_month: "par mois",
    total_cost: "Coût total",
    total_margin: "Marge totale payée",
    down_payment_amount: "Apport personnel",
    financed: "Montant financé",
    reset: "Réinitialiser",
    cta_title: "Besoin d'accompagnement expert ?",
    cta_desc: "Nos courtiers spécialisés en finance participative vous guident dans votre projet Mourabaha — comparaison des banques, montage du dossier, négociation de la marge.",
    cta_button: "Être accompagné gratuitement",
    note: "Calcul simplifié à marge fixe (flat-rate). Les banques participatives peuvent appliquer des méthodes de calcul différentes. Contactez un courtier pour une estimation précise.",
  },
  en: {
    title: "Mourabaha Simulator",
    subtitle: "Simplified estimate — flat-rate margin",
    property_price: "Property price",
    down_payment: "Down payment",
    margin_rate: "Annual profit margin",
    duration: "Duration",
    years: "years",
    annual: "annual",
    monthly_payment: "Monthly payment",
    per_month: "per month",
    total_cost: "Total cost",
    total_margin: "Total margin paid",
    down_payment_amount: "Down payment",
    financed: "Financed amount",
    reset: "Reset",
    cta_title: "Need expert guidance?",
    cta_desc: "Our brokers specialized in participative finance guide you through your Mourabaha project — bank comparison, file preparation, margin negotiation.",
    cta_button: "Get free guidance",
    note: "Simplified flat-rate calculation. Participative banks may use different calculation methods. Contact a broker for an accurate estimate.",
  },
  ar: {
    title: "محاكي المرابحة",
    subtitle: "تقدير مبسط — هامش ثابت",
    property_price: "ثمن العقار",
    down_payment: "المساهمة الشخصية",
    margin_rate: "هامش الربح السنوي",
    duration: "المدة",
    years: "سنة",
    annual: "سنوي",
    monthly_payment: "القسط الشهري",
    per_month: "شهريا",
    total_cost: "التكلفة الإجمالية",
    total_margin: "إجمالي هامش الربح",
    down_payment_amount: "المساهمة الشخصية",
    financed: "المبلغ الممول",
    reset: "إعادة تعيين",
    cta_title: "هل تحتاج إلى مرافقة متخصصة؟",
    cta_desc: "وسطاؤنا المتخصصون في التمويل التشاركي يرافقونك في مشروع المرابحة — مقارنة البنوك، إعداد الملف، التفاوض على الهامش.",
    cta_button: "احصل على مرافقة مجانية",
    note: "حساب مبسط بهامش ثابت. قد تطبق البنوك التشاركية طرق حساب مختلفة. تواصل مع وسيط للحصول على تقدير دقيق.",
  },
};

/* ── Defaults ──────────────────────────────────────────────────────── */
const DEFAULTS = {
  price: 1_500_000,
  downPct: 20,
  marginRate: 4.5,
  duration: 20,
};

/* ── Slider ────────────────────────────────────────────────────────── */
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
          <span className="text-sm font-bold text-emerald-600">{display}</span>
          {hint && <span className="text-xs text-slate-400 ms-1">{hint}</span>}
        </div>
      </div>
      <div className="relative">
        <div className="absolute top-[8px] left-0 right-0 h-1 rounded-full bg-slate-200 pointer-events-none" />
        <div
          className="absolute top-[8px] left-0 h-1 rounded-full bg-emerald-600 pointer-events-none transition-all"
          style={{ width: `${pct}%` }}
        />
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

/* ── Result row ────────────────────────────────────────────────────── */
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

/* ── Main component ────────────────────────────────────────────────── */
export function MourabahaSimulator({ lang }: { lang: Locale }) {
  const [price, setPrice] = useState(DEFAULTS.price);
  const [downPct, setDownPct] = useState(DEFAULTS.downPct);
  const [marginRate, setMarginRate] = useState(DEFAULTS.marginRate);
  const [duration, setDuration] = useState(DEFAULTS.duration);

  const T = I18N[lang] ?? I18N.fr;

  const fmt = useCallback(
    (amount: number) => formatCurrency(amount, "MAD", lang),
    [lang],
  );

  const result = useMemo(() => {
    const downPayment = Math.round(price * (downPct / 100));
    const financed = price - downPayment;
    const totalMargin = financed * (marginRate / 100) * duration;
    const totalRepayment = financed + totalMargin;
    const monthly = totalRepayment / (duration * 12);
    const totalCost = price + totalMargin;
    return { downPayment, financed, totalMargin, totalRepayment, monthly, totalCost };
  }, [price, downPct, marginRate, duration]);

  const reset = () => {
    setPrice(DEFAULTS.price);
    setDownPct(DEFAULTS.downPct);
    setMarginRate(DEFAULTS.marginRate);
    setDuration(DEFAULTS.duration);
  };

  return (
    <section id="mourabaha-simulator" className="scroll-mt-28">
      <div className="card overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.07)]">
        {/* Top bar */}
        <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">{T.title}</h2>
              <p className="text-xs text-slate-400">{T.subtitle}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
            title={T.reset}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Sliders */}
          <div className="lg:col-span-3 space-y-7">
            <Slider
              label={T.property_price}
              value={price} min={200_000} max={10_000_000} step={50_000}
              onChange={setPrice}
              display={fmt(price)}
            />
            <Slider
              label={T.down_payment}
              value={downPct} min={10} max={50} step={1}
              onChange={setDownPct}
              display={`${downPct}%`}
              hint={fmt(Math.round(price * (downPct / 100)))}
            />
            <Slider
              label={T.margin_rate}
              value={marginRate} min={3} max={8} step={0.1}
              onChange={setMarginRate}
              display={`${marginRate.toFixed(1)}%`}
              hint={T.annual}
            />
            <Slider
              label={T.duration}
              value={duration} min={5} max={25} step={1}
              onChange={setDuration}
              display={`${duration}`}
              hint={T.years}
            />

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {T.note}
            </p>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-3">
            {/* Hero result */}
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: "linear-gradient(135deg,#1E3A6E 0%,#0F2040 100%)" }}
            >
              <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                {T.monthly_payment}
              </p>
              <p className="text-4xl font-bold tracking-tight mb-0.5">
                {fmt(Math.round(result.monthly))}
              </p>
              <p className="text-blue-300 text-xs">/ {T.per_month}</p>
            </div>

            {/* Detail rows */}
            <div className="card p-4">
              <ResultRow label={T.financed} value={fmt(result.financed)} />
              <ResultRow label={T.down_payment_amount} value={fmt(result.downPayment)} sub={`${downPct}%`} />
              <ResultRow label={T.total_margin} value={fmt(Math.round(result.totalMargin))} />
              <ResultRow label={T.total_cost} value={fmt(Math.round(result.totalCost))} />
            </div>

            {/* CTA card */}
            <a
              href="https://credit.buymydar.com?utm_source=buymydar&utm_medium=mourabaha_simulator"
              className="rounded-2xl overflow-hidden border border-emerald-100 block group"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4">
                <p className="text-white font-bold text-sm mb-0.5">{T.cta_title}</p>
                <p className="text-emerald-100 text-xs leading-relaxed">{T.cta_desc}</p>
              </div>
              <div className="bg-emerald-50 px-5 py-3 flex items-center justify-between gap-3">
                <span className="text-xs text-emerald-700 font-semibold">{T.cta_button}</span>
                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
