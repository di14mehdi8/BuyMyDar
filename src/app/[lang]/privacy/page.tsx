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
      lang === "ar" ? "سياسة الخصوصية — BuyMyDar" :
      lang === "en" ? "Privacy Policy — BuyMyDar" :
      "Politique de confidentialité — BuyMyDar",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `https://buymydar.com/${lang}/privacy`,
    },
  };
}

const CONTENT = {
  fr: {
    breadcrumb: "Confidentialité",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : avril 2026",
    sections: [
      {
        title: "Qui sommes-nous ?",
        body: "BuyMyDar (buymydar.com) est une plateforme de comparaison de crédits immobiliers au Maroc. Nous accordons une grande importance à la protection de vos données personnelles.",
      },
      {
        title: "Données collectées",
        body: `Nous collectons uniquement les données que vous nous fournissez volontairement :

• Via le formulaire de contact : nom, e-mail, numéro de téléphone (optionnel), message.
• Via l'alerte taux : adresse e-mail et seuil de taux choisi.
• Via la navigation : données anonymisées de trafic (pages visitées, durée de session) via Google Analytics, uniquement avec votre consentement.`,
      },
      {
        title: "Finalité du traitement",
        body: `Vos données sont utilisées exclusivement pour :
• Répondre à vos demandes de contact.
• Vous notifier si les taux immobiliers atteignent votre seuil cible (alerte taux).
• Améliorer l'expérience utilisateur du site (analytics anonymisés).`,
      },
      {
        title: "Conservation des données",
        body: "Les données de contact sont conservées 12 mois maximum après le dernier échange. Les données d'alerte taux sont supprimées à votre demande ou après 24 mois d'inactivité.",
      },
      {
        title: "Partage des données",
        body: `Nous ne vendons ni ne louons vos données à des tiers. Vos données peuvent être transmises aux seuls prestataires techniques suivants, dans le cadre strict de leur mission :

• Web3Forms — traitement des formulaires de contact
• Google Analytics — analyse du trafic (uniquement avec consentement)
• Vercel — hébergement du site`,
      },
      {
        title: "Cookies",
        body: `Ce site utilise deux types de cookies :

• Cookies strictement nécessaires : mémorisation de votre choix de langue et de consentement. Ils ne nécessitent pas votre accord.
• Cookies analytiques (Google Analytics) : collecte anonymisée de données de navigation. Activés uniquement si vous cliquez sur « Accepter » dans la bannière de consentement.

Vous pouvez retirer votre consentement à tout moment en cliquant sur la bannière de cookies en bas de page.`,
      },
      {
        title: "Vos droits",
        body: `Conformément à la loi marocaine 09-08 relative à la protection des données personnelles, vous disposez des droits suivants :

• Droit d'accès à vos données
• Droit de rectification
• Droit de suppression (droit à l'oubli)
• Droit d'opposition au traitement

Pour exercer ces droits, contactez-nous via le formulaire disponible sur le site.`,
      },
      {
        title: "Modifications",
        body: "Nous nous réservons le droit de modifier cette politique de confidentialité. La date de mise à jour sera indiquée en haut de la page. Nous vous encourageons à la consulter régulièrement.",
      },
    ],
  },
  en: {
    breadcrumb: "Privacy Policy",
    title: "Privacy Policy",
    updated: "Last updated: April 2026",
    sections: [
      {
        title: "Who we are",
        body: "BuyMyDar (buymydar.com) is a mortgage comparison platform for Morocco. We take the protection of your personal data seriously.",
      },
      {
        title: "Data collected",
        body: `We only collect data that you voluntarily provide to us:

• Via the contact form: name, email, phone number (optional), message.
• Via the rate alert: email address and chosen rate threshold.
• Via browsing: anonymised traffic data (pages visited, session duration) via Google Analytics, only with your consent.`,
      },
      {
        title: "Purpose of processing",
        body: `Your data is used exclusively to:
• Respond to your contact requests.
• Notify you if mortgage rates reach your target threshold (rate alert).
• Improve the site's user experience (anonymised analytics).`,
      },
      {
        title: "Data retention",
        body: "Contact data is kept for a maximum of 12 months after the last exchange. Rate alert data is deleted upon your request or after 24 months of inactivity.",
      },
      {
        title: "Data sharing",
        body: `We do not sell or rent your data to third parties. Your data may be passed only to the following technical service providers, strictly within the scope of their role:

• Web3Forms — contact form processing
• Google Analytics — traffic analysis (only with consent)
• Vercel — site hosting`,
      },
      {
        title: "Cookies",
        body: `This site uses two types of cookies:

• Strictly necessary cookies: storing your language choice and consent preference. These do not require your agreement.
• Analytics cookies (Google Analytics): anonymised collection of browsing data. Activated only if you click "Accept" in the consent banner.

You can withdraw your consent at any time by clicking the cookie banner at the bottom of the page.`,
      },
      {
        title: "Your rights",
        body: `Under Moroccan law 09-08 on the protection of personal data, you have the following rights:

• Right of access to your data
• Right of rectification
• Right of erasure (right to be forgotten)
• Right to object to processing

To exercise these rights, contact us via the form on the site.`,
      },
      {
        title: "Changes",
        body: "We reserve the right to modify this privacy policy. The update date will be shown at the top of the page. We encourage you to review it regularly.",
      },
    ],
  },
  ar: {
    breadcrumb: "سياسة الخصوصية",
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: أبريل 2026",
    sections: [
      {
        title: "من نحن؟",
        body: "BuyMyDar (buymydar.com) منصة مقارنة للقروض العقارية في المغرب. نولي حماية بياناتك الشخصية أهمية بالغة.",
      },
      {
        title: "البيانات المجمَّعة",
        body: `نجمع فقط البيانات التي تزوّدنا بها طوعاً:

• عبر نموذج الاتصال: الاسم، البريد الإلكتروني، رقم الهاتف (اختياري)، الرسالة.
• عبر تنبيه الأسعار: عنوان البريد الإلكتروني والحدّ المُختار للسعر.
• عبر التصفح: بيانات حركة المرور المجهولة (الصفحات المُزارة، مدة الجلسة) عبر Google Analytics، بموافقتك فقط.`,
      },
      {
        title: "أغراض المعالجة",
        body: `تُستخدم بياناتك حصراً من أجل:
• الردّ على طلبات الاتصال.
• إعلامك عند بلوغ أسعار القروض العقارية الحدَّ المستهدف (تنبيه الأسعار).
• تحسين تجربة المستخدم على الموقع (تحليلات مجهولة الهوية).`,
      },
      {
        title: "مدة الاحتفاظ بالبيانات",
        body: "تُحتفظ ببيانات الاتصال لمدة أقصاها 12 شهراً بعد آخر تبادل. تُحذف بيانات تنبيه الأسعار بناءً على طلبك أو بعد 24 شهراً من عدم النشاط.",
      },
      {
        title: "مشاركة البيانات",
        body: `لا نبيع بياناتك ولا نؤجّرها لأطراف ثالثة. يمكن أن تُنقل بياناتك فقط إلى مزوّدي الخدمات التقنيين التاليين، في النطاق الصارم لمهمتهم:

• Web3Forms — معالجة نماذج الاتصال
• Google Analytics — تحليل حركة المرور (بموافقتك فقط)
• Vercel — استضافة الموقع`,
      },
      {
        title: "ملفات تعريف الارتباط",
        body: `يستخدم هذا الموقع نوعين من ملفات تعريف الارتباط:

• ملفات ضرورية تماماً: لحفظ اختيار لغتك وتفضيلات موافقتك. لا تستلزم موافقتك.
• ملفات تحليلية (Google Analytics): جمع مجهول لبيانات التصفح. تُفعَّل فقط إذا نقرت على "قبول" في شريط الموافقة.

يمكنك سحب موافقتك في أي وقت بالنقر على شريط ملفات تعريف الارتباط في أسفل الصفحة.`,
      },
      {
        title: "حقوقك",
        body: `وفقاً للقانون المغربي 09-08 المتعلق بحماية البيانات الشخصية، تتمتع بالحقوق التالية:

• حق الوصول إلى بياناتك
• حق التصحيح
• حق المحو (الحق في النسيان)
• حق الاعتراض على المعالجة

لممارسة هذه الحقوق، تواصل معنا عبر النموذج المتاح على الموقع.`,
      },
      {
        title: "التعديلات",
        body: "نحتفظ بحق تعديل سياسة الخصوصية هذه. سيُشار إلى تاريخ التحديث في أعلى الصفحة. نشجّعك على مراجعتها بانتظام.",
      },
    ],
  },
};

export default async function PrivacyPage({ params }: Props) {
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
