import { notFound } from "next/navigation";
import { locales, type Locale, hreflangMap } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Home, Target, Eye, Heart } from "lucide-react";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hreflangAlternates: Record<string, string> = {};
  for (const [locale, tags] of Object.entries(hreflangMap)) {
    for (const tag of tags) {
      hreflangAlternates[tag] = `https://buymydar.com/${locale}/about`;
    }
  }
  hreflangAlternates["x-default"] = "https://buymydar.com/fr/about";
  return {
    title:
      lang === "ar" ? "من نحن — BuyMyDar" :
      lang === "en" ? "About Us — BuyMyDar" :
      "À propos — BuyMyDar",
    alternates: {
      canonical: `https://buymydar.com/${lang}/about`,
      languages: hreflangAlternates,
    },
  };
}

const CONTENT = {
  fr: {
    breadcrumb: "À propos",
    label: "Notre histoire",
    title: "Une plateforme pensée pour simplifier l'accès au crédit immobilier au Maroc",
    intro: "BuyMyDar est né d'un constat simple : trop de Marocains — résidents ou à l'étranger — peinent à comparer les offres de crédit immobilier et à comprendre les conditions des banques locales. Nous avons voulu y remédier.",
    mission: {
      icon: Target,
      title: "Notre mission",
      body: "Rendre la comparaison de crédits immobiliers au Maroc accessible, transparente et gratuite pour tous — résidents, MRE, primo-accédants ou investisseurs.",
    },
    vision: {
      icon: Eye,
      title: "Notre vision",
      body: "Devenir la référence incontournable pour tout projet immobilier au Maroc, en offrant des outils simples, des données fiables et un accompagnement humain.",
    },
    values: {
      icon: Heart,
      title: "Nos valeurs",
      body: "Transparence, accessibilité et indépendance. Nous ne percevons aucune rémunération des banques pour les classer — nos comparatifs sont basés uniquement sur les taux officiels publiés.",
    },
    disclaimer: "BuyMyDar est une plateforme d'information indépendante. Les simulations présentées sont indicatives et ne constituent pas un conseil financier agréé. Consultez toujours votre banque ou un conseiller certifié avant toute décision.",
    contact_cta: "Une question ? Contactez-nous",
  },
  en: {
    breadcrumb: "About",
    label: "Our story",
    title: "A platform built to simplify mortgage access in Morocco",
    intro: "BuyMyDar was born from a simple observation: too many Moroccans — residents and those living abroad — struggle to compare mortgage offers and understand the conditions of local banks. We set out to fix that.",
    mission: {
      icon: Target,
      title: "Our mission",
      body: "Make mortgage comparison in Morocco accessible, transparent, and free for everyone — residents, MREs, first-time buyers, and investors.",
    },
    vision: {
      icon: Eye,
      title: "Our vision",
      body: "Become the go-to reference for any property project in Morocco, offering simple tools, reliable data, and a human touch.",
    },
    values: {
      icon: Heart,
      title: "Our values",
      body: "Transparency, accessibility, and independence. We receive no payment from banks for ranking them — our comparisons are based solely on officially published rates.",
    },
    disclaimer: "BuyMyDar is an independent information platform. Simulations shown are indicative and do not constitute licensed financial advice. Always consult your bank or a certified advisor before making any decision.",
    contact_cta: "Have a question? Contact us",
  },
  ar: {
    breadcrumb: "من نحن",
    label: "قصتنا",
    title: "منصة مصممة لتبسيط الوصول إلى القروض العقارية في المغرب",
    intro: "وُلدت BuyMyDar من ملاحظة بسيطة: كثير من المغاربة — المقيمون وأبناء الجاليات بالخارج — يجدون صعوبة في مقارنة عروض القروض العقارية وفهم شروط البنوك المحلية. أردنا معالجة ذلك.",
    mission: {
      icon: Target,
      title: "مهمتنا",
      body: "جعل مقارنة القروض العقارية في المغرب متاحةً وشفافةً ومجانيةً للجميع — المقيمين والمغاربة بالخارج والمشترين الأوائل والمستثمرين.",
    },
    vision: {
      icon: Eye,
      title: "رؤيتنا",
      body: "أن نصبح المرجع الأول لأي مشروع عقاري في المغرب، من خلال تقديم أدوات بسيطة وبيانات موثوقة ودعم إنساني.",
    },
    values: {
      icon: Heart,
      title: "قيمنا",
      body: "الشفافية والإتاحة والاستقلالية. لا نتلقى أي مقابل من البنوك لترتيبها — مقارناتنا مبنية فقط على الأسعار الرسمية المنشورة.",
    },
    disclaimer: "BuyMyDar منصة معلومات مستقلة. المحاكاة المعروضة استرشادية ولا تمثل استشارة مالية معتمدة. استشر دائماً بنكك أو مستشاراً معتمداً قبل اتخاذ أي قرار.",
    contact_cta: "هل لديك سؤال؟ تواصل معنا",
  },
};

export default async function AboutPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  if (!locales.includes(lang)) notFound();

  const C = CONTENT[lang] ?? CONTENT.fr;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          {lang === "ar" ? "الرئيسية" : lang === "en" ? "Home" : "Accueil"}
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{C.breadcrumb}</span>
      </nav>

      <p className="section-label mb-3">{C.label}</p>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{C.title}</h1>
      <p className="text-lg text-slate-500 leading-relaxed mb-12">{C.intro}</p>

      <div className="space-y-6 mb-12">
        {([C.mission, C.vision, C.values] as typeof C.mission[]).map((block) => {
          const Icon = block.icon;
          return (
            <div key={block.title} className="card p-6 flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 mb-2">{block.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{block.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 text-xs text-slate-500 leading-relaxed mb-8">
        {C.disclaimer}
      </div>

      <Link
        href={`/${lang}/contact`}
        className="inline-flex items-center gap-2 btn-primary px-6 py-3"
      >
        {C.contact_cta}
      </Link>
    </main>
  );
}
