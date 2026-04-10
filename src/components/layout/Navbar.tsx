"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, BarChart2, Users, ChevronDown, Map, Landmark } from "lucide-react";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lang: Locale;
  dict: {
    simulator: string;
    banks: string;
    mre: string;
    guide: string;
    mourabaha: string;
    login: string;
    contact: string;
    cta: string;
  };
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Swap just the locale segment so language switcher preserves current page
  const localizedPath = (l: Locale) => {
    const segments = pathname.split("/");
    segments[1] = l;
    // Strip hash anchors from path (can't be server-side)
    return segments.join("/").split("#")[0];
  };

  const links = [
    { href: `/${lang}#simulator`,  label: dict.simulator,  icon: BarChart2 },
    { href: `/${lang}#banks`,      label: dict.banks,      icon: BarChart2 },
    { href: `/${lang}/guide`,      label: dict.guide,      icon: Map },
    { href: `/${lang}/mre`,        label: dict.mre,        icon: Users },
    { href: `/${lang}/mourabaha`,  label: dict.mourabaha,  icon: Landmark },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "navbar-glass border-b border-white/60 shadow-sm" : "bg-white/95 backdrop-blur-sm"
      )}
      style={{ height: "var(--header-height)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5 shrink-0 group">
          <Image
            src="/logo.png"
            alt="BuyMyDar logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            priority
          />
          <span className="font-bold text-lg tracking-tight" style={{ color: "#1E3A6E" }}>
            Buy<span style={{ color: "#3358CB" }}>My</span>Dar
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600
                         hover:text-brand-600 hover:bg-brand-50 transition-all duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language picker */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                langOpen ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-100"
              )}
              aria-expanded={langOpen}
            >
              <span className="text-base">{localeFlags[lang]}</span>
              <span className="uppercase text-xs font-bold">{lang}</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", langOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute end-0 top-full mt-2 bg-white border border-slate-100
                             rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden min-w-[150px]"
                >
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={localizedPath(l)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                        l === lang
                          ? "bg-brand-50 text-brand-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                      onClick={() => setLangOpen(false)}
                    >
                      <span className="text-base">{localeFlags[l]}</span>
                      <span>{localeNames[l]}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href={`/${lang}/contact`}
            className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
                       border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-all"
          >
            {dict.contact}
          </Link>
          <a
            href={`https://credit.buymydar.com/${lang}/register`}
            className="hidden md:flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold
                       bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm shadow-orange-500/20"
          >
            {lang === "ar" ? "موافقة مسبقة ٤٨س*" : lang === "en" ? "Pre-approval 48h*" : "Pré-approbation 48h*"}
          </a>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-lg overflow-hidden"
          >
            <div className="px-3 py-2">
              {/* Nav links — compact rows */}
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium
                             text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-slate-100" />

              {/* Language + CTA row */}
              <div className="flex items-center justify-between px-1 pb-2 gap-3">
                {/* Language chips */}
                <div className="flex items-center gap-1.5">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={localizedPath(l)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                        l === lang
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-sm leading-none">{localeFlags[l]}</span>
                      <span className="uppercase">{l}</span>
                    </Link>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${lang}#simulator`}
                    className="btn-primary px-4 py-2 text-xs shrink-0"
                    onClick={() => setMenuOpen(false)}
                  >
                    {dict.cta}
                  </Link>
                  <a
                    href={`https://credit.buymydar.com/${lang}/register`}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-orange-500 text-white shrink-0"
                    onClick={() => setMenuOpen(false)}
                  >
                    48h →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
