"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, FileText, Home, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocSection { heading: string; docs: string[] }
interface DocGroup {
  id: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  title: string;
  subtitle: string;
  sections: DocSection[];
}

const DOC_GROUPS: DocGroup[] = [
  {
    id: "compromis",
    icon: Home,
    color: "text-violet-600",
    bgColor: "bg-violet-600",
    title: "Compromis de Vente",
    subtitle: "Documents requis pour signer la promesse de vente",
    sections: [
      {
        heading: "Côté acheteur",
        docs: [
          "Copie CIN recto-verso (ou passeport pour les MRE)",
          "Justificatif de domicile de moins de 3 mois",
          "Chèque d'arrhes — généralement 10% du prix de vente",
          "Pour MRE : carte de séjour / titre de résidence du pays d'accueil",
        ],
      },
      {
        heading: "Côté vendeur",
        docs: [
          "Copie CIN recto-verso",
          "Titre Foncier (TF) original ou copie certifiée",
          "Certificat spécial de propriété délivré par la Conservation Foncière",
          "Attestation de charges (hypothèques ou créances éventuelles)",
          "Permis d'habiter / Certificat de conformité (pour tout bien construit)",
          "Contrat de syndic + dernière PV d'AG (si appartement en copropriété)",
          "Quittance de charges et taxes récentes (taxe d'habitation, taxe de services communaux)",
        ],
      },
    ],
  },
  {
    id: "credit-resident",
    icon: FileText,
    color: "text-brand-600",
    bgColor: "bg-brand-600",
    title: "Crédit Immobilier — Salarié Résident",
    subtitle: "Dossier à remettre à la banque pour une demande de prêt",
    sections: [
      {
        heading: "Identité et situation personnelle",
        docs: [
          "Copie CIN recto-verso",
          "Justificatif de domicile de moins de 3 mois",
          "Livret de famille (si marié(e))",
          "Acte de mariage ou jugement de divorce (si applicable)",
        ],
      },
      {
        heading: "Revenus et emploi",
        docs: [
          "3 derniers bulletins de salaire originaux",
          "Attestation de travail récente (datant de moins de 3 mois)",
          "Contrat de travail CDI ou attestation de titularisation (fonctionnaires)",
          "2 derniers avis d'imposition (IR)",
          "6 derniers relevés de compte bancaire principal",
        ],
      },
      {
        heading: "Bien immobilier",
        docs: [
          "Compromis de vente / Promesse de vente signé(e)",
          "Plan de masse et plan cadastral du bien",
          "Titre Foncier du vendeur (copie)",
          "Permis de construire (si construction neuve ou VEFA)",
          "Devis des travaux (si rénovation)",
        ],
      },
      {
        heading: "Daam Sakane — si éligible",
        docs: [
          "Attestation d'éligibilité délivrée par le Ministère de l'Habitat",
          "Déclaration sur l'honneur de première acquisition immobilière",
        ],
      },
    ],
  },
  {
    id: "credit-mre",
    icon: Globe,
    color: "text-emerald-600",
    bgColor: "bg-emerald-600",
    title: "Crédit Immobilier — MRE",
    subtitle: "Documents supplémentaires pour les Marocains Résidant à l'Étranger",
    sections: [
      {
        heading: "Identité",
        docs: [
          "Passeport marocain — copie pages identité + validité",
          "Copie CIN marocaine",
          "Titre de séjour / carte de résidence du pays d'accueil (en cours de validité)",
          "Justificatif d'adresse à l'étranger de moins de 3 mois",
        ],
      },
      {
        heading: "Revenus à l'étranger",
        docs: [
          "3 derniers bulletins de salaire du pays de résidence (traduits si nécessaire)",
          "Contrat de travail du pays de résidence (CDI ou équivalent)",
          "6 derniers relevés bancaires étrangers",
          "2 derniers avis d'imposition du pays de résidence",
          "Tout justificatif de revenu complémentaire (foncier, dividendes, retraite)",
        ],
      },
      {
        heading: "Apport et transferts — obligatoires",
        docs: [
          "Justificatif d'apport ≥ 30% du prix, versé en devises (Art. 793 Office des Changes)",
          "Historique de transferts de fonds vers le Maroc sur 12 mois",
          "Relevés du compte en Dirhams Convertibles (CDC) ou compte DAE au Maroc",
          "Déclaration sur l'honneur relative aux Articles 793–796 de la réglementation des changes",
        ],
      },
      {
        heading: "Garantie hypothécaire",
        docs: [
          "Garantie bancaire de l'établissement étranger (si applicable)",
          "OU acceptation d'hypothèque de 1er rang sur le bien financé",
        ],
      },
      {
        heading: "Bien immobilier",
        docs: [
          "Compromis de vente signé",
          "Titre Foncier du vendeur (copie)",
          "Plan de masse et plan cadastral",
          "Permis de construire (si construction neuve ou VEFA)",
        ],
      },
    ],
  },
];

function DocCard({ group }: { group: DocGroup }) {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const Icon = group.icon;

  const toggleSection = (i: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="card overflow-hidden">
      {/* Card header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/60 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", group.bgColor)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{group.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{group.subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="p-5 space-y-3">
              {group.sections.map((section, si) => (
                <div key={si} className="rounded-xl border border-slate-100 overflow-hidden">
                  <button
                    onClick={() => toggleSection(si)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 hover:bg-slate-100/60 transition-colors text-left"
                  >
                    <span className="text-sm font-semibold text-slate-700">{section.heading}</span>
                    <span className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        group.color === "text-brand-600" ? "bg-brand-50 text-brand-600"
                          : group.color === "text-emerald-600" ? "bg-emerald-50 text-emerald-600"
                          : "bg-violet-50 text-violet-600"
                      )}>
                        {section.docs.length} doc{section.docs.length > 1 ? "s" : ""}
                      </span>
                      <ChevronDown
                        className={cn("w-4 h-4 text-slate-400 transition-transform", openSections.has(si) && "rotate-180")}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSections.has(si) && (
                      <motion.ul
                        initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        {section.docs.map((doc, di) => (
                          <li
                            key={di}
                            className={cn(
                              "flex items-start gap-2.5 px-4 py-2.5 text-sm text-slate-600",
                              di !== section.docs.length - 1 && "border-b border-slate-50"
                            )}
                          >
                            <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5",
                              group.color === "text-brand-600" ? "text-brand-400"
                                : group.color === "text-emerald-600" ? "text-emerald-400"
                                : "text-violet-400"
                            )} />
                            {doc}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {group.id === "credit-mre" && (
                <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Réglementation de référence :{" "}
                    <a
                      href="https://www.oc.gov.ma/fr/mre/credits-pour-lacquisition-ou-la-construction-de-biens-immeubles"
                      target="_blank" rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      Office des Changes — Art. 793–796
                    </a>
                    . L'apport minimum en devises est obligatoire avant tout accord bancaire.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DocumentsSection() {
  return (
    <section id="documents" className="scroll-mt-28" aria-labelledby="docs-heading">
      {/* Header */}
      <div className="mb-7">
        <p className="section-label mb-2">
          <span className="w-4 h-px bg-brand-600 inline-block" /> Checklist
        </p>
        <h2 id="docs-heading" className="heading-2">Documents requis</h2>
        <p className="text-slate-500 text-sm mt-1">
          Compromis de vente, dossier de crédit résident et dossier MRE — toutes les pièces à préparer
        </p>
      </div>

      <div className="space-y-4">
        {DOC_GROUPS.map((group) => (
          <DocCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
