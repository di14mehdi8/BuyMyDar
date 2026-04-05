"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, BarChart2, BookOpen, Users, ChevronDown, Map, FileText } from "lucide-react";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lang: Locale;
  dict: {
    simulator: string;
    banks: string;
    insights: string;
    mre: string;
    login: string;
    cta: string;
  };
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: `/${lang}#simulator`, label: dict.simulator, icon: BarChart2 },
    { href: `/${lang}#banks`,     label: dict.banks,     icon: BarChart2 },
    { href: `/${lang}/guide`,     label: "Guide",        icon: Map },
    { href: `/${lang}/mre`,       label: dict.mre,       icon: Users },
    { href: `/${lang}#insights`,  label: dict.insights,  icon: BookOpen },
    { href: `/${lang}/mourabaha`, label: "Mourabaha",    icon: FileText },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "navbar-glass border-b border-white/60 shadow-sm" : "bg-transparent"
      )}
      style={{ height: "var(--header-height)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5 shrink-0 group">
          <Image
            src={scrolled ? "/logo.png" : "/logo.png"}
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
                      href={`/${l}`}
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

          <Link href={`/${lang}#simulator`} className="hidden md:flex btn-primary px-5 py-2.5 text-sm">
            {dict.cta}
          </Link>

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
            className="md:hidden bg-white/96 backdrop-blur-xl border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                             text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}`}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      l === lang ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-lg">{localeFlags[l]}</span>
                    <span>{localeNames[l].split(" ")[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
