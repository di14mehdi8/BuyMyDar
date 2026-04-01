export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  ar: "🇲🇦",
  en: "🇬🇧",
};

// RTL locales
export const rtlLocales: Locale[] = ["ar"];
export const isRTL = (locale: Locale) => rtlLocales.includes(locale);

// Hreflang mapping for SEO — locale → hreflang tag
export const hreflangMap: Record<Locale, string[]> = {
  fr: ["fr-MA", "fr-FR", "fr-BE", "fr-CA"],
  ar: ["ar-MA"],
  en: ["en-US", "en-GB", "en-CA", "en-AU"],
};
