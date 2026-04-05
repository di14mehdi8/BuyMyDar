import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, type Locale, isRTL, hreflangMap } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { MARKET_AVERAGE_RATE } from "@/lib/mortgage/calculator";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RateTicker } from "@/components/layout/RateTicker";
import { CookieConsent } from "@/components/CookieConsent";
import "../globals.css";

const GTM_ID = "GTM-MV7BVBCP";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  const titles: Record<Locale, string> = {
    fr: "BuyMyDar — Meilleur Taux Immobilier Maroc 2026 | Crédit MRE",
    ar: "دار MRE — أفضل معدل عقاري بالمغرب ٢٠٢٦ | قرض المغاربة بالخارج",
    en: "BuyMyDar — Best Mortgage Rate Morocco 2026 | MRE Home Loan",
  };

  const descriptions: Record<Locale, string> = {
    fr: `Comparez les taux immobiliers de toutes les banques marocaines. Taux moyen du marché : ${(MARKET_AVERAGE_RATE * 100).toFixed(2)}%. Simulateur gratuit pour MRE et résidents.`,
    ar: `قارن معدلات القروض العقارية من جميع البنوك المغربية. المعدل المتوسط: ${(MARKET_AVERAGE_RATE * 100).toFixed(2)}٪. محاكي مجاني للمغاربة بالخارج والمقيمين.`,
    en: `Compare mortgage rates from all Moroccan banks. Market average: ${(MARKET_AVERAGE_RATE * 100).toFixed(2)}%. Free simulator for MREs and residents.`,
  };

  // Build hreflang alternates
  const alternates: Record<string, string> = {};
  for (const [locale, tags] of Object.entries(hreflangMap)) {
    for (const tag of tags) {
      alternates[tag] = `https://buymydar.ma/${locale}`;
    }
  }

  return {
    title: {
      default: titles[lang],
      template: "%s | BuyMyDar",
    },
    description: descriptions[lang],
    metadataBase: new URL("https://buymydar.ma"),
    alternates: {
      canonical: `/${lang}`,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      locale: lang === "ar" ? "ar_MA" : lang === "fr" ? "fr_MA" : "en_US",
      url: `https://buymydar.ma/${lang}`,
      siteName: "BuyMyDar",
      title: titles[lang],
      description: descriptions[lang],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "BuyMyDar — Morocco Mortgage Comparison",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang],
      description: descriptions[lang],
      images: ["/og-image.png"],
    },
    icons: {
      icon:             "/favicon.ico",
      shortcut:         "/favicon.ico",
      apple:            "/apple-touch-icon.png",
      other: [{ rel: "icon", type: "image/png", url: "/logo.png" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1 },
    },
    keywords:
      lang === "fr"
        ? ["crédit immobilier maroc", "taux immobilier 2026", "MRE crédit", "banque maroc simulation", "prêt immobilier MRE"]
        : lang === "ar"
        ? ["قرض عقاري المغرب", "معدل عقاري 2026", "مغاربة الخارج قرض", "بنوك المغرب"]
        : ["morocco mortgage", "home loan morocco 2026", "MRE mortgage", "moroccan bank rates"],
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;

  if (!locales.includes(lang)) notFound();

  const dict = await getDictionary(lang);
  const rtl = isRTL(lang);

  return (
    <html
      lang={lang}
      dir={rtl ? "rtl" : "ltr"}
      className={`${inter.variable} scroll-smooth`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Consent defaults — must run BEFORE GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                wait_for_update: 500
              });
              gtag('set', 'url_passthrough', true);
              gtag('set', 'ads_data_redaction', true);
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar lang={lang} dict={dict.nav} />
        <RateTicker lang={lang} dict={dict.ticker} />
        <main id="main-content">{children}</main>
        <Footer lang={lang} dict={dict.footer} />
        <CookieConsent />
      </body>
    </html>
  );
}
