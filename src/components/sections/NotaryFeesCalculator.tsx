"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { formatCurrency } from "@/lib/mortgage/calculator";

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

/* ── i18n labels ──────────────────────────────────────────────────── */
const T: Record<string, Record<string, string>> = {
  fr: {
    heading: "Simulateur de Frais de Notaire",
    sub: "Estimation des frais d'acquisition immobilière au Maroc (droits, conservation, honoraires)",
    price_label: "Prix du bien",
    loan_label: "Montant emprunté",
    apport: "Apport personnel",
    mre_note: "Pour les <strong>MRE</strong>, l'apport minimum est de <strong>30%</strong> versé en devises (art. 793–796 Office des Changes).",
    total_label: "Total frais estimés",
    total_pct: "du prix du bien",
    registration: "Droits d'enregistrement",
    registration_sub: "4% du prix de vente",
    conservation: "Conservation foncière + dossier",
    conservation_sub: "1,5% du prix + 150 DH fixes",
    honorarium: "Honoraires notaire",
    honorarium_sub: "Barème dégressif réglementé",
    tva: "TVA sur honoraires",
    tva_sub: "10% des honoraires",
    hypotheque: "Enregistrement hypothèque",
    hypotheque_sub: "1% du prêt + 150 DH fixes",
    timbre: "Timbre fiscal",
    timbre_sub: "Forfait estimé",
    disclaimer: "Estimation indicative. Les honoraires de notaire suivent un barème dégressif réglementé par décret. Les droits d'enregistrement peuvent être réduits à 1,5% pour certains logements sociaux. Vérifiez avec votre notaire.",
    bank_fees: "Frais de dossier bancaire",
    bank_fees_sub: "500–1 500 DH (souvent négociable)",
    total_budget: "Budget total nécessaire",
    total_budget_sub: "Prix + frais d'acquisition + frais bancaires",
  },
  en: {
    heading: "Notary Fees Calculator",
    sub: "Estimate property acquisition fees in Morocco (duties, registry, notary fees)",
    price_label: "Property price",
    loan_label: "Loan amount",
    apport: "Down payment",
    mre_note: "For <strong>MRE</strong>, the minimum down payment is <strong>30%</strong> in foreign currency (Art. 793–796 Office des Changes).",
    total_label: "Total estimated fees",
    total_pct: "of property price",
    registration: "Registration duties",
    registration_sub: "4% of sale price",
    conservation: "Land registry + file fee",
    conservation_sub: "1.5% of price + 150 DH fixed",
    honorarium: "Notary fees",
    honorarium_sub: "Regulated degressive scale",
    tva: "VAT on notary fees",
    tva_sub: "10% of notary fees",
    hypotheque: "Mortgage registration",
    hypotheque_sub: "1% of loan + 150 DH fixed",
    timbre: "Fiscal stamp",
    timbre_sub: "Flat estimate",
    disclaimer: "Indicative estimate. Notary fees follow a regulated degressive scale set by decree. Registration duties may be reduced to 1.5% for certain social housing. Verify with your notary.",
    bank_fees: "Bank processing fee",
    bank_fees_sub: "500–1,500 DH (often negotiable)",
    total_budget: "Total budget needed",
    total_budget_sub: "Price + acquisition fees + bank fees",
  },
  ar: {
    heading: "حاسبة رسوم التوثيق",
    sub: "تقدير رسوم اقتناء العقار بالمغرب (الرسوم، المحافظة، أتعاب الموثق)",
    price_label: "ثمن العقار",
    loan_label: "مبلغ القرض",
    apport: "المساهمة الشخصية",
    mre_note: "بالنسبة <strong>للمغاربة بالخارج</strong>، الحد الأدنى للمساهمة هو <strong>30%</strong> بالعملة الأجنبية (المواد 793-796 مكتب الصرف).",
    total_label: "إجمالي الرسوم المقدرة",
    total_pct: "من ثمن العقار",
    registration: "رسوم التسجيل",
    registration_sub: "4% من ثمن البيع",
    conservation: "المحافظة العقارية + ملف",
    conservation_sub: "1.5% من الثمن + 150 درهم",
    honorarium: "أتعاب الموثق",
    honorarium_sub: "وفق جدول تنازلي منظم",
    tva: "الضريبة على القيمة المضافة",
    tva_sub: "10% من أتعاب الموثق",
    hypotheque: "تسجيل الرهن العقاري",
    hypotheque_sub: "1% من القرض + 150 درهم",
    timbre: "الطابع المالي",
    timbre_sub: "مبلغ جزافي",
    disclaimer: "تقدير استرشادي. أتعاب الموثق تخضع لجدول تنازلي منظم بمرسوم. قد تُخفض رسوم التسجيل إلى 1.5% لبعض السكن الاجتماعي. تحقق مع موثقك.",
    bank_fees: "رسوم ملف البنك",
    bank_fees_sub: "500–1,500 درهم (قابلة للتفاوض)",
    total_budget: "الميزانية الإجمالية المطلوبة",
    total_budget_sub: "الثمن + رسوم الاقتناء + رسوم البنك",
  },
};

interface NotaryFeesCalculatorProps {
  lang?: string;
}

export function NotaryFeesCalculator({ lang = "fr" }: NotaryFeesCalculatorProps) {
  const [price, setPrice] = useState(1_500_000);
  const [loan,  setLoan]  = useState(1_050_000);

  const t = T[lang] ?? T.fr;
  const fmt = (v: number) => formatCurrency(v, "MAD", lang);
  const fees = useMemo(() => {
    const registration  = price * 0.04;
    const conservation  = price * 0.015 + 150;
    const honorarium    = notaryHonorarium(price);
    const tva           = honorarium * 0.10;
    const hypotheque    = loan > 0 ? loan * 0.01 + 150 : 0;
    const timbre        = 200;
    const bankFees      = 1_000;
    const total = registration + conservation + honorarium + tva + hypotheque + timbre;
    const totalBudget = price + total + bankFees;
    return { total, bankFees, totalBudget };
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
                {t.heading}
              </h2>
              <p className="text-xs text-slate-400">
                {t.sub}
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
                <label className="text-sm font-medium text-slate-600">{t.price_label}</label>
                <span className="text-sm font-bold text-amber-600">{fmt(price)}</span>
              </div>
              <div className="relative">
                <div className="absolute top-[8px] left-0 right-0 h-1 rounded-full bg-slate-200 pointer-events-none" />
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
                  aria-label={t.price_label}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 font-medium tabular-nums">
                <span>200K</span><span>10M MAD</span>
              </div>
            </div>

            {/* Loan slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">{t.loan_label}</label>
                <span className="text-sm font-bold text-amber-600">{fmt(loan)}</span>
              </div>
              <div className="relative">
                <div className="absolute top-[8px] left-0 right-0 h-1 rounded-full bg-slate-200 pointer-events-none" />
                <div
                  className="absolute top-[8px] left-0 h-1 rounded-full bg-amber-500 pointer-events-none transition-all"
                  style={{ width: `${(loan / price) * 100}%` }}
                />
                <input
                  type="range" min={0} max={price} step={50_000} value={loan}
                  onChange={(e) => setLoan(+e.target.value)}
                  className="relative w-full"
                  style={{ background: "transparent" }}
                  aria-label={t.loan_label}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-300 font-medium tabular-nums">
                <span>0</span><span>{fmt(price)}</span>
              </div>
            </div>

            {/* Apport card */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-amber-700 font-medium">{t.apport}</span>
                <span className="font-bold text-amber-800">{fmt(apport)} ({((apport / price) * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${(apport / price) * 100}%` }}
                />
              </div>
              {apport / price < 0.30 && (
                <p className="text-[11px] text-amber-700" dangerouslySetInnerHTML={{ __html: t.mre_note }} />
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
                {t.total_label}
              </p>
              <p className="text-4xl font-bold tracking-tight mb-0.5">{fmt(fees.total + fees.bankFees)}</p>
              <p className="text-amber-300 text-xs">≈ {totalPct}% {t.total_pct}</p>
            </div>

            {/* Total budget needed */}
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 mb-4">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                {t.total_budget}
              </p>
              <p className="text-2xl font-bold text-amber-900">{fmt(fees.totalBudget)}</p>
              <p className="text-[10px] text-amber-600 mt-0.5">{t.total_budget_sub}</p>
            </div>

            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed px-1">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
