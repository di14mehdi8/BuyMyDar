import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { HeroSection } from "@/components/sections/HeroSection";
import { HomeTabs }    from "@/components/layout/HomeTabs";
import { JsonLd }      from "@/components/seo/JsonLd";

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
      <HomeTabs lang={lang} dict={dict} />
    </>
  );
}
