"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, User, Tag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface InsightsGridProps {
  lang: string;
  dict: Dictionary["insights"];
}

const ARTICLES = [
  {
    slug: "ouvrir-compte-dirham-convertible-depuis-france",
    category: "mre",    readMinutes: 8,   emoji: "🏦",
    gradient: "from-brand-600 to-brand-900",
    titleFr: "Comment ouvrir un compte Dirham Convertible depuis la France en 2026",
    titleEn: "How to Open a Convertible Dirham Account from France in 2026",
    titleAr: "كيفية فتح حساب الدرهم القابل للتحويل من فرنسا 2026",
    excerptFr: "Guide complet étape par étape pour les MRE souhaitant financer un bien au Maroc depuis la France, l'Espagne ou le Canada.",
    excerptEn: "Complete step-by-step guide for MREs wishing to finance real estate in Morocco from France, Spain, or Canada.",
    excerptAr: "دليل شامل خطوة بخطوة للمغاربة المقيمين بالخارج الراغبين في تمويل عقار بالمغرب.",
    author: { name: "Yassine Benali", role: "Expert Crédit, Casablanca" },
    date: "2026-03-28",
  },
  {
    slug: "taux-fixe-vs-variable-maroc-2026",
    category: "rates",  readMinutes: 5,   emoji: "📈",
    gradient: "from-amber-500 to-orange-700",
    titleFr: "Taux fixe vs variable au Maroc : que choisir en 2026 ?",
    titleEn: "Fixed vs Variable Rate in Morocco: What to Choose in 2026?",
    titleAr: "المعدل الثابت مقابل المتغير بالمغرب: ماذا تختار في 2026؟",
    excerptFr: "Analyse des avantages de chaque type avec les projections BAM 2026-2028.",
    excerptEn: "Analysis of each rate type's advantages with BAM projections 2026-2028.",
    excerptAr: "تحليل مزايا كل نوع مع توقعات بنك المغرب 2026-2028.",
    author: { name: "Karima Tahiri", role: "Analyste, Rabat" },
    date: "2026-03-20",
  },
  {
    slug: "dossier-credit-mre-documents-2026",
    category: "mre",    readMinutes: 6,   emoji: "📋",
    gradient: "from-emerald-500 to-green-700",
    titleFr: "Dossier de crédit MRE : liste complète des documents",
    titleEn: "MRE Credit File: Complete Document Checklist",
    titleAr: "ملف قرض المغاربة بالخارج: قائمة كاملة بالوثائق",
    excerptFr: "Liste exhaustive des documents requis et astuces pour accélérer le traitement.",
    excerptEn: "Exhaustive document list with tips to speed up bank processing.",
    excerptAr: "قائمة شاملة بالوثائق مع نصائح لتسريع المعالجة.",
    author: { name: "Yassine Benali", role: "Expert Crédit, Casablanca" },
    date: "2026-03-15",
  },
  {
    slug: "rachat-credit-immobilier-maroc-guide",
    category: "guide",  readMinutes: 7,   emoji: "🔄",
    gradient: "from-violet-500 to-purple-800",
    titleFr: "Rachat de crédit immobilier au Maroc : est-ce rentable ?",
    titleEn: "Mortgage Refinancing in Morocco: Is it Worth It?",
    titleAr: "إعادة شراء القرض العقاري بالمغرب: هل هو مربح؟",
    excerptFr: "Comment calculer le gain d'un rachat de crédit et quelles banques proposent les meilleures conditions.",
    excerptEn: "How to calculate refinancing gains and which banks offer the best conditions.",
    excerptAr: "كيف تحسب ربح إعادة الشراء وأي البنوك تقدم أفضل الشروط.",
    author: { name: "Mohammed Benkirane", role: "Courtier, Marrakech" },
    date: "2026-03-10",
  },
  {
    slug: "combien-emprunter-salaire-3000-euros",
    category: "guide",  readMinutes: 4,   emoji: "💰",
    gradient: "from-rose-500 to-pink-700",
    titleFr: "Combien puis-je emprunter avec un salaire de 3 000 € ?",
    titleEn: "How Much Can I Borrow in Morocco with a 3,000 € Salary?",
    titleAr: "كم يمكنني اقتراضه براتب 3000 يورو؟",
    excerptFr: "Calcul DTI pour un salarié MRE avec simulation sur 15, 20 et 25 ans.",
    excerptEn: "DTI calculation for MRE employees with 15, 20 and 25-year simulations.",
    excerptAr: "حساب DTI لموظف مغربي بالخارج مع محاكاة لـ 15 و20 و25 سنة.",
    author: { name: "Karima Tahiri", role: "Analyste, Rabat" },
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
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors whitespace-nowrap"
        >
          Tous les articles <ArrowRight className="w-4 h-4" />
        </Link>
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
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{featured.author.name}</p>
                    <p className="text-white/55 text-[10px]">{featured.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readMinutes} {dict.min_read}
                </div>
              </div>
            </div>
          </div>
          <Link href={`/${lang}/blog/${featured.slug}`} className="absolute inset-0" aria-label={T(featured)} />
        </motion.article>

        {/* Remaining articles */}
        {rest.map((article, i) => (
          <motion.article
            key={article.slug}
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
                <Clock className="w-3 h-3" />{article.readMinutes} {dict.min_read}
              </span>
              <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-0.5
                               group-hover:gap-1.5 transition-all">
                {dict.read_more} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <Link href={`/${lang}/blog/${article.slug}`} className="absolute inset-0" aria-label={T(article)} />
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
