import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "ar"
        ? "تواصل معنا — BuyMyDar"
        : lang === "en"
        ? "Contact Us — BuyMyDar"
        : "Nous contacter — BuyMyDar",
    description:
      lang === "ar"
        ? "أخبرنا عن مشروعك العقاري في المغرب. سنرد عليك خلال 24 ساعة."
        : lang === "en"
        ? "Tell us about your Moroccan property project. We'll get back to you within 24h."
        : "Parlez-nous de votre projet immobilier au Maroc. On vous répond sous 24h.",
  };
}

const HEADING = {
  fr: { breadcrumb: "Accueil", page: "Contact", title: "Parlons de votre projet", sub: "Remplissez le formulaire ci-dessous — c'est rapide et sans engagement." },
  en: { breadcrumb: "Home", page: "Contact", title: "Let's talk about your project", sub: "Fill in the form below — quick and no commitment." },
  ar: { breadcrumb: "الرئيسية", page: "تواصل معنا", title: "لنتحدث عن مشروعك", sub: "املأ النموذج أدناه — سريع وبدون أي التزام." },
};

export default async function ContactPage({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  if (!locales.includes(lang)) notFound();

  const h = HEADING[lang];

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link href={`/${lang}`} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" /> {h.breadcrumb}
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{h.page}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{h.title}</h1>
        <p className="text-slate-500 text-sm">{h.sub}</p>
      </div>

      <div className="card p-6 sm:p-8">
        <ContactForm lang={lang} />
      </div>
    </main>
  );
}
