import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "ar" ? "الشروط القانونية — BuyMyDar" :
      lang === "en" ? "Legal Notice — BuyMyDar" :
      "Mentions légales — BuyMyDar",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `https://buymydar.com/${lang}/legal`,
    },
  };
}

const CONTENT = {
  fr: {
    breadcrumb: "Mentions légales",
    title: "Mentions légales",
    updated: "Dernière mise à jour : avril 2026",
    sections: [
      {
        title: "Éditeur du site",
        body: `BuyMyDar est une plateforme d'information et de comparaison de crédits immobiliers au Maroc.
Responsable de la publication : BuyMyDar
Contact : via le formulaire de contact sur buymydar.com`,
      },
      {
        title: "Hébergement",
        body: "Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.",
      },
      {
        title: "Propriété intellectuelle",
        body: "L'ensemble du contenu présent sur BuyMyDar (textes, graphiques, logos, données) est la propriété exclusive de BuyMyDar et est protégé par les lois en vigueur sur la propriété intellectuelle. Toute reproduction partielle ou totale est interdite sans autorisation préalable.",
      },
      {
        title: "Responsabilité",
        body: "Les informations et simulations présentées sur ce site ont un caractère purement indicatif. BuyMyDar ne garantit pas l'exactitude, l'exhaustivité ou l'actualité des données. Il ne s'agit pas d'un conseil financier agréé. L'utilisateur est seul responsable de l'utilisation qu'il fait des informations fournies.",
      },
      {
        title: "Données personnelles",
        body: "Les données personnelles collectées via le formulaire de contact ou l'alerte taux sont utilisées uniquement pour répondre aux demandes des utilisateurs. Elles ne sont jamais vendues à des tiers. Pour exercer vos droits d'accès, de rectification ou de suppression, contactez-nous via le formulaire disponible sur le site.",
      },
      {
        title: "Cookies",
        body: "Ce site utilise des cookies d'analyse (Google Analytics) uniquement avec votre consentement explicite. Vous pouvez modifier vos préférences à tout moment via la bannière de consentement.",
      },
      {
        title: "Droit applicable",
        body: "Les présentes mentions légales sont régies par le droit marocain. En cas de litige, les tribunaux de Casablanca sont seuls compétents.",
      },
    ],
  },
  en: {
    breadcrumb: "Legal Notice",
    title: "Legal Notice",
    updated: "Last updated: April 2026",
    sections: [
      {
        title: "Publisher",
        body: `BuyMyDar is an information and mortgage comparison platform for Morocco.
Publication manager: BuyMyDar
Contact: via the contact form at buymydar.com`,
      },
      {
        title: "Hosting",
        body: "This site is hosted by Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, United States.",
      },
      {
        title: "Intellectual property",
        body: "All content on BuyMyDar (text, graphics, logos, data) is the exclusive property of BuyMyDar and is protected by applicable intellectual property laws. Any partial or total reproduction is prohibited without prior authorisation.",
      },
      {
        title: "Liability",
        body: "The information and simulations presented on this site are purely indicative. BuyMyDar does not guarantee the accuracy, completeness, or timeliness of the data. This does not constitute licensed financial advice. The user is solely responsible for how they use the information provided.",
      },
      {
        title: "Personal data",
        body: "Personal data collected via the contact form or rate alert are used solely to respond to user requests. They are never sold to third parties. To exercise your rights of access, correction, or deletion, contact us via the form on the site.",
      },
      {
        title: "Cookies",
        body: "This site uses analytics cookies (Google Analytics) only with your explicit consent. You can change your preferences at any time via the consent banner.",
      },
      {
        title: "Applicable law",
        body: "This legal notice is governed by Moroccan law. In the event of a dispute, the courts of Casablanca have sole jurisdiction.",
      },
    ],
  },
  ar: {
    breadcrumb: "الشروط القانونية",
    title: "الشروط القانونية",
    updated: "آخر تحديث: أبريل 2026",
    sections: [
      {
        title: "ناشر الموقع",
        body: `BuyMyDar منصة معلومات ومقارنة للقروض العقارية في المغرب.
المسؤول عن النشر: BuyMyDar
التواصل: عبر نموذج الاتصال على buymydar.com`,
      },
      {
        title: "الاستضافة",
        body: "يُستضاف هذا الموقع من قِبل Vercel Inc.، 340 Pine Street, Suite 701, San Francisco, CA 94104, الولايات المتحدة الأمريكية.",
      },
      {
        title: "الملكية الفكرية",
        body: "جميع محتويات BuyMyDar (نصوص، رسومات، شعارات، بيانات) هي ملكية حصرية لـ BuyMyDar وتخضع لقوانين الملكية الفكرية المعمول بها. يُحظر أي استنساخ جزئي أو كلي دون إذن مسبق.",
      },
      {
        title: "المسؤولية",
        body: "المعلومات والمحاكاة المعروضة على هذا الموقع ذات طابع إرشادي بحت. لا تضمن BuyMyDar دقة البيانات أو اكتمالها أو حداثتها. لا يُعدّ ذلك استشارة مالية معتمدة. المستخدم وحده مسؤول عن كيفية استخدامه للمعلومات المقدَّمة.",
      },
      {
        title: "البيانات الشخصية",
        body: "تُستخدم البيانات الشخصية المجمَّعة عبر نموذج الاتصال أو تنبيه الأسعار فقط للردّ على طلبات المستخدمين، ولا تُباع أبداً لأطراف ثالثة. للاستفادة من حقوقك في الوصول والتصحيح والحذف، تواصل معنا عبر النموذج المتاح على الموقع.",
      },
      {
        title: "ملفات تعريف الارتباط",
        body: "يستخدم هذا الموقع ملفات تعريف الارتباط التحليلية (Google Analytics) فقط بموافقتك الصريحة. يمكنك تعديل تفضيلاتك في أي وقت عبر شريط الموافقة.",
      },
      {
        title: "القانون المطبّق",
        body: "تخضع هذه الشروط القانونية للقانون المغربي. في حال النزاع، تختص محاكم الدار البيضاء حصراً بالنظر فيه.",
      },
    ],
  },
};

export default async function LegalPage({ params }: Props) {
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

      <h1 className="text-3xl font-bold text-slate-900 mb-2">{C.title}</h1>
      <p className="text-xs text-slate-400 mb-10">{C.updated}</p>

      <div className="space-y-8">
        {C.sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-bold text-slate-900 mb-2">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
