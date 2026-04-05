import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Home } from "lucide-react";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr"
      ? "MRE — Financer un bien immobilier au Maroc depuis l'étranger — BuyMyDar"
      : "MRE — Finance Property in Morocco from Abroad — BuyMyDar",
    description:
      "Guides pays par pays pour les Marocains Résidant à l'Étranger : France, Espagne, Canada, Belgique, Italie.",
  };
}

const COUNTRIES = [
  {
    slug: "france",
    flag: "🇫🇷",
    name: "France",
    headline: "MRE en France — Financer au Maroc",
    summary: "~1,8M de Marocains en France. Salaires en €, virements SWIFT/Transferwise, banques partenaires Attijari/BCP Europe.",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    slug: "espagne",
    flag: "🇪🇸",
    name: "Espagne",
    headline: "MRE en Espagne — Financer au Maroc",
    summary: "~800K de Marocains en Espagne. Proximité géographique, virements SEPA, documentación en español.",
    gradient: "from-red-600 to-orange-600",
  },
  {
    slug: "canada",
    flag: "🇨🇦",
    name: "Canada",
    headline: "MRE au Canada — Financer au Maroc",
    summary: "~100K Marocains au Canada. Salaires en CAD, transferts internationaux, taux de change favorable.",
    gradient: "from-red-700 to-rose-800",
  },
  {
    slug: "belgique",
    flag: "🇧🇪",
    name: "Belgique",
    headline: "MRE en Belgique — Financer au Maroc",
    summary: "~400K Marocains en Belgique. Revenus en €, accès Attijariwafa Europe et CIH.",
    gradient: "from-yellow-600 to-amber-700",
  },
  {
    slug: "italie",
    flag: "🇮🇹",
    name: "Italie",
    headline: "MRE en Italie — Financer au Maroc",
    summary: "~400K Marocains en Italie. Dossier bilingue français/italien, virements SEPA.",
    gradient: "from-green-600 to-teal-700",
  },
  {
    slug: "pays-bas",
    flag: "🇳🇱",
    name: "Pays-Bas",
    headline: "MRE aux Pays-Bas — Financer au Maroc",
    summary: "Forte communauté marocaine aux Pays-Bas. Revenus en €, accès aux banques pan-européennes.",
    gradient: "from-orange-500 to-red-600",
  },
];

export default async function MREIndexPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  if (!locales.includes(lang)) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          {lang === "ar" ? "الرئيسية" : lang === "en" ? "Home" : "Accueil"}
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">
          {lang === "ar" ? "أدلة المغاربة بالخارج" : lang === "en" ? "MRE Guides" : "Guides MRE"}
        </span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <p className="section-label">
          {lang === "ar" ? "المغاربة المقيمون بالخارج" : lang === "en" ? "Moroccans Residing Abroad" : "Marocains Résidant à l'Étranger"}
        </p>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        {lang === "ar"
          ? "تمويل عقار في المغرب من الخارج"
          : lang === "en"
          ? "Finance Property in Morocco from Abroad"
          : "Financer un bien au Maroc depuis l'étranger"}
      </h1>
      <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-2xl">
        {lang === "ar"
          ? "أدلة مخصصة حسب بلد الإقامة — الوثائق المطلوبة، البنوك الشريكة، تحويل الأموال والشروط التنظيمية."
          : lang === "en"
          ? "Country-specific guides — required documents, partner banks, fund transfers, and regulatory requirements from the Office des Changes."
          : "Guides spécifiques par pays de résidence — documents requis, banques partenaires, transferts de fonds et conditions réglementaires de l'Office des Changes."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COUNTRIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${lang}/mre/${c.slug}`}
            className="group card card-hover p-6 flex items-start gap-4"
          >
            <span className="text-3xl">{c.flag}</span>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
                {c.headline}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">{c.summary}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 shrink-0 mt-1 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Common info */}
      <div className="mt-10 rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
        <h2 className="font-bold text-emerald-900 mb-3">Règles communes à tous les MRE</h2>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span><strong>Apport minimum 30%</strong> versé en devises étrangères (art. 793–796 Office des Changes)</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span><strong>Durée jusqu'à 30 ans</strong> pour certaines banques (Attijariwafa, BCP, CIH)</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span><strong>Taux d'effort ≤ 40%</strong> calculé sur le revenu net étranger converti en MAD</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span><strong>Compte en Dirhams Convertibles</strong> (CDC) ou DAE requis pour les remboursements</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span><strong>Daam Sakane éligible</strong> pour les MRE qui s'engagent à résider dans le bien 5 ans</span>
          </li>
        </ul>
      </div>
    </main>
  );
}
