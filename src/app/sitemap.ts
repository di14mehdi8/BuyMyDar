import { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const baseUrl = "https://buymydar.com";
const now = new Date("2026-04-05");

const MRE_COUNTRIES = [
  "france",
  "espagne",
  "canada",
  "belgique",
  "italie",
  "pays-bas",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}`])),
      },
    });

    // Guide
    entries.push({
      url: `${baseUrl}/${locale}/guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/guide`])),
      },
    });

    // Mourabaha
    entries.push({
      url: `${baseUrl}/${locale}/mourabaha`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/mourabaha`])),
      },
    });

    // MRE index
    entries.push({
      url: `${baseUrl}/${locale}/mre`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/mre`])),
      },
    });

    // MRE country pages
    for (const country of MRE_COUNTRIES) {
      entries.push({
        url: `${baseUrl}/${locale}/mre/${country}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/mre/${country}`])
          ),
        },
      });
    }

    // Contact / About / Legal / Privacy
    for (const page of ["contact", "about", "legal", "privacy"]) {
      entries.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.4,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/${page}`])),
        },
      });
    }
  }

  return entries;
}
