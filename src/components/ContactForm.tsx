"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { CheckCircle2 } from "lucide-react";

const WEB3FORMS_KEY = "e762052a-f003-4565-9792-e5b8abae9495";

const CONTENT = {
  fr: {
    title: "Parlez-nous de votre projet",
    subtitle: "On vous répond sous 24h.",
    name: "Nom complet",
    namePlaceholder: "Votre nom",
    email: "Email",
    emailPlaceholder: "votre@email.com",
    phone: "Téléphone",
    phonePlaceholder: "+33 6 12 34 56 78",
    contactNote: "Au moins un : email ou téléphone",
    profile: "Votre profil",
    profileOptions: [
      { value: "resident", label: "Résident Maroc" },
      { value: "mre_europe", label: "MRE — Europe" },
      { value: "mre_namerica", label: "MRE — Amérique du Nord" },
      { value: "mre_other", label: "MRE — Autre pays" },
    ],
    stage: "Où en êtes-vous dans votre projet ?",
    stageOptions: [
      { value: "looking", label: "Je me renseigne" },
      { value: "found", label: "J'ai trouvé un bien" },
      { value: "negotiating", label: "Je suis en négociation" },
      { value: "financing", label: "Je cherche un financement" },
      { value: "closing", label: "Je signe bientôt" },
    ],
    source: "Comment avez-vous connu BuyMyDar ?",
    sourceOptions: [
      { value: "instagram", label: "Instagram" },
      { value: "facebook", label: "Facebook" },
      { value: "google", label: "Google" },
      { value: "word_of_mouth", label: "Bouche à oreille" },
      { value: "other", label: "Autre" },
    ],
    message: "Qu'aimeriez-vous savoir ? Comment pouvons-nous vous aider ?",
    messagePlaceholder: "Décrivez votre projet, vos questions, ou ce dont vous avez besoin…",
    submit: "Envoyer ma demande",
    success: "Merci ! On vous répond sous 24h.",
    errorContact: "Veuillez renseigner votre email ou votre téléphone.",
    errorGeneric: "Une erreur est survenue. Réessayez ou contactez-nous directement.",
    required: "Champ requis",
  },
  en: {
    title: "Tell us about your project",
    subtitle: "We'll get back to you within 24h.",
    name: "Full name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone",
    phonePlaceholder: "+1 514 123 4567",
    contactNote: "At least one: email or phone",
    profile: "Your profile",
    profileOptions: [
      { value: "resident", label: "Morocco resident" },
      { value: "mre_europe", label: "MRE — Europe" },
      { value: "mre_namerica", label: "MRE — North America" },
      { value: "mre_other", label: "MRE — Other country" },
    ],
    stage: "Where are you in your home buying journey?",
    stageOptions: [
      { value: "looking", label: "Just looking" },
      { value: "found", label: "Found a property" },
      { value: "negotiating", label: "In negotiation" },
      { value: "financing", label: "Looking for financing" },
      { value: "closing", label: "Closing soon" },
    ],
    source: "How did you find BuyMyDar?",
    sourceOptions: [
      { value: "instagram", label: "Instagram" },
      { value: "facebook", label: "Facebook" },
      { value: "google", label: "Google" },
      { value: "word_of_mouth", label: "Word of mouth" },
      { value: "other", label: "Other" },
    ],
    message: "What would you like to know? What help do you need?",
    messagePlaceholder: "Describe your project, your questions, or what you need…",
    submit: "Submit my request",
    success: "Thank you! We'll get back to you within 24h.",
    errorContact: "Please provide your email or phone number.",
    errorGeneric: "Something went wrong. Please try again.",
    required: "Required",
  },
  ar: {
    title: "أخبرنا عن مشروعك",
    subtitle: "سنرد عليك خلال 24 ساعة.",
    name: "الاسم الكامل",
    namePlaceholder: "اسمك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "بريدك@الإلكتروني.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "+212 6 12 34 56 78",
    contactNote: "يرجى إدخال البريد الإلكتروني أو الهاتف على الأقل",
    profile: "ملفك الشخصي",
    profileOptions: [
      { value: "resident", label: "مقيم بالمغرب" },
      { value: "mre_europe", label: "مغترب — أوروبا" },
      { value: "mre_namerica", label: "مغترب — أمريكا الشمالية" },
      { value: "mre_other", label: "مغترب — دولة أخرى" },
    ],
    stage: "أين أنت في مشروع شراء منزلك؟",
    stageOptions: [
      { value: "looking", label: "أبحث وأستكشف" },
      { value: "found", label: "وجدت عقاراً" },
      { value: "negotiating", label: "في مرحلة التفاوض" },
      { value: "financing", label: "أبحث عن تمويل" },
      { value: "closing", label: "سأوقع قريباً" },
    ],
    source: "كيف عرفت عن BuyMyDar؟",
    sourceOptions: [
      { value: "instagram", label: "إنستغرام" },
      { value: "facebook", label: "فيسبوك" },
      { value: "google", label: "جوجل" },
      { value: "word_of_mouth", label: "توصية من شخص" },
      { value: "other", label: "أخرى" },
    ],
    message: "ماذا تريد أن تعرف؟ كيف يمكننا مساعدتك؟",
    messagePlaceholder: "صف مشروعك وأسئلتك أو ما تحتاجه…",
    submit: "إرسال طلبي",
    success: "شكراً! سنرد عليك خلال 24 ساعة.",
    errorContact: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف.",
    errorGeneric: "حدث خطأ. يرجى المحاولة مجدداً.",
    required: "مطلوب",
  },
};

interface Props {
  lang: Locale;
}

export function ContactForm({ lang }: Props) {
  const t = CONTENT[lang];

  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    profile: "",
    stage: "",
    source: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function set(key: keyof typeof fields, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!fields.name.trim()) errs.name = t.required;
    if (!fields.email.trim() && !fields.phone.trim()) {
      errs.contact = t.errorContact;
    }
    if (!fields.profile) errs.profile = t.required;
    if (!fields.stage) errs.stage = t.required;
    if (!fields.source) errs.source = t.required;
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStatus("submitting");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `BuyMyDar — Nouveau contact (${lang.toUpperCase()})`,
          from_name: "BuyMyDar Contact",
          name: fields.name,
          email: fields.email || "(no email)",
          phone: fields.phone || "(no phone)",
          profile: fields.profile,
          stage: fields.stage,
          source: fields.source,
          message: fields.message,
          lang,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        console.error("Web3Forms error:", data);
        setStatus("error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        <p className="text-lg font-semibold text-slate-900">{t.success}</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition";
  const selectClass = `${inputClass} bg-white`;
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label className={labelClass}>{t.name} *</label>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder={t.namePlaceholder}
          className={inputClass}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      {/* Email + Phone side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t.email}</label>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder={t.emailPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t.phone}</label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder={t.phonePlaceholder}
            className={inputClass}
          />
        </div>
      </div>
      {errors.contact && <p className={errorClass}>{errors.contact}</p>}
      <p className="text-xs text-slate-400 -mt-3">{t.contactNote}</p>

      {/* Profile */}
      <div>
        <label className={labelClass}>{t.profile} *</label>
        <select
          value={fields.profile}
          onChange={(e) => set("profile", e.target.value)}
          className={selectClass}
        >
          <option value="" disabled>—</option>
          {t.profileOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors.profile && <p className={errorClass}>{errors.profile}</p>}
      </div>

      {/* Stage */}
      <div>
        <label className={labelClass}>{t.stage} *</label>
        <select
          value={fields.stage}
          onChange={(e) => set("stage", e.target.value)}
          className={selectClass}
        >
          <option value="" disabled>—</option>
          {t.stageOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors.stage && <p className={errorClass}>{errors.stage}</p>}
      </div>

      {/* Source */}
      <div>
        <label className={labelClass}>{t.source} *</label>
        <select
          value={fields.source}
          onChange={(e) => set("source", e.target.value)}
          className={selectClass}
        >
          <option value="" disabled>—</option>
          {t.sourceOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors.source && <p className={errorClass}>{errors.source}</p>}
      </div>

      {/* Free text */}
      <div>
        <label className={labelClass}>{t.message}</label>
        <textarea
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder={t.messagePlaceholder}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">{t.errorGeneric}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity disabled:opacity-60"
        style={{ backgroundColor: "#1E3A6E" }}
      >
        {status === "submitting" ? "…" : t.submit}
      </button>
    </form>
  );
}
