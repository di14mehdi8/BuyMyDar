"use client";

import { motion } from "framer-motion";
import { ArrowRight, Tag, ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface InsightsGridProps {
  lang: string;
  dict: Dictionary["insights"];
}

const ARTICLES = [
  {
    externalUrl: "https://www.oc.gov.ma/fr/mre/ouverture-de-comptes-en-devisesen-dirhams-convertibles",
    source: "Office des Changes",
    category: "mre",    readMinutes: 8,   emoji: "🏦",
    gradient: "from-brand-600 to-brand-900",
    titleFr: "Comment ouvrir un compte Dirham Convertible depuis la France en 2026",
    titleEn: "How to Open a Convertible Dirham Account from France in 2026",
    titleAr: "كيفية فتح حساب الدرهم القابل للتحويل من فرنسا 2026",
    excerptFr: "Guide complet étape par étape pour les MRE souhaitant financer un bien au Maroc depuis la France, l'Espagne ou le Canada.",
    excerptEn: "Complete step-by-step guide for MREs wishing to finance real estate in Morocco from France, Spain, or Canada.",
    excerptAr: "دليل شامل خطوة بخطوة للمغاربة المقيمين بالخارج الراغبين في تمويل عقار بالمغرب.",
    author: { name: "Office des Changes", role: "Réglementation officielle" },
    date: "2026-03-28",
  },
  {
    externalUrl: "https://immobilier.creditdumaroc.ma/fr/taux-dinterets-fixe-ou-variable",
    source: "Crédit du Maroc",
    category: "rates",  readMinutes: 5,   emoji: "📈",
    gradient: "from-amber-500 to-orange-700",
    titleFr: "Taux fixe vs variable au Maroc : que choisir en 2026 ?",
    titleEn: "Fixed vs Variable Rate in Morocco: What to Choose in 2026?",
    titleAr: "المعدل الثابت مقابل المتغير بالمغرب: ماذا تختار في 2026؟",
    excerptFr: "Comparaison des avantages de chaque type avec les indices de référence BAM (BDT et TMP) pour la révision des taux variables.",
    excerptEn: "Comparison of each rate type's advantages with BAM reference indices (BDT and TMP) for variable rate revisions.",
    excerptAr: "مقارنة مزايا كل نوع مع مؤشرات بنك المغرب المرجعية لمراجعة المعدلات المتغيرة.",
    author: { name: "Crédit du Maroc", role: "Banque officielle" },
    date: "2026-03-20",
  },
  {
    externalUrl: "https://www.oc.gov.ma/fr/mre/credits-pour-lacquisition-ou-la-construction-de-biens-immeubles",
    source: "Office des Changes",
    category: "mre",    readMinutes: 6,   emoji: "📋",
    gradient: "from-emerald-500 to-green-700",
    titleFr: "Dossier de crédit MRE : conditions réglementaires complètes",
    titleEn: "MRE Credit File: Full Regulatory Conditions",
    titleAr: "ملف قرض المغاربة بالخارج: الشروط التنظيمية الكاملة",
    excerptFr: "Apport minimum 30% en devises, garanties requises et obligations déclaratives selon les articles 793–796 de la réglementation des changes.",
    excerptEn: "Minimum 30% foreign-currency down payment, required guarantees and reporting obligations per articles 793–796 of exchange regulations.",
    excerptAr: "حد أدنى 30% مساهمة بالعملة الأجنبية، والضمانات المطلوبة وفق المواد 793-796 من لوائح الصرف.",
    author: { name: "Office des Changes", role: "Réglementation officielle" },
    date: "2026-03-15",
  },
  {
    externalUrl: "https://immobilier.creditdumaroc.ma/fr/racheter-un-cr%C3%A9dit",
    source: "Crédit du Maroc",
    category: "guide",  readMinutes: 7,   emoji: "🔄",
    gradient: "from-violet-500 to-purple-800",
    titleFr: "Rachat de crédit immobilier au Maroc : est-ce rentable ?",
    titleEn: "Mortgage Refinancing in Morocco: Is it Worth It?",
    titleAr: "إعادة شراء القرض العقاري بالمغرب: هل هو مربح؟",
    excerptFr: "Processus en 4 étapes, délai de réflexion légal de 10 jours et calcul du gain financier selon les conditions actuelles du marché.",
    excerptEn: "4-step process, 10-day legal cooling-off period and financial gain calculation based on current market conditions.",
    excerptAr: "عملية من 4 خطوات، مهلة قانونية للتفكير 10 أيام وحساب المكسب المالي وفق أحدث أسعار السوق.",
    author: { name: "Crédit du Maroc", role: "Banque officielle" },
    date: "2026-03-10",
  },
  {
    externalUrl: "https://www.bkam.ma/Marches/Taux-d-interet/Reference-pour-la-revision-des-taux-variables",
    source: "Bank Al-Maghrib",
    category: "rates",  readMinutes: 4,   emoji: "💰",
    gradient: "from-rose-500 to-pink-700",
    titleFr: "Taux de référence BAM pour la révision des crédits variables",
    titleEn: "BAM Reference Rates for Variable Mortgage Revision",
    titleAr: "معدلات مرجعية لبنك المغرب لمراجعة القروض المتغيرة",
    excerptFr: "Indices BDT et TMP publiés mensuellement par Bank Al-Maghrib. La source officielle utilisée par toutes les banques marocaines pour réviser vos mensualités.",
    excerptEn: "BDT and TMP indices published monthly by Bank Al-Maghrib. The official source used by all Moroccan banks to revise variable mortgage payments.",
    excerptAr: "مؤشرات BDT وTMP التي ينشرها بنك المغرب شهريًا. المصدر الرسمي الذي تستخدمه جميع البنوك المغربية لمراجعة الأقساط.",
    author: { name: "Bank Al-Maghrib", role: "Banque Centrale du Maroc" },
    date: "2026-03-05",
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  guide:  "badge-blue",
  news:   "badge-amber",
  mre:    "badge-green",
  rates:  "badge-purple",
};

export function InsightsGrid({ lang, dict }: InsightsGridProps) {
  const loc = lang as "fr" | "en" | "ar";
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const T = (a: typeof ARTICLES[0]) =>
    (a[`title${cap(loc)}` as keyof typeof a] as string) ?? a.titleFr;
  const X = (a: typeof ARTICLES[0]) =>
    (a[`excerpt${cap(loc)}` as keyof typeof a] as string) ?? a.excerptFr;

  const [featured, ...rest] = ARTICLES;

  return (
    <section id="insights" className="scroll-mt-28" aria-labelledby="insights-heading">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <p className="section-label mb-2">
            <span className="w-4 h-px bg-brand-600 inline-block" /> Ressources
          </p>
          <h2 id="insights-heading" className="heading-2">{dict.title}</h2>
          <p className="text-slate-500 text-sm mt-1">{dict.subtitle}</p>
        </div>
        <a
          href="https://www.bkam.ma/Publications-et-statistiques/Publications-institutionnelles"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors whitespace-nowrap"
        >
          Publications BAM <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Featured — 2 cols tall */}
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="md:col-span-2 relative overflow-hidden rounded-2xl min-h-[340px] group cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient}`} />
          <div className="absolute inset-0 bg-black/25" />
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
               style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

          <div className="relative h-full p-7 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className={cn("px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                "bg-white/20 text-white backdrop-blur-sm")}>
                {dict.categories[featured.category as keyof typeof dict.categories]}
              </span>
              <span className="text-4xl drop-shadow-md" aria-hidden>{featured.emoji}</span>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3
                             group-hover:underline decoration-white/40 underline-offset-2">
                {T(featured)}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed mb-5 line-clamp-2">
                {X(featured)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div>
                    <p className="text-white text-xs font-semibold">{featured.author.name}</p>
                    <p className="text-white/55 text-[10px]">{featured.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <ExternalLink className="w-3 h-3" />
                  {featured.source}
                </div>
              </div>
            </div>
          </div>
          <a href={featured.externalUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={T(featured)} />
        </motion.article>

        {/* Remaining articles */}
        {rest.map((article, i) => (
          <motion.article
            key={article.externalUrl}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="card card-hover p-5 group relative flex flex-col justify-between min-h-[168px]"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className={cn(CATEGORY_STYLES[article.category] ?? "badge-slate", "text-[10px]")}>
                  <Tag className="w-2.5 h-2.5" />
                  {dict.categories[article.category as keyof typeof dict.categories]}
                </span>
                <span className="text-xl" aria-hidden>{article.emoji}</span>
              </div>
              <h3 className="font-semibold text-slate-900 leading-snug mb-1.5
                             group-hover:text-brand-600 transition-colors text-sm line-clamp-2">
                {T(article)}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{X(article)}</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
              <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                <ExternalLink className="w-3 h-3" />{article.source}
              </span>
              <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-0.5
                               group-hover:gap-1.5 transition-all">
                {dict.read_more} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <a href={article.externalUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={T(article)} />
          </motion.article>
        ))}

        {/* Inline ad slot */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="ad-slot"
          aria-hidden="true"
          role="presentation"
        >
          <div className="text-center space-y-1.5">
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Publicité</p>
            <div className="w-28 h-12 bg-slate-100 rounded-xl mx-auto" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
