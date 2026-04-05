import { notFound } from "next/navigation";
import { locales, type Locale, hreflangMap } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, CheckCircle2, Info, ExternalLink } from "lucide-react";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hreflangAlternates: Record<string, string> = {};
  for (const [locale, tags] of Object.entries(hreflangMap)) {
    for (const tag of tags) {
      hreflangAlternates[tag] = `https://buymydar.com/${locale}/mourabaha`;
    }
  }
  hreflangAlternates["x-default"] = "https://buymydar.com/fr/mourabaha";
  return {
    title: lang === "fr"
      ? "Financement Mourabaha au Maroc — Crédit immobilier islamique — BuyMyDar"
      : "Mourabaha Financing in Morocco — Islamic Home Finance — BuyMyDar",
    description:
      "Comprendre le financement Mourabaha au Maroc : principe, calcul, banques éligibles (Dar Assafaa, CIH, BMCI) et comparaison avec le crédit classique.",
    alternates: {
      canonical: `https://buymydar.com/${lang}/mourabaha`,
      languages: hreflangAlternates,
    },
  };
}

const BANKS = [
  {
    name: "Dar Assafaa",
    parent: "Filiale d'Attijariwafa Bank",
    note: "Banque participative dédiée — gamme complète Mourabaha, Ijara, Musharaka",
    url: "https://www.darassafaa.ma",
    color: "#006233",
  },
  {
    name: "Al Akhdar Bank",
    parent: "Filiale de Crédit Agricole du Maroc",
    note: "Finance participative — Mourabaha immobilier, Ijara",
    url: "https://www.alakhdarbank.ma",
    color: "#2d8c3e",
  },
  {
    name: "Umnia Bank",
    parent: "Filiale de CIH Bank",
    note: "Banque participative — Mourabaha et Ijara pour l'immobilier",
    url: "https://www.umniabank.ma",
    color: "#e63329",
  },
  {
    name: "Bank Assafa",
    parent: "Filiale de Société Générale / Saham",
    note: "Mourabaha immobilier résidents — produits conformes charia",
    url: "https://www.bankassafa.ma",
    color: "#D2232A",
  },
];

export default async function MourabahaPage({ params }: Props) {
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
          {lang === "ar" ? "تمويل المرابحة" : lang === "en" ? "Mourabaha Financing" : "Financement Mourabaha"}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-3">
          <span className="w-4 h-px bg-emerald-600 inline-block" />
          {lang === "ar" ? "التمويل الإسلامي" : lang === "en" ? "Islamic Finance" : "Finance participative"}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {lang === "ar"
            ? "تمويل المرابحة في المغرب"
            : lang === "en"
            ? "Mourabaha Financing in Morocco"
            : "Financement Mourabaha au Maroc"}
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
          {lang === "ar"
            ? "بديل للقرض العقاري الكلاسيكي وفق مبادئ التمويل الإسلامي — بدون فوائد، مع هامش ربح محدد مسبقاً."
            : lang === "en"
            ? "An alternative to the classic mortgage, compliant with Islamic finance principles — no interest, with a profit margin set upfront."
            : "Une alternative au crédit immobilier classique conforme aux principes de la finance islamique — sans intérêts, avec une marge bénéficiaire fixée à l'avance."}
        </p>
      </div>

      {/* Principle */}
      <div className="card p-6 mb-8">
        <h2 className="font-bold text-slate-900 text-lg mb-4">Comment fonctionne la Mourabaha ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { step: "1", label: "La banque achète le bien", detail: "La banque participative acquiert le bien immobilier directement auprès du vendeur à votre place." },
            { step: "2", label: "Revente à votre profit", detail: "La banque vous revend le bien à un prix majoré d'une marge bénéficiaire (ribh) fixée contractuellement." },
            { step: "3", label: "Remboursement échelonné", detail: "Vous remboursez le prix majoré en mensualités fixes sur la durée convenue — sans aucun intérêt." },
          ].map(({ step, label, detail }) => (
            <div key={step} className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <span className="text-white font-bold text-sm">{step}</span>
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Exemple :</strong> Pour un bien à 1 500 000 DH avec une marge de 20%
          sur 20 ans — la banque vous revend le bien à 1 800 000 DH. La mensualité est de{" "}
          <strong>7 500 DH/mois</strong>, fixe sur toute la durée, sans révision ni indexation.
        </div>
      </div>

      {/* Comparison */}
      <div className="card overflow-hidden mb-8">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Mourabaha vs Crédit classique</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-4 text-start text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critère</th>
                <th className="py-3 px-4 text-start text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Mourabaha</th>
                <th className="py-3 px-4 text-start text-[11px] font-bold text-brand-600 uppercase tracking-wider">Crédit classique</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Base de calcul", "Marge bénéficiaire (ribh) fixe", "Taux d'intérêt annuel"],
                ["Mensualité", "Fixe sur toute la durée", "Fixe (taux fixe) ou révisable (variable)"],
                ["Révision possible", "Non — prix contractuel immuable", "Oui (si taux variable)"],
                ["Remboursement anticipé", "Généralement sans pénalité", "IRA : min(3% capital, 6 mois intérêts)"],
                ["Applicable aux MRE", "Non — résidents Maroc uniquement*", "Oui — toutes banques MRE éligibles"],
                ["Banques proposantes", "Dar Assafaa, Umnia, Al Akhdar, Bank Assafa", "Attijariwafa, BCP, CIH, BMCI, BOA, CDM, CFG, Saham"],
                ["Coût total estimé", "Variable selon marge (15–25%)", "Variable selon taux (4,45%–4,90% en 2026)"],
              ].map(([crit, mou, cla], i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700">{crit}</td>
                  <td className="py-3 px-4 text-emerald-700">{mou}</td>
                  <td className="py-3 px-4 text-brand-700">{cla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
          <p className="text-[11px] text-amber-700">
            * La Mourabaha est réservée aux résidents marocains. Les MRE (non-résidents) ne peuvent pas accéder aux
            banques participatives selon la réglementation actuelle de Bank Al-Maghrib (Circulaire n°1/W/2017).
          </p>
        </div>
      </div>

      {/* Banks */}
      <div className="mb-8">
        <h2 className="font-bold text-slate-900 text-lg mb-4">Banques participatives au Maroc</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BANKS.map((bank) => (
            <a
              key={bank.name}
              href={bank.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover p-5 group flex items-start justify-between gap-3"
            >
              <div>
                <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{bank.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{bank.parent}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{bank.note}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-brand-500 shrink-0 mt-1 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Eligibility */}
      <div className="card p-6 mb-8">
        <h2 className="font-bold text-slate-900 text-lg mb-4">Conditions d'éligibilité</h2>
        <ul className="space-y-2.5">
          {[
            "Être résident marocain (ou en cours de régularisation de résidence)",
            "Apport personnel : généralement 20–30% du prix du bien",
            "Taux d'effort ≤ 40% du revenu mensuel net",
            "Le bien doit être à usage d'habitation principale (ou investissement locatif selon la banque)",
            "Documents requis identiques au crédit classique + attestation de conformité charia délivrée par le Conseil Supérieur des Oulémas",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-5 mb-8">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Supervision réglementaire</p>
          <p className="leading-relaxed">
            Les banques participatives au Maroc sont régulées par Bank Al-Maghrib et supervisées par
            le <strong>Conseil Supérieur des Oulémas</strong> (CSO) qui certifie la conformité charia
            de chaque produit. Chaque contrat Mourabaha doit obtenir une fatwa du CSO avant commercialisation.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/${lang}#simulator`}
          className="rounded-2xl p-6 text-white text-center"
          style={{ background: "linear-gradient(135deg,#1E3A6E 0%,#0F2040 100%)" }}
        >
          <p className="font-bold mb-1">Comparer les taux classiques</p>
          <p className="text-blue-200 text-xs mb-3">Simulez votre crédit immobilier standard</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            Simuler <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        <a
          href="https://www.darassafaa.ma"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl p-6 text-white text-center"
          style={{ background: "linear-gradient(135deg,#059669 0%,#065f46 100%)" }}
        >
          <p className="font-bold mb-1">Simuler une Mourabaha</p>
          <p className="text-emerald-200 text-xs mb-3">Outil officiel Dar Assafaa</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            Dar Assafaa <ExternalLink className="w-4 h-4" />
          </span>
        </a>
      </div>
    </main>
  );
}
