import Link from "next/link";
import { Home, Twitter, Linkedin, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

interface FooterProps {
  lang: Locale;
  dict: {
    tagline: string;
    links: Record<string, string>;
    copyright: string;
  };
}

export function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Simulateur",
      links: [
        { label: "Simulateur crédit", href: `/${lang}#simulator` },
        { label: "Comparer les banques", href: `/${lang}#banks` },
        { label: "Guide MRE", href: `/${lang}#mre` },
        { label: "Blog & conseils", href: `/${lang}#insights` },
      ],
    },
    {
      title: "Banques",
      links: [
        { label: "Attijariwafa Bank", href: "https://www.attijariwafabank.com" },
        { label: "BCP (Banque Populaire)", href: "https://www.gbp.ma" },
        { label: "CIH Bank", href: "https://www.cihbank.ma" },
        { label: "CFG Bank", href: "https://www.cfgbank.com" },
      ],
    },
    {
      title: "BuyMyDar",
      links: Object.entries(dict.links).map(([, label]) => ({
        label,
        href: `/${lang}/about`,
      })),
    },
  ];

  return (
    <footer className="bg-slate-950 text-white mt-24" role="contentinfo">
      {/* Top wave separator */}
      <div className="overflow-hidden leading-[0] -mb-px">
        <svg viewBox="0 0 1440 40" className="w-full h-10 fill-[#F7F8FA]">
          <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2 space-y-5">
            <Link href={`/${lang}`} className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center
                              group-hover:bg-brand-500 transition-colors">
                <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl">
                Buy<span className="text-brand-400">My</span>Dar
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {dict.tagline}
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Twitter,   href: "#", label: "Twitter" },
                { Icon: Linkedin,  href: "#", label: "LinkedIn" },
                { Icon: Facebook,  href: "#", label: "Facebook" },
                { Icon: Instagram, href: "#", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center
                             transition-colors"
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
          <p>Simulation indicative. Pas un conseil financier agréé.</p>
        </div>
      </div>
    </footer>
  );
}
