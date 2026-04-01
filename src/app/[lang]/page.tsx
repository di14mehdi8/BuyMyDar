import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { HeroSection }      from "@/components/sections/HeroSection";
import { MortgageSimulator } from "@/components/simulator/MortgageSimulator";
import { BankDirectory }    from "@/components/sections/BankDirectory";
import { InsightsGrid }     from "@/components/sections/InsightsGrid";
import { MRESection }       from "@/components/sections/MRESection";
import { FAQSection }       from "@/components/sections/FAQSection";
import { JsonLd }           from "@/components/seo/JsonLd";
import { AdSlot }           from "@/components/ads/AdSlot";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  if (!locales.includes(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      {/* Structured data for SEO / AEO */}
      <JsonLd lang={lang} dict={dict} />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <HeroSection lang={lang} dict={dict.hero} />

      {/* ── LEADERBOARD AD (below hero) ───────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdSlot slotId="1234567890" format="leaderboard" label={dict.ads.label} />
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-24">

        {/* Simulator */}
        <MortgageSimulator lang={lang} dict={dict.simulator} />

        {/* Rectangle ad — between simulator and bank directory */}
        <div className="flex justify-center">
          <AdSlot slotId="0987654321" format="rectangle" label={dict.ads.label} />
        </div>

        {/* Bank Directory */}
        <BankDirectory lang={lang} dict={dict.banks} />

        {/* MRE Section */}
        <MRESection lang={lang} dict={dict.mre_section} />

        {/* Banner ad — between MRE and insights */}
        <AdSlot slotId="1122334455" format="banner" label={dict.ads.label} />

        {/* Insights / Blog Grid */}
        <InsightsGrid lang={lang} dict={dict.insights} />

        {/* FAQ — critical for AEO */}
        <FAQSection dict={dict.faq} />

        {/* Final rectangle ad */}
        <div className="flex justify-center">
          <AdSlot slotId="5544332211" format="rectangle" label={dict.ads.label} />
        </div>
      </div>
    </>
  );
}
