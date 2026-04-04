import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
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
  return {
    title: lang === "ar"
      ? "دليل شراء عقار في المغرب — BuyMyDar"
      : lang === "en"
      ? "Complete Guide to Buying Property in Morocco — BuyMyDar"
      : "Guide complet d'achat immobilier au Maroc — BuyMyDar",
    description: lang === "fr"
      ? "Les 7 étapes pour acheter un bien immobilier au Maroc : de la recherche à la signature chez le notaire."
      : "7 steps to buy real estate in Morocco: from property search to notary signing.",
  };
}

const STEPS = [
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
      "Consultez BuyMyDar pour comparer les 8 banques marocaines : taux fixe de 4,45% (CIH) à 4,90% (CDM) en avril 2026.",
      "Taux fixe vs variable : le fixe offre la sécurité ; le variable est indexé sur les indices BAM (BDT/TMP) et peut baisser si le taux directeur recule.",
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
      "Demandez la Fiche d'Information Standardisée Européenne (FISE) à chaque banque pour comparer le Taux Annuel Effectif Global (TAEG).",
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

export default async function GuidePage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  if (!locales.includes(lang)) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" /> Accueil
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Guide d'achat</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <p className="section-label mb-3">
          <span className="w-4 h-px bg-brand-600 inline-block" /> 7 étapes
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
          Guide complet d'achat immobilier au Maroc
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
          De la recherche du bien à la remise des clés — tout ce que vous devez savoir
          pour acheter sereinement, que vous soyez résident ou MRE.
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
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Étape {step.n}</span>
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
           style={{ background: "linear-gradient(135deg,#1565C0 0%,#0D47A1 100%)" }}>
        <h2 className="text-xl font-bold mb-2">Prêt à simuler votre prêt ?</h2>
        <p className="text-blue-200 text-sm mb-5">
          Comparez les 8 banques marocaines et calculez vos mensualités en temps réel.
        </p>
        <Link
          href={`/${lang}#simulator`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
        >
          Lancer la simulation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
