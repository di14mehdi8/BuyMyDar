/**
 * BuyMyDar — Mortgage Calculator Engine
 * Implements standard amortization formula adjusted for Morocco (MAB / BAM guidelines):
 *   M = P × [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Moroccan adjustments:
 * - Rates: 4.50% – 5.50% fixed (as of 2026, BAM ref rate 2.75%)
 * - MRH Insurance: typically 0.25% – 0.45% p.a. on outstanding balance
 * - Notary fees: ~1% of property value (not included in loan)
 * - Max LTV: 80% for residents, 70% for MREs
 */

export interface SimulatorInput {
  /** Principal in MAD */
  principal: number;
  /** Annual interest rate as decimal (e.g. 0.0475 = 4.75%) */
  annualRate: number;
  /** Loan term in months */
  termMonths: number;
  /** Annual insurance rate as decimal (e.g. 0.003 = 0.30%) */
  insuranceRate?: number;
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
  const { principal, annualRate, termMonths, insuranceRate = 0.003 } = input;

  if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
    throw new Error("All inputs must be positive numbers.");
  }

  const r = annualRate / 12; // monthly interest rate
  const n = termMonths;

  // Standard annuity formula
  const factor = Math.pow(1 + r, n);
  const monthlyPayment = principal * (r * factor) / (factor - 1);

  // Insurance calculated on initial principal (simplified Moroccan practice)
  const monthlyInsurance = (principal * insuranceRate) / 12;
  const totalMonthly = monthlyPayment + monthlyInsurance;

  // Build amortization schedule
  const schedule: MonthlyRow[] = [];
  let balance = principal;

  for (let month = 1; month <= n; month++) {
    const interestPayment = balance * r;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      insurance: monthlyInsurance,
      balance,
    });
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;
  const totalInsurance = monthlyInsurance * n;

  // Effective annual rate (APR including insurance)
  const effectiveRate = annualRate + insuranceRate;

  return {
    monthlyPayment,
    monthlyInsurance,
    totalMonthly,
    totalPayment: totalPayment + totalInsurance,
    totalInterest,
    totalInsurance,
    effectiveRate,
    schedule,
  };
}

/** Moroccan bank rate presets (updated March 2026) */
export const BANK_RATES = [
  {
    id: "attijariwafa",
    name: "Attijariwafa Bank",
    shortName: "Attijari",
    logoSlug: "attijariwafa",
    fixedRate: 0.0459,
    variableRate: 0.0445,
    maxDurationYears: 25,
    maxAmountMAD: 5_000_000,
    mreEligible: true,
    applyUrl: "https://www.attijariwafabank.com/fr/particuliers/credits/credit-immobilier",
    color: "#E31837",
  },
  {
    id: "bcp",
    name: "Banque Centrale Populaire",
    shortName: "BCP",
    logoSlug: "bcp",
    fixedRate: 0.0465,
    variableRate: 0.0450,
    maxDurationYears: 25,
    maxAmountMAD: 6_000_000,
    mreEligible: true,
    applyUrl: "https://www.gbp.ma/fr/particuliers/credit-immobilier",
    color: "#009B3A",
  },
  {
    id: "bmce",
    name: "Bank of Africa (BMCE)",
    shortName: "BOA",
    logoSlug: "bmce",
    fixedRate: 0.0470,
    variableRate: 0.0455,
    maxDurationYears: 20,
    maxAmountMAD: 4_000_000,
    mreEligible: true,
    applyUrl: "https://www.banqueofafrica.com/fr/particuliers/credits/immobilier",
    color: "#0055A4",
  },
  {
    id: "cih",
    name: "CIH Bank",
    shortName: "CIH",
    logoSlug: "cih",
    fixedRate: 0.0480,
    variableRate: 0.0465,
    maxDurationYears: 25,
    maxAmountMAD: 3_500_000,
    mreEligible: true,
    applyUrl: "https://www.cihbank.ma/fr/particuliers/credits/credit-immobilier",
    color: "#00A651",
  },
  {
    id: "bmci",
    name: "BMCI (BNP Paribas)",
    shortName: "BMCI",
    logoSlug: "bmci",
    fixedRate: 0.0485,
    variableRate: 0.0470,
    maxDurationYears: 20,
    maxAmountMAD: 5_000_000,
    mreEligible: false,
    applyUrl: "https://www.bmci.ma/fr/particuliers/credits/credit-immobilier",
    color: "#00965E",
  },
  {
    id: "sgm",
    name: "Société Générale Maroc",
    shortName: "SG Maroc",
    logoSlug: "sgm",
    fixedRate: 0.0490,
    variableRate: 0.0475,
    maxDurationYears: 20,
    maxAmountMAD: 4_500_000,
    mreEligible: false,
    applyUrl: "https://www.sgmaroc.com/fr/particuliers/credits/immobilier",
    color: "#E2001A",
  },
  {
    id: "cdm",
    name: "Crédit du Maroc",
    shortName: "CDM",
    logoSlug: "cdm",
    fixedRate: 0.0500,
    variableRate: 0.0485,
    maxDurationYears: 20,
    maxAmountMAD: 3_000_000,
    mreEligible: true,
    applyUrl: "https://www.creditdumaroc.ma/fr/particuliers/credits/credit-immobilier",
    color: "#004899",
  },
  {
    id: "cfg",
    name: "CFG Bank",
    shortName: "CFG",
    logoSlug: "cfg",
    fixedRate: 0.0475,
    variableRate: 0.0460,
    maxDurationYears: 25,
    maxAmountMAD: 10_000_000,
    mreEligible: true,
    applyUrl: "https://www.cfgbank.com/fr/particuliers/credits/immobilier",
    color: "#6B21A8",
  },
] as const;

export type BankRate = (typeof BANK_RATES)[number];

/** Average market rate across all banks */
export const MARKET_AVERAGE_RATE =
  BANK_RATES.reduce((acc, b) => acc + b.fixedRate, 0) / BANK_RATES.length;

/** Currency conversion rates (approximate, update via API in production) */
export const CURRENCY_RATES: Record<string, number> = {
  MAD: 1,
  EUR: 0.092,  // 1 MAD ≈ 0.092 EUR
  USD: 0.099,  // 1 MAD ≈ 0.099 USD
};

export function convertCurrency(amountMAD: number, toCurrency: string): number {
  const rate = CURRENCY_RATES[toCurrency] ?? 1;
  return amountMAD * rate;
}

export function formatCurrency(
  amount: number,
  currency: string,
  locale = "fr-MA"
): string {
  const symbols: Record<string, string> = {
    MAD: "DH",
    EUR: "€",
    USD: "$",
  };

  if (currency === "MAD") {
    return `${Math.round(amount).toLocaleString("fr-MA")} ${symbols.MAD}`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}
