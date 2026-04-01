import { BANK_RATES, MARKET_AVERAGE_RATE, BAM_DATA_SOURCES } from "@/lib/mortgage/calculator";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface JsonLdProps {
  lang: Locale;
  dict: Dictionary;
}

/** Renders all JSON-LD structured data for the homepage */
export function JsonLd({ lang, dict }: JsonLdProps) {
  const baseUrl = "https://buymydar.ma";

  // FinancialProduct schema for each bank
  const financialProducts = BANK_RATES.map((bank) => ({
    "@type": "LoanOrCredit",
    "@id": `${baseUrl}/${lang}/banks/${bank.id}`,
    name: `Crédit Immobilier ${bank.name}`,
    description: `Prêt immobilier ${bank.name} — taux fixe ${(bank.fixedRate * 100).toFixed(2)}%, durée max ${bank.maxDurationYears} ans`,
    provider: {
      "@type": "BankOrCreditUnion",
      name: bank.name,
      url: bank.applyUrl,
    },
    amount: {
      "@type": "MonetaryAmount",
      maxValue: bank.maxAmountMAD,
      currency: "MAD",
    },
    loanTerm: {
      "@type": "QuantitativeValue",
      value: bank.maxDurationYears,
      unitCode: "ANN",
    },
    annualPercentageRate: {
      "@type": "QuantitativeValue",
      value: (bank.fixedRate * 100).toFixed(2),
      unitCode: "P1",
    },
    areaServed: {
      "@type": "Country",
      name: "Morocco",
      sameAs: "https://www.wikidata.org/wiki/Q1028",
    },
  }));

  // FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  // WebSite schema with sitelinks search
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BuyMyDar",
    url: baseUrl,
    description:
      "Plateforme de comparaison des taux immobiliers marocains pour les résidents et les MRE.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${lang}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "BuyMyDar",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  // FinancialService schema for BuyMyDar itself
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "BuyMyDar",
    url: baseUrl,
    description:
      "Service de comparaison de crédits immobiliers au Maroc pour les résidents et les Marocains Résidant à l'Étranger (MRE).",
    areaServed: [
      { "@type": "Country", name: "Morocco" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Spain" },
      { "@type": "Country", name: "Canada" },
    ],
    serviceType: "Mortgage Comparison",
    currenciesAccepted: "MAD, EUR, USD",
    availableLanguage: ["French", "Arabic", "English"],
  };

  // Aggregate offer for financial products
  const aggregateSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top 8 Taux Immobiliers Maroc 2026`,
    description: `Comparaison des meilleurs taux immobiliers au Maroc. Taux moyen : ${(MARKET_AVERAGE_RATE * 100).toFixed(2)}%`,
    numberOfItems: BANK_RATES.length,
    itemListElement: financialProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: p,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }}
      />
    </>
  );
}
