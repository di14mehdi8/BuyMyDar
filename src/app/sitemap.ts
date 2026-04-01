import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { BANK_RATES } from "@/lib/mortgage/calculator";

const baseUrl = "https://buymydar.ma";

// Blog slugs — in production, fetch from CMS
const BLOG_SLUGS = [
  "ouvrir-compte-dirham-convertible-depuis-france",
  "taux-fixe-vs-variable-maroc-2026",
  "dossier-credit-mre-documents-2026",
  "rachat-credit-immobilier-maroc-guide",
  "combien-emprunter-salaire-3000-euros",
  "attijariwafa-taux-immobilier-2026",
  "bcp-credit-immobilier-mre",
  "cih-bank-credit-immobilier",
  "bmce-bank-of-africa-immobilier",
  "cfg-bank-financement-immobilier",
  "simulation-credit-200000-euros-maroc",
  "simulation-credit-1000000-mad",
  "appartement-casablanca-financement",
  "villa-marrakech-credit-immobilier",
  "terrain-rabat-financement-bancaire",
  "assurance-mrh-maroc-guide-complet",
  "frais-notaire-immobilier-maroc",
  "apport-personnel-credit-immobilier",
  "taux-endettement-maximum-maroc",
  "remboursement-anticipe-penalites-maroc",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date("2026-03-31");

  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    });

    // Bank pages
    for (const bank of BANK_RATES) {
      entries.push({
        url: `${baseUrl}/${locale}/banks/${bank.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    // Blog articles
    for (const slug of BLOG_SLUGS) {
      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    // Static pages
    for (const page of ["guide-mre", "simulator", "about", "contact"]) {
      entries.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Country-specific hreflang URLs for MRE targeting
  const mreCountries = [
    { code: "fr-fr", locale: "fr" },
    { code: "fr-ma", locale: "fr" },
    { code: "en-us", locale: "en" },
    { code: "en-gb", locale: "en" },
    { code: "ar-ma", locale: "ar" },
  ];

  for (const { code, locale } of mreCountries) {
    entries.push({
      url: `${baseUrl}/${code}/mortgage-rates-morocco`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  return entries;
}
