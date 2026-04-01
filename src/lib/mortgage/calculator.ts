/**
 * BuyMyDar — Mortgage Calculator Engine
 * Formula: M = P × [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Moroccan market (April 2026, source: BAM):
 * - BAM key rate: 2.50% (cut Dec 2025)
 * - Best fixed rates: 3.90%–4.20% (civil servants / fonctionnaires)
 * - Standard fixed: 4.40%–5.30%
 * - ADI insurance: ~0.43% p.a. market average
 * - TMIC ceiling: 13.21% (April 2026–March 2027)
 */

export interface SimulatorInput {
  principal: number;       // in MAD
  annualRate: number;      // decimal e.g. 0.0475
  termMonths: number;
  insuranceRate?: number;  // decimal e.g. 0.0043
}

export interface MonthlyRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  insurance: number;
  balance: number;
}

export interface SimulatorResult {
  monthlyPayment: number;
  monthlyInsurance: number;
  totalMonthly: number;
  totalPayment: number;
  totalInterest: number;
  totalInsurance: number;
  effectiveRate: number;
  schedule: MonthlyRow[];
}

export function calculateMortgage(input: SimulatorInput): SimulatorResult {
  const { principal, annualRate, termMonths, insuranceRate = 0.0043 } = input;

  if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
    throw new Error("All inputs must be positive numbers.");
  }

  const r = annualRate / 12;
  const n = termMonths;
  const factor = Math.pow(1 + r, n);
  const monthlyPayment = (principal * r * factor) / (factor - 1);
  const monthlyInsurance = (principal * insuranceRate) / 12;
  const totalMonthly = monthlyPayment + monthlyInsurance;

  const schedule: MonthlyRow[] = [];
  let balance = principal;
  for (let month = 1; month <= n; month++) {
    const interestPayment = balance * r;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    schedule.push({ month, payment: monthlyPayment, principal: principalPayment, interest: interestPayment, insurance: monthlyInsurance, balance });
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;
  const totalInsurance = monthlyInsurance * n;

  return {
    monthlyPayment, monthlyInsurance, totalMonthly,
    totalPayment: totalPayment + totalInsurance,
    totalInterest, totalInsurance,
    effectiveRate: annualRate + insuranceRate,
    schedule,
  };
}

/* ── Promotion types ──────────────────────────────────────────────── */
export type PromoTag =
  | "youth"        // under-35 special offer
  | "mre"          // MRE / diaspora
  | "state-aid"    // Daam Sakane / FOGALOGE
  | "rate-promo"   // limited-time rate reduction
  | "zero-fee"     // file fees waived / reduced
  | "extended"     // longer-than-standard term
  | "unique";      // product unique in market

export interface Promotion {
  tag: PromoTag;
  labelFr: string;
  labelEn: string;
  labelAr: string;
  detailFr: string;
  detailEn: string;
  url?: string;
}

export interface BankRateEntry {
  id: string;
  name: string;
  shortName: string;
  fixedRate: number;
  fixedRateMin?: number;       // best rate (civil servants / top profiles)
  variableRate: number;
  maxDurationYears: number;
  maxDurationMREYears?: number; // extended duration for MREs
  maxAmountMAD: number;
  maxLTVResident: number;      // e.g. 1.0 = 100%
  maxLTVMRE?: number;          // e.g. 1.1 = 110%
  mreEligible: boolean;
  applyUrl: string;
  color: string;
  promotions: Promotion[];
  daamsakan: boolean;          // participates in state Daam Sakane program
  lastUpdated: string;         // ISO date
  sourceUrl?: string;
}

/* ── Bank data (verified April 2026) ─────────────────────────────── */
export const BANK_RATES: BankRateEntry[] = [
  {
    id: "attijariwafa",
    name: "Attijariwafa Bank",
    shortName: "Attijari",
    fixedRate: 0.0450,
    fixedRateMin: 0.0390,
    variableRate: 0.0420,
    maxDurationYears: 25,
    maxDurationMREYears: 30,
    maxAmountMAD: 5_000_000,
    maxLTVResident: 1.0,
    maxLTVMRE: 1.0,
    mreEligible: true,
    applyUrl: "https://www.attijariwafabank.com/fr/particuliers/credits/credit-immobilier",
    color: "#E31837",
    daamsakan: true,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.attijariwafabank.com",
    promotions: [
      {
        tag: "mre",
        labelFr: "Durée 30 ans pour MRE",
        labelEn: "30-year term for MREs",
        labelAr: "مدة 30 سنة للمغاربة بالخارج",
        detailFr: "Les Marocains Résidant à l'Étranger bénéficient d'une durée de remboursement étendue jusqu'à 30 ans via le produit Miftah Bila Houdoud.",
        detailEn: "MREs benefit from an extended repayment period of up to 30 years via the Miftah Bila Houdoud product.",
        url: "https://www.attijarimdm.com/fr/je-finance-mon-projet-immobilier",
      },
      {
        tag: "state-aid",
        labelFr: "Daam Sakane éligible",
        labelEn: "Daam Sakane eligible",
        labelAr: "مؤهل لبرنامج دعم السكن",
        detailFr: "Participe au programme gouvernemental Daam Sakane : aide de 60 000 à 100 000 DH pour les primo-accédants.",
        detailEn: "Participates in the Daam Sakane government aid program: grant of 60,000 to 100,000 MAD for first-time buyers.",
        url: "https://www.daamsakane.ma",
      },
    ],
  },
  {
    id: "bcp",
    name: "Banque Centrale Populaire",
    shortName: "BCP",
    fixedRate: 0.0460,
    fixedRateMin: 0.0400,
    variableRate: 0.0430,
    maxDurationYears: 25,
    maxAmountMAD: 6_000_000,
    maxLTVResident: 1.0,
    maxLTVMRE: 1.0,
    mreEligible: true,
    applyUrl: "https://jedeviensproprietaire.ma",
    color: "#009B3A",
    daamsakan: true,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.gbp.ma",
    promotions: [
      {
        tag: "mre",
        labelFr: "Offre Bladi MRE",
        labelEn: "Bladi MRE Offer",
        labelAr: "عرض بلادي للمغاربة بالخارج",
        detailFr: "Produit dédié MRE incluant optimisation fiscale, conseil patrimonial et taux préférentiel. Garantie FOGALOGE disponible (0% apport).",
        detailEn: "Dedicated MRE product including tax optimization, estate planning and preferential rates. FOGALOGE guarantee available (0% down payment).",
        url: "https://particulier.groupebcp.com",
      },
      {
        tag: "state-aid",
        labelFr: "Sakane Mabrouk Dari",
        labelEn: "Sakane Mabrouk Dari",
        labelAr: "سكن مبروك داري",
        detailFr: "Financement garanti FOGALOGE pour fonctionnaires, salariés CNSS, indépendants et MRE. Jusqu'à 100% du prix d'acquisition.",
        detailEn: "FOGALOGE-guaranteed financing for civil servants, CNSS employees, self-employed and MREs. Up to 100% of purchase price.",
        url: "https://particulier.groupebcp.com/fr/Pages/credit-sakane-mabrouk-dari-FOGALOGE.aspx",
      },
    ],
  },
  {
    id: "boa",
    name: "Bank of Africa",
    shortName: "BOA",
    fixedRate: 0.0465,
    fixedRateMin: 0.0420,
    variableRate: 0.0440,
    maxDurationYears: 25,
    maxAmountMAD: 4_000_000,
    maxLTVResident: 0.80,
    maxLTVMRE: 1.10,
    mreEligible: true,
    applyUrl: "https://www.bankofafrica.ma/fr/particuliers/credits/immobilier",
    color: "#0055A4",
    daamsakan: true,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.bankofafrica.ma",
    promotions: [
      {
        tag: "mre",
        labelFr: "LTV 110% pour MRE",
        labelEn: "110% LTV for MREs",
        labelAr: "تمويل 110% للمغاربة بالخارج",
        detailFr: "Les MRE peuvent financer jusqu'à 110% du prix d'acquisition (frais inclus) via le produit Damane Assakane. Différé de 6 à 24 mois disponible.",
        detailEn: "MREs can finance up to 110% of the purchase price (fees included) via the Damane Assakane product. 6 to 24 months deferral available.",
        url: "https://www.bankofafrica.ma/en/marocains-du-monde/posseder-un-chez-soi-au-maroc/damane-assakane",
      },
    ],
  },
  {
    id: "cih",
    name: "CIH Bank",
    shortName: "CIH",
    fixedRate: 0.0445,
    fixedRateMin: 0.0410,
    variableRate: 0.0420,
    maxDurationYears: 25,
    maxAmountMAD: 3_500_000,
    maxLTVResident: 1.0,
    mreEligible: true,
    applyUrl: "https://www.codesakane.ma",
    color: "#00A651",
    daamsakan: false,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.cihbank.ma",
    promotions: [
      {
        tag: "youth",
        labelFr: "Code 30 — Durée 30 ans (moins de 35 ans)",
        labelEn: "Code 30 — 30-year term (under 35)",
        labelAr: "كود 30 — مدة 30 سنة (أقل من 35 سنة)",
        detailFr: "Les acheteurs de moins de 35 ans bénéficient d'une durée de remboursement allongée à 30 ans (vs 25 ans standard), réduisant significativement la mensualité.",
        detailEn: "Buyers under 35 benefit from an extended repayment period of 30 years (vs standard 25), significantly reducing the monthly payment.",
        url: "https://code30.ma",
      },
      {
        tag: "zero-fee",
        labelFr: "Code Sakane — 50% de réduction sur les frais de dossier",
        labelEn: "Code Sakane — 50% off file fees",
        labelAr: "كود السكن — خصم 50% على رسوم الملف",
        detailFr: "Pour les moins de 35 ans : 50% de réduction sur les frais de dossier, financement à 100%, option de sauter 1 mensualité par an et possibilité d'ajuster le montant des mensualités.",
        detailEn: "For under-35s: 50% off file fees, 100% financing, option to skip 1 payment per year and ability to adjust monthly payment amounts.",
        url: "https://www.codesakane.ma",
      },
    ],
  },
  {
    id: "bmci",
    name: "BMCI (BNP Paribas)",
    shortName: "BMCI",
    fixedRate: 0.0480,
    fixedRateMin: 0.0430,
    variableRate: 0.0450,
    maxDurationYears: 25,
    maxAmountMAD: 5_000_000,
    maxLTVResident: 1.0,
    mreEligible: false,
    applyUrl: "https://www.bmci.ma/particuliers/credits/devenir-proprietaire",
    color: "#00965E",
    daamsakan: true,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.bmci.ma",
    promotions: [
      {
        tag: "unique",
        labelFr: "Taux variable dégressif — le seul au Maroc",
        labelEn: "Decreasing variable rate — unique in Morocco",
        labelAr: "معدل متغير تنازلي — الوحيد في المغرب",
        detailFr: "Produit exclusif : le taux ne peut qu'ALLER À LA BAISSE. Si les taux du marché montent, votre taux reste fixe. Si ils baissent, vous en bénéficiez automatiquement. Premier produit du genre au Maroc.",
        detailEn: "Exclusive product: the rate can ONLY GO DOWN. If market rates rise, your rate stays fixed. If they fall, you automatically benefit. First such product in Morocco.",
        url: "https://www.bmci.ma/actualite/bmci-lance-offre-credit-habitat-exclusive/",
      },
      {
        tag: "state-aid",
        labelFr: "Daam Sakan éligible",
        labelEn: "Daam Sakan eligible",
        labelAr: "مؤهل لبرنامج دعم السكن",
        detailFr: "Participe au programme Daam Sakane. Aide d'État de 60 000 à 100 000 DH.",
        detailEn: "Participates in the Daam Sakane program. State aid of 60,000 to 100,000 MAD.",
        url: "https://www.bmci.ma/particuliers/credits/devenir-proprietaire/daam-sakan/",
      },
    ],
  },
  {
    id: "saham",
    name: "Saham Bank",
    shortName: "Saham",
    fixedRate: 0.0470,
    fixedRateMin: 0.0420,
    variableRate: 0.0445,
    maxDurationYears: 25,
    maxAmountMAD: 4_500_000,
    maxLTVResident: 1.0,
    mreEligible: false,
    applyUrl: "https://www.sahambank.com/particuliers/credits/immobilier",
    color: "#C8102E",
    daamsakan: false,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.sahambank.com",
    promotions: [
      {
        tag: "rate-promo",
        labelFr: "Pack Crédit + Assurance + Compte",
        labelEn: "Loan + Insurance + Account Bundle",
        labelAr: "باقة القرض + التأمين + الحساب",
        detailFr: "Anciennement Société Générale Maroc (rebranding juin 2025). Offre groupée : conditions préférentielles en combinant crédit immobilier, assurance habitation et compte courant.",
        detailEn: "Formerly Société Générale Maroc (rebranded June 2025). Bundle deal: preferential conditions when combining mortgage, home insurance and current account.",
        url: "https://www.sahambank.com",
      },
    ],
  },
  {
    id: "cdm",
    name: "Crédit du Maroc",
    shortName: "CDM",
    fixedRate: 0.0490,
    fixedRateMin: 0.0420,
    variableRate: 0.0465,
    maxDurationYears: 25,
    maxAmountMAD: 3_000_000,
    maxLTVResident: 1.0,
    mreEligible: true,
    applyUrl: "https://www.creditdumaroc.ma/particulier/credit-immobilier-sakane",
    color: "#004899",
    daamsakan: false,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.creditdumaroc.ma",
    promotions: [
      {
        tag: "unique",
        labelFr: "Taux variable plafonné (taux capé)",
        labelEn: "Capped variable rate",
        labelAr: "معدل متغير مع سقف",
        detailFr: "Taux variable avec un plafond de protection. En cas de hausse des taux, la durée s'allonge avant que la mensualité n'augmente. Flexibilité totale : taux fixe ou variable au choix.",
        detailEn: "Variable rate with a protection cap. If rates rise, the duration extends before the monthly payment increases. Full flexibility: fixed or variable rate of your choice.",
        url: "https://immobilier.creditdumaroc.ma/fr/taux-dinterets-fixe-ou-variable",
      },
    ],
  },
  {
    id: "cfg",
    name: "CFG Bank",
    shortName: "CFG",
    fixedRate: 0.0460,
    fixedRateMin: 0.0410,
    variableRate: 0.0435,
    maxDurationYears: 20,          // ← corrected from 25 (max is 20 per CFG website)
    maxAmountMAD: 10_000_000,
    maxLTVResident: 1.0,
    mreEligible: true,
    applyUrl: "https://www.cfgbank.com/particuliers/notre-offre/solution-financement/le-credit-immobilier/",
    color: "#6B21A8",
    daamsakan: false,
    lastUpdated: "2026-04-01",
    sourceUrl: "https://www.cfgbank.com",
    promotions: [
      {
        tag: "youth",
        labelFr: "Jeunes Actifs — mensualités réduites les 5 premières années",
        labelEn: "Young Professionals — reduced payments for first 5 years",
        labelAr: "الشباب النشط — أقساط مخفضة لأول 5 سنوات",
        detailFr: "Pour les jeunes professionnels : mensualités allégées durant les 5 premières années du crédit, ajustables une fois par an selon l'évolution de votre salaire. Réponse en 48h après dossier complet.",
        detailEn: "For young professionals: lower monthly payments for the first 5 years, adjustable once a year based on salary growth. 48-hour response after complete file.",
        url: "https://www.cfgbank.com/particuliers/notre-offre/offres-speciales/jeunes-actifs/",
      },
    ],
  },
];

/* ── State program ────────────────────────────────────────────────── */
export const DAAM_SAKANE = {
  name: "Daam Sakane",
  url: "https://www.daamsakane.ma",
  description: "Programme gouvernemental d'aide à l'accession à la propriété",
  tiers: [
    { maxPriceMAD: 300_000,  grantMAD: 100_000 },
    { maxPriceMAD: 600_000,  grantMAD: 70_000  },
    { maxPriceMAD: 800_000,  grantMAD: 60_000  },
  ],
  mreEligible: true,
  lastUpdated: "2026-04-01",
};

/* ── BAM data source (central bank) ──────────────────────────────── */
export const BAM_DATA_SOURCES = {
  apiPortal: "https://apihelpdesk.centralbankofmorocco.ma",
  tmicRates: "https://www.bkam.ma/Marches/Taux-d-interet/Taux-maximum-des-interets-conventionnels",
  variableReference: "https://www.bkam.ma/Marches/Taux-d-interet/Reference-pour-la-revision-des-taux-variables",
  lendingRates: "https://www.bkam.ma/en/Markets/Interest-rate/Lending-rates",
  currentTMIC: 0.1321, // 13.21% — April 2026 to March 2027
  bamKeyRate: 0.025,   // 2.50% — December 2025 cut
  marketAverageQ4_2025: 0.0519, // 5.19% TAEG all-in
};

export const MARKET_AVERAGE_RATE =
  BANK_RATES.reduce((acc, b) => acc + b.fixedRate, 0) / BANK_RATES.length;

export const CURRENCY_RATES: Record<string, number> = {
  MAD: 1,
  EUR: 0.092,
  USD: 0.099,
};

export function convertCurrency(amountMAD: number, toCurrency: string): number {
  return amountMAD * (CURRENCY_RATES[toCurrency] ?? 1);
}

export function formatCurrency(amount: number, currency: string, locale = "fr-MA"): string {
  if (currency === "MAD") {
    return `${Math.round(amount).toLocaleString("fr-MA")} DH`;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
