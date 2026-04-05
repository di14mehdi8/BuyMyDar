import { notFound } from "next/navigation";
import { locales, type Locale, hreflangMap } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { BANK_RATES } from "@/lib/mortgage/calculator";

type Props = { params: Promise<{ lang: string; country: string }> };

interface CountryData {
  flag: string;
  name: string;
  population: string;
  currency: string;
  eurRate?: string;
  banks: string[];          // which Moroccan banks have branches / desks there
  incomeDocsFr: string[];
  transferFr: string[];
  tipsFr: string[];
  partnerBanksFr: string;
  externalUrl?: string;
}

const COUNTRY_DATA: Record<string, CountryData> = {
  france: {
    flag: "🇫🇷",
    name: "France",
    population: "~1,8 million de Marocains",
    currency: "EUR",
    banks: ["attijariwafa", "bcp", "cih", "bmci"],
    incomeDocsFr: [
      "3 derniers bulletins de salaire (fiche de paie) — originaux ou copies certifiées",
      "Contrat de travail CDI ou attestation d'emploi récente",
      "Avis d'imposition français (2 derniers)",
      "6 derniers relevés de compte bancaire français (RIB + extraits)",
      "Relevé de Situation Individuelle (RSI) de la retraite Assurance Retraite si retraité",
    ],
    transferFr: [
      "Virement SEPA depuis votre banque française vers votre compte CDC ou DAE au Maroc",
      "Plateformes : Wise (TransferWise), Western Union Business, ou virement bancaire direct",
      "Délai : 1–3 jours ouvrés pour les virements SEPA vers le Maroc",
      "Conservez tous les justificatifs de transfert sur 12 mois (requis par la banque marocaine)",
      "Attijariwafa Europe et Chaabi Bank (BCP) ont des agences en France facilitant la coordination",
    ],
    tipsFr: [
      "Attijariwafa Europe (Paris, Lyon, Marseille) peut co-instruire votre dossier avec la banque mère au Maroc.",
      "Chaabi Bank (filiale BCP, présente dans 9 villes françaises) permet de déposer le dossier directement en France.",
      "La BMCI (filiale BNP Paribas) facilite la coordination entre votre banque BNP française et la BMCI Maroc.",
      "Le consulat du Maroc en France peut légaliser vos documents si nécessaire (évitez la légalisation — préférez l'apostille).",
      "Si vous percevez un salaire de fonctionnaire français, les banques marocaines l'acceptent généralement sans exiger de CDI.",
    ],
    partnerBanksFr: "Attijariwafa Europe, Chaabi Bank (BCP), BMCI (BNP Paribas)",
    externalUrl: "https://www.oc.gov.ma/fr/mre/ouverture-de-comptes-en-devisesen-dirhams-convertibles",
  },
  espagne: {
    flag: "🇪🇸",
    name: "Espagne",
    population: "~800 000 Marocains",
    currency: "EUR",
    banks: ["attijariwafa", "bcp"],
    incomeDocsFr: [
      "3 dernières nóminas (bulletins de salaire) — originaux",
      "Contrat de travail (contrato indefinido ou temporal avec ancienneté)",
      "Déclaration IRPF (impôt sur le revenu espagnol) — 2 dernières années",
      "6 derniers relevés bancaires espagnols",
      "NIE (Número de Identificación de Extranjeros) — obligatoire",
      "Tarjeta de residencia en vigueur",
    ],
    transferFr: [
      "Virement SEPA vers compte CDC ou DAE au Maroc",
      "Wise, Western Union, ou virement bancaire direct (délai 1–3 jours)",
      "Conservez les justificatifs de transfert sur 12 mois",
    ],
    tipsFr: [
      "La proximité géographique (Tanger–Algésiras) facilite les visites de biens et les rendez-vous bancaires.",
      "Attijariwafa dispose d'une représentation en Espagne pour orienter les MRE.",
      "Les bulletins de salaire espagnols peuvent être soumis directement en espagnol — certaines banques marocaines les acceptent sans traduction.",
      "Pensez à déclarer le bien au Trésor espagnol (Modelo 720) si sa valeur dépasse 50 000 €.",
    ],
    partnerBanksFr: "Attijariwafa, BCP",
    externalUrl: "https://www.oc.gov.ma/fr/mre/credits-pour-lacquisition-ou-la-construction-de-biens-immeubles",
  },
  canada: {
    flag: "🇨🇦",
    name: "Canada",
    population: "~100 000 Marocains",
    currency: "CAD",
    banks: ["attijariwafa", "bcp", "cih"],
    incomeDocsFr: [
      "3 derniers talons de paie (pay stubs) — originaux ou copies",
      "Lettre d'emploi récente (employment letter) sur papier à en-tête de l'employeur",
      "T4 (relevé d'emploi) ou T1 General (déclaration de revenus) — 2 dernières années",
      "6 derniers relevés bancaires canadiens (CAD)",
      "Permis de résidence permanente ou visa travail en cours de validité",
      "SIN (Social Insurance Number) — pour les documents fiscaux",
    ],
    transferFr: [
      "Wise (TransferWise) — meilleur taux CAD/MAD, délai 2–4 jours",
      "Western Union Business ou virement bancaire direct SWIFT",
      "Taux de change : 1 CAD ≈ 5,3 MAD (variable selon marché)",
      "Conservez les justificatifs de transfert — les banques marocaines vérifient l'origine des fonds",
    ],
    tipsFr: [
      "Le décalage horaire (6–9h selon province) peut compliquer les rendez-vous téléphoniques avec les banques marocaines — préférez les communications par email.",
      "Les banques marocaines convertissent les revenus en CAD en MAD au taux officiel BAM pour calculer le taux d'effort.",
      "CIH Bank offre des conditions MRE compétitives et accepte les dossiers de MRE canadiens.",
      "Les documents canadiens en anglais sont généralement acceptés tels quels par les banques marocaines — une traduction assermentée en français est parfois demandée.",
    ],
    partnerBanksFr: "Attijariwafa, BCP, CIH",
    externalUrl: "https://www.oc.gov.ma/fr/mre/credits-pour-lacquisition-ou-la-construction-de-biens-immeubles",
  },
  belgique: {
    flag: "🇧🇪",
    name: "Belgique",
    population: "~400 000 Marocains",
    currency: "EUR",
    banks: ["attijariwafa", "bcp", "cih"],
    incomeDocsFr: [
      "3 dernières fiches de paie — originaux",
      "Contrat de travail (CDI ou équivalent belge)",
      "Déclaration d'impôts belge (Avertissement-Extrait de Rôle) — 2 dernières années",
      "6 derniers relevés de compte bancaire belge",
      "Carte d'identité étrangère (eID) ou titre de séjour en cours de validité",
      "Attestation ONSS (sécurité sociale belge) si indépendant",
    ],
    transferFr: [
      "Virement SEPA vers compte CDC ou DAE (délai 1–2 jours ouvrés)",
      "Wise, BNP Paribas Fortis, ou ING Belgique offrent de bons taux EUR/MAD",
      "Conservez les preuves de transfert (extraits bancaires) sur 12 mois",
    ],
    tipsFr: [
      "Attijariwafa Europe a une représentation accessible depuis la Belgique.",
      "Les revenus en EUR sont bien acceptés par toutes les banques marocaines — le dossier est souvent plus simple qu'avec des revenus hors-zone euro.",
      "La Belgique est un pays francophone : les documents ne nécessitent pas de traduction pour les banques marocaines francophones.",
    ],
    partnerBanksFr: "Attijariwafa, BCP, CIH",
    externalUrl: "https://www.oc.gov.ma/fr/mre/ouverture-de-comptes-en-devisesen-dirhams-convertibles",
  },
  italie: {
    flag: "🇮🇹",
    name: "Italie",
    population: "~400 000 Marocains",
    currency: "EUR",
    banks: ["attijariwafa", "bcp"],
    incomeDocsFr: [
      "3 dernières buste paga (bulletins de salaire) — originaux",
      "Contratto di lavoro (contrat de travail) — CDI ou CDD long terme",
      "Dichiarazione dei redditi (730 ou Unico) — 2 dernières années",
      "6 derniers relevés bancaires italiens",
      "Permesso di soggiorno (titre de séjour) en cours de validité",
      "Codice fiscale (équivalent du NIE espagnol)",
    ],
    transferFr: [
      "Virement SEPA EUR/MAD — délai 1–3 jours",
      "Wise ou Western Union pour de meilleures conditions",
      "Conservez les justificatifs de transfert sur 12 mois",
    ],
    tipsFr: [
      "Les bulletins de salaire italiens sont souvent acceptés en langue originale par les banques marocaines.",
      "Vérifiez si une traduction assermentée (en français ou arabe) est demandée par votre banque au cas par cas.",
      "BCP (Banque Populaire) dispose de correspondants en Italie pour la communauté marocaine.",
    ],
    partnerBanksFr: "Attijariwafa, BCP",
    externalUrl: "https://www.oc.gov.ma/fr/mre/credits-pour-lacquisition-ou-la-construction-de-biens-immeubles",
  },
  "pays-bas": {
    flag: "🇳🇱",
    name: "Pays-Bas",
    population: "~400 000 Marocains",
    currency: "EUR",
    banks: ["attijariwafa", "bcp"],
    incomeDocsFr: [
      "3 derniers loonstroken (bulletins de salaire) — originaux",
      "Arbeidscontract (contrat de travail) — CDI ou contract onbepaalde tijd",
      "Jaaropgave (relevé annuel fiscal) — 2 dernières années",
      "6 derniers relevés bancaires néerlandais",
      "Verblijfsvergunning (titre de séjour) en cours de validité",
      "BSN (Burgerservicenummer) — numéro d'identification fiscale",
    ],
    transferFr: [
      "Virement SEPA EUR/MAD depuis ING, Rabobank, ABN AMRO",
      "Wise pour de meilleures conditions de change",
      "Conservez les justificatifs de transfert sur 12 mois",
    ],
    tipsFr: [
      "Les documents néerlandais sont généralement acceptés en anglais (langue de travail courante aux Pays-Bas).",
      "Attijariwafa et BCP orientent les MRE néerlandais vers leurs antennes ou partenaires européens.",
      "Le taux de change EUR/MAD est favorable : 1€ ≈ 10,8 MAD (avril 2026).",
    ],
    partnerBanksFr: "Attijariwafa, BCP",
    externalUrl: "https://www.oc.gov.ma/fr/mre/ouverture-de-comptes-en-devisesen-dirhams-convertibles",
  },
};

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    Object.keys(COUNTRY_DATA).map((country) => ({ lang, country }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, country } = await params;
  const data = COUNTRY_DATA[country];
  if (!data) return {};
  const hreflangAlternates: Record<string, string> = {};
  for (const [locale, tags] of Object.entries(hreflangMap)) {
    for (const tag of tags) {
      hreflangAlternates[tag] = `https://buymydar.com/${locale}/mre/${country}`;
    }
  }
  hreflangAlternates["x-default"] = `https://buymydar.com/fr/mre/${country}`;
  return {
    title: `MRE ${data.name} — Crédit immobilier Maroc — BuyMyDar`,
    description: `Guide complet pour les MRE résidant en ${data.name} : documents requis, transferts, banques partenaires et taux immobiliers Maroc.`,
    alternates: {
      canonical: `https://buymydar.com/${lang}/mre/${country}`,
      languages: hreflangAlternates,
    },
  };
}

export default async function MRECountryPage({ params }: Props) {
  const { lang: rawLang, country } = await params;
  const lang = rawLang as Locale;
  if (!locales.includes(lang)) notFound();

  const data = COUNTRY_DATA[country];
  if (!data) notFound();

  const mreBanks = BANK_RATES.filter((b) => b.mreEligible && data.banks.includes(b.id));
  const bestRate = Math.min(...mreBanks.map((b) => b.fixedRate));

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" /> Accueil
        </Link>
        <span>/</span>
        <Link href={`/${lang}/mre`} className="hover:text-brand-600 transition-colors">Guides MRE</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{data.name}</span>
      </nav>

      {/* Hero */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl">{data.flag}</span>
        <div>
          <p className="section-label mb-1"><span className="w-4 h-px bg-brand-600 inline-block" /> {data.population}</p>
          <h1 className="text-3xl font-bold text-slate-900">MRE {data.name} — Crédit immobilier Maroc</h1>
        </div>
      </div>

      {/* Banks with MRE presence */}
      {mreBanks.length > 0 && (
        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-5 mb-8">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
            Banques marocaines recommandées pour la {data.name}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mreBanks.map((bank) => (
              <a
                key={bank.id}
                href={bank.applyUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-brand-100 hover:border-brand-300 transition-colors group"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{bank.name}</p>
                  <p className="text-xs text-slate-400">
                    Taux fixe : <strong className={bank.fixedRate === bestRate ? "text-emerald-600" : "text-slate-700"}>
                      {(bank.fixedRate * 100).toFixed(2)}%
                    </strong>
                    {bank.maxDurationMREYears && ` · ${bank.maxDurationMREYears} ans max`}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </a>
            ))}
          </div>
          <p className="text-[10px] text-brand-400 mt-2">Partenaires {data.partnerBanksFr}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Income docs */}
        <Section title={`Documents de revenus — ${data.name}`} color="bg-brand-600">
          <ul className="space-y-2">
            {data.incomeDocsFr.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-500">
            Plus les documents communs à tous les MRE : passeport marocain, CIN, titre de séjour,
            justificatif d'apport ≥ 30% en devises, déclaration Office des Changes (art. 793–796).
          </div>
        </Section>

        {/* Transfers */}
        <Section title="Transferts de fonds vers le Maroc" color="bg-emerald-600">
          <ul className="space-y-2">
            {data.transferFr.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </Section>

        {/* Tips */}
        <Section title={`Conseils spécifiques — ${data.name}`} color="bg-violet-600">
          <ul className="space-y-2">
            {data.tipsFr.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </Section>

        {/* Regulatory note */}
        <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-5">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Réglementation de référence</p>
            <p className="leading-relaxed">
              Tous les crédits immobiliers MRE sont soumis aux Articles 793–796 de la réglementation
              des changes marocaine (Office des Changes). L'apport minimum de 30% en devises est
              non-négociable. Les remboursements peuvent être effectués depuis l'étranger en devises
              ou depuis un compte en Dirhams Convertibles (CDC) au Maroc.{" "}
              <a
                href={data.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Lire la réglementation officielle →
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl p-8 text-white text-center"
           style={{ background: "linear-gradient(135deg,#059669 0%,#065f46 100%)" }}>
        <h2 className="text-xl font-bold mb-2">Simulez votre prêt depuis {data.name}</h2>
        <p className="text-emerald-200 text-sm mb-5">
          Comparez les banques MRE et calculez vos mensualités en MAD, EUR ou USD.
        </p>
        <Link
          href={`/${lang}#simulator`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
        >
          Lancer la simulation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className={`${color} px-5 py-3 flex items-center gap-2`}>
        <h2 className="font-semibold text-white text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
