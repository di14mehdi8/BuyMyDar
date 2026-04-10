import { notFound } from "next/navigation";
import { locales, type Locale, hreflangMap } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Search, FileSignature, Landmark, SlidersHorizontal,
  FolderOpen, CheckCircle2, Key, ArrowRight, Home,
} from "lucide-react";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hreflangAlternates: Record<string, string> = {};
  for (const [locale, tags] of Object.entries(hreflangMap)) {
    for (const tag of tags) {
      hreflangAlternates[tag] = `https://buymydar.com/${locale}/guide`;
    }
  }
  hreflangAlternates["x-default"] = "https://buymydar.com/fr/guide";
  return {
    title: lang === "ar"
      ? "دليل شراء عقار في المغرب — BuyMyDar"
      : lang === "en"
      ? "Complete Guide to Buying Property in Morocco — BuyMyDar"
      : "Guide complet d'achat immobilier au Maroc — BuyMyDar",
    description: lang === "fr"
      ? "Les 7 étapes pour acheter un bien immobilier au Maroc : de la recherche à la signature chez le notaire."
      : "7 steps to buy real estate in Morocco: from property search to notary signing.",
    alternates: {
      canonical: `https://buymydar.com/${lang}/guide`,
      languages: hreflangAlternates,
    },
  };
}

const STEPS_FR = [
  {
    n: 1, icon: Search, color: "bg-brand-600",
    title: "Rechercher un bien immobilier",
    subtitle: "Définir votre projet et explorer le marché",
    content: [
      "Définissez votre budget total (prix + frais notaire ~5-7% + frais bancaires) avant de commencer les visites.",
      "Comparez les prix au m² par ville : Casablanca (Maarif, Ain Diab), Rabat (Agdal, Hay Riad), Marrakech (Guéliz, Hivernage), Tanger (Malabata, Centre-ville).",
      "Privilégiez les biens avec Titre Foncier (TF) enregistré — évitez les melkiya non titrées qui compliquent le financement.",
      "Vérifiez que le bien est libre de charges (hypothèques, saisies) via un certificat spécial auprès de la Conservation Foncière.",
      "Pour les MRE : les visites à distance sont possibles, mais mandatez un avocat ou un proche de confiance pour les vérifications physiques.",
    ],
  },
  {
    n: 2, icon: FileSignature, color: "bg-violet-600",
    title: "Signer le compromis de vente",
    subtitle: "La promesse de vente engage les deux parties",
    content: [
      "Le compromis (promesse synallagmatique de vente) fixe le prix, les conditions suspensives et le délai de réalisation.",
      "L'arrhes standard est de 10% du prix. Ces arrhes sont perdues si vous vous rétractez, et le vendeur doit vous rembourser le double s'il se rétracte.",
      "Insérez une clause suspensive d'obtention de prêt : si la banque refuse, vous récupérez vos arrhes.",
      "Délai typique entre compromis et acte définitif : 2 à 4 mois selon la banque et le dossier.",
      "Documents à préparer côté acheteur : CIN, justificatif de domicile, et chèque d'arrhes. Pour MRE : passeport + carte de séjour.",
    ],
  },
  {
    n: 3, icon: Landmark, color: "bg-amber-500",
    title: "Explorer les possibilités de financement",
    subtitle: "Comparez les offres et simulez vos mensualités",
    content: [
      "Consultez BuyMyDar pour comparer les 8 banques marocaines : taux fixe de 4,45% (CIH) à 4,90% (CDM) en 2026.",
      "Taux fixe vs variable : le fixe offre la sécurité ; le variable est indexé sur les indices BAM et peut baisser si le taux directeur recule.",
      "Daam Sakane : si le bien est ≤ 300 000 DH, l'État subventionne jusqu'à 100 000 DH. Vérifiez votre éligibilité.",
      "MRE : l'apport minimum est de 30% du prix, versé en devises étrangères (art. 793 Office des Changes). Certaines banques acceptent jusqu'à 30 ans.",
      "Simulation : pour un prêt de 1,5M DH sur 20 ans à 4,65%, la mensualité totale (assurance incluse) est d'environ 9 800 DH/mois.",
    ],
  },
  {
    n: 4, icon: SlidersHorizontal, color: "bg-emerald-600",
    title: "Chercher la meilleure offre de prêt",
    subtitle: "Négocier le taux et comparer les conditions",
    content: [
      "Ne vous limitez pas à votre banque habituelle — les banques concurrentes offrent souvent de meilleures conditions pour attirer de nouveaux clients.",
      "Négociez au-delà du taux : frais de dossier (souvent waivables), délai de déblocage des fonds, conditions de remboursement anticipé.",
      "L'Indemnité de Remboursement Anticipé (IRA) est plafonnée par BAM à 3% du capital restant ou 6 mois d'intérêts (le moindre des deux).",
      "L'assurance emprunteur (ADI) est obligatoire. Le taux de marché est d'environ 0,43%/an du capital initial. Négociez-la séparément.",
      "Demandez la Fiche d'Information Standardisée (FISE) à chaque banque pour comparer le Taux Annuel Effectif Global (TAEG).",
    ],
  },
  {
    n: 5, icon: FolderOpen, color: "bg-rose-600",
    title: "Monter le dossier de crédit",
    subtitle: "Préparer toutes les pièces justificatives",
    content: [
      "Salarié résident : 3 derniers bulletins de salaire, attestation de travail récente, 6 relevés bancaires, 2 avis d'imposition, compromis de vente.",
      "Fonctionnaire : attestation de salaire délivrée par la Trésorerie Générale du Royaume, dernier ordre de mission.",
      "Travailleur indépendant : patente, 2 derniers bilans certifiés, 12 relevés bancaires, attestation d'affiliation CNSS.",
      "MRE : tous les documents ci-dessus + titre de séjour, bulletins de salaire traduits, et justificatif d'apport en devises (≥30%).",
      "Conseil : préparez des copies numérisées en amont — les délais sont souvent liés aux aller-retours de documents, pas au traitement bancaire.",
    ],
  },
  {
    n: 6, icon: CheckCircle2, color: "bg-teal-600",
    title: "Obtenir l'accord de la banque",
    subtitle: "Du dépôt du dossier à l'offre de prêt formelle",
    content: [
      "Délai moyen d'instruction : 10 à 30 jours ouvrés selon la banque et la complexité du dossier.",
      "La banque effectue une analyse de solvabilité (taux d'effort ≤ 33%), une évaluation du bien (expertise immobilière), et une vérification des garanties.",
      "L'accord de principe est oral ou écrit ; attendez l'offre de prêt officielle signée avant de considérer le financement sécurisé.",
      "Si refus : demandez les motifs précis, corrigez les points bloquants (manque de pièces, taux d'effort trop élevé), et soumettez à une autre banque.",
      "MRE : certaines banques disposent de correspondants à l'étranger (notamment en France et en Espagne) pour faciliter la constitution du dossier à distance.",
    ],
  },
  {
    n: 7, icon: Key, color: "bg-orange-500",
    title: "Finaliser le dossier et signer chez le notaire",
    subtitle: "L'acte authentique de vente et la remise des clés",
    content: [
      "La signature de l'acte authentique de vente se fait obligatoirement devant un notaire marocain (adoul pour les biens non titrés).",
      "Le notaire vérifie la chaîne de propriété, purge les hypothèques éventuelles, et transfère officiellement le titre foncier à votre nom.",
      "Frais d'acquisition typiques : droits d'enregistrement (4%), conservation foncière (1,5%), honoraires notaire (~0,5%), hypothèque (1%) — total ~6-7%.",
      "Le déblocage des fonds bancaires s'effectue directement par virement au vendeur ou à son notaire le jour de la signature.",
      "Après signature : la mise à jour du titre foncier à la Conservation Foncière prend 1 à 3 mois. Vous recevez ensuite votre TF au nom de l'acheteur.",
    ],
  },
];

const STEPS_EN = [
  {
    n: 1, icon: Search, color: "bg-brand-600",
    title: "Search for a property",
    subtitle: "Define your project and explore the market",
    content: [
      "Define your total budget (price + notary fees ~5-7% + bank fees) before starting property visits.",
      "Compare prices per m² by city: Casablanca (Maarif, Ain Diab), Rabat (Agdal, Hay Riad), Marrakech (Guéliz, Hivernage), Tangier (Malabata, City Centre).",
      "Prioritize properties with a registered Title Deed (Titre Foncier) — avoid unregistered melkiya titles which complicate financing.",
      "Verify the property is free of liens (mortgages, seizures) via a special certificate from the Land Registry (Conservation Foncière).",
      "For MREs: remote visits are possible, but appoint a trusted lawyer or family member to handle physical inspections.",
    ],
  },
  {
    n: 2, icon: FileSignature, color: "bg-violet-600",
    title: "Sign the sale agreement",
    subtitle: "The preliminary contract binds both parties",
    content: [
      "The sale agreement (compromis de vente) sets the price, conditions precedent, and completion deadline.",
      "The standard deposit is 10% of the price. You forfeit it if you withdraw; the seller must pay double if they back out.",
      "Include a mortgage condition clause: if the bank refuses your loan, you recover your deposit in full.",
      "Typical timeline from agreement to final deed: 2 to 4 months depending on the bank and your file.",
      "Documents needed: national ID, proof of address, deposit cheque. For MREs: passport + residence permit.",
    ],
  },
  {
    n: 3, icon: Landmark, color: "bg-amber-500",
    title: "Explore financing options",
    subtitle: "Compare offers and simulate your monthly payments",
    content: [
      "Use BuyMyDar to compare all 8 Moroccan banks: fixed rates from 4.45% (CIH) to 4.90% (CDM) in 2026.",
      "Fixed vs variable rate: fixed offers certainty; variable is indexed to BAM benchmarks and can drop if the policy rate falls.",
      "Daam Sakane: if the property is ≤ 300,000 DH, the government subsidises up to 100,000 DH. Check your eligibility.",
      "MRE: minimum 30% down payment required in foreign currency (Office des Changes Art. 793). Some banks lend up to 30 years.",
      "Example: a 1.5M DH loan over 20 years at 4.65% gives a total monthly payment (insurance included) of approx. 9,800 DH.",
    ],
  },
  {
    n: 4, icon: SlidersHorizontal, color: "bg-emerald-600",
    title: "Find the best loan offer",
    subtitle: "Negotiate the rate and compare terms",
    content: [
      "Don't limit yourself to your usual bank — competing banks often offer better terms to attract new customers.",
      "Negotiate beyond the rate: processing fees (often waivable), fund release timeline, early repayment conditions.",
      "The Early Repayment Penalty (IRA) is capped by BAM at 3% of remaining capital or 6 months of interest (whichever is lower).",
      "Borrower insurance (ADI) is mandatory. Market rate is approximately 0.43%/year on the initial capital. Negotiate it separately.",
      "Request the Standardised Information Sheet (FISE) from each bank to compare the Annual Percentage Rate (APR).",
    ],
  },
  {
    n: 5, icon: FolderOpen, color: "bg-rose-600",
    title: "Prepare your loan application",
    subtitle: "Gather all required supporting documents",
    content: [
      "Salaried resident: last 3 pay slips, recent employment certificate, 6 bank statements, 2 tax returns, sale agreement.",
      "Civil servant: salary certificate from the Trésorerie Générale du Royaume, latest assignment order.",
      "Self-employed: business licence, last 2 certified balance sheets, 12 bank statements, CNSS affiliation certificate.",
      "MRE: all of the above + residence permit, translated pay slips, and proof of foreign currency down payment (≥30%).",
      "Tip: prepare scanned copies in advance — delays are usually caused by document back-and-forth, not bank processing time.",
    ],
  },
  {
    n: 6, icon: CheckCircle2, color: "bg-teal-600",
    title: "Get bank approval",
    subtitle: "From application submission to formal loan offer",
    content: [
      "Average processing time: 10 to 30 business days depending on the bank and file complexity.",
      "The bank runs a credit analysis (debt-to-income ≤ 33%), a property valuation, and a guarantees check.",
      "A verbal or written approval in principle is not binding — wait for the signed official loan offer.",
      "If refused: request precise reasons, address the blockers (missing documents, DTI too high), then apply to another bank.",
      "MREs: some banks have overseas correspondents (notably in France and Spain) to help build your file remotely.",
    ],
  },
  {
    n: 7, icon: Key, color: "bg-orange-500",
    title: "Finalise and sign at the notary",
    subtitle: "The notarial deed and key handover",
    content: [
      "The final sale deed must be signed before a Moroccan notary (or adoul for unregistered properties).",
      "The notary verifies the ownership chain, clears any mortgages, and officially transfers the title deed to your name.",
      "Typical acquisition costs: registration duties (4%), land registry (1.5%), notary fees (~0.5%), mortgage (1%) — total ~6-7%.",
      "Bank funds are released by direct transfer to the seller or their notary on the day of signing.",
      "After signing: the title deed update at the Conservation Foncière takes 1 to 3 months. You then receive the TF in your name.",
    ],
  },
];

const STEPS_BY_LANG: Record<string, typeof STEPS_FR> = {
  fr: STEPS_FR,
  en: STEPS_EN,
  ar: STEPS_EN, // Arabic content falls back to English (better than French for non-AR speakers)
};

const STEP_LABEL: Record<string, string> = {
  fr: "Étape",
  en: "Step",
  ar: "الخطوة",
};

export default async function GuidePage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  if (!locales.includes(lang)) notFound();

  const STEPS = STEPS_BY_LANG[lang] ?? STEPS_FR;
  const stepLabel = STEP_LABEL[lang] ?? "Step";

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
          {lang === "ar" ? "دليل الشراء" : lang === "en" ? "Buying Guide" : "Guide d'achat"}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <p className="section-label mb-3">
          <span className="w-4 h-px bg-brand-600 inline-block" />
          {lang === "ar" ? "٧ خطوات" : lang === "en" ? "7 steps" : "7 étapes"}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
          {lang === "ar"
            ? "الدليل الشامل لشراء عقار في المغرب"
            : lang === "en"
            ? "Complete Guide to Buying Property in Morocco"
            : "Guide complet d'achat immobilier au Maroc"}
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
          {lang === "ar"
            ? "من البحث عن العقار إلى تسليم المفاتيح — كل ما تحتاج معرفته، سواء كنت مقيماً أو مغتربًا."
            : lang === "en"
            ? "From property search to key handover — everything you need to know, whether you are a resident or living abroad (MRE)."
            : "De la recherche du bien à la remise des clés — tout ce que vous devez savoir, que vous soyez résident ou MRE."}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.n} className="flex gap-6">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-slate-100 mt-3" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8 flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {stepLabel} {step.n}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h2>
                <p className="text-sm text-slate-500 mb-4">{step.subtitle}</p>
                <ul className="space-y-2.5">
                  {step.content.map((line, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
                      <ArrowRight className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl p-8 text-white text-center"
           style={{ background: "linear-gradient(135deg,#1E3A6E 0%,#0F2040 100%)" }}>
        <h2 className="text-xl font-bold mb-2">
          {lang === "ar" ? "مستعد لحساب قرضك؟" : lang === "en" ? "Ready to simulate your loan?" : "Prêt à simuler votre prêt ?"}
        </h2>
        <p className="text-blue-200 text-sm mb-5">
          {lang === "ar"
            ? "قارن ٨ بنوك مغربية واحسب أقساطك الشهرية في الوقت الفعلي."
            : lang === "en"
            ? "Compare 8 Moroccan banks and calculate your monthly payments in real time."
            : "Comparez les 8 banques marocaines et calculez vos mensualités en temps réel."}
        </p>
        <Link
          href={`/${lang}#simulator`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
        >
          {lang === "ar" ? "ابدأ المحاكاة" : lang === "en" ? "Start simulation" : "Lancer la simulation"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
