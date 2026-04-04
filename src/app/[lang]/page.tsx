import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { HeroSection } from "@/components/sections/HeroSection";
import { HomeTabs }    from "@/components/layout/HomeTabs";
import { JsonLd }      from "@/components/seo/JsonLd";
import { AdSlot }      from "@/components/ads/AdSlot";

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
      <JsonLd lang={lang} dict={dict} />

      <HeroSection lang={lang} dict={dict.hero} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdSlot slotId="1234567890" format="leaderboard" label={dict.ads.label} />
      </div>

      <HomeTabs lang={lang} dict={dict} />
    </>
  );
}
