import Link from "next/link";
import Image from "next/image";
import { Linkedin, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

interface FooterProps {
  lang: Locale;
  dict: {
    tagline: string;
    disclaimer: string;
    cols: {
      simulator: string;
      links: {
        simulator: string;
        guide: string;
        mre: string;
        mourabaha: string;
      };
    };
    links: Record<string, string>;
    copyright: string;
  };
}

export function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: dict.cols.simulator,
      links: [
        { label: dict.cols.links.simulator, href: `/${lang}#simulator` },
        { label: dict.cols.links.guide,     href: `/${lang}/guide` },
        { label: dict.cols.links.mre,       href: `/${lang}/mre` },
        { label: dict.cols.links.mourabaha, href: `/${lang}/mourabaha` },
      ],
    },
    {
      title: "BuyMyDar",
      links: Object.entries(dict.links).map(([key, label]) => ({
        label,
        href:
          key === "contact"  ? `/${lang}/contact`  :
          key === "legal"    ? `/${lang}/legal`     :
          key === "privacy"  ? `/${lang}/privacy`   :
          key === "sitemap"  ? `/${lang}/sitemap`   :
          `/${lang}/about`,
      })),
    },
  ];

  return (
    <footer className="text-white mt-24" style={{ backgroundColor: "#09152A" }} role="contentinfo">
      {/* Top wave separator */}
      <div className="overflow-hidden leading-[0] -mb-px">
        <svg viewBox="0 0 1440 40" className="w-full h-10 fill-[#F7F8FA]">
          <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2 space-y-5">
            <Link href={`/${lang}`} className="flex items-center gap-2.5 group w-fit">
              <Image
                src="/logo-white.png"
                alt="BuyMyDar"
                width={36}
                height={36}
                className="h-9 w-auto object-contain group-hover:opacity-80 transition-opacity"
              />
              <span className="font-bold text-xl text-white">
                Buy<span style={{ color: "#8EA9F5" }}>My</span>Dar
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {dict.tagline}
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/buymydar", label: "Instagram" },
                { Icon: Linkedin,  href: "https://www.linkedin.com/company/buymydar", label: "LinkedIn" },
                { Icon: Facebook,  href: "https://www.facebook.com/buymydar", label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith("http") ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors group"
                      >
                        {label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider + bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row
                        items-center justify-between gap-3 text-xs text-slate-500">
          <p>{dict.copyright.replace("2026", String(year))}</p>
          <p>{dict.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
