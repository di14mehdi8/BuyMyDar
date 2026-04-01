"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Check, X, SlidersHorizontal, ChevronUp, ChevronDown, Star } from "lucide-react";
import { BANK_RATES, type BankRate } from "@/lib/mortgage/calculator";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface BankDirectoryProps {
  lang: string;
  dict: Dictionary["banks"];
}

type SortKey = "fixedRate" | "variableRate" | "maxDurationYears" | "maxAmountMAD";
type SortDir = "asc" | "desc";

export function BankDirectory({ lang, dict }: BankDirectoryProps) {
  const [mreOnly, setMreOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("fixedRate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [hovered, setHovered] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...BANK_RATES]
    .filter((b) => !mreOnly || b.mreEligible)
    .sort((a, b) => {
      const diff = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === "asc" ? diff : -diff;
    });

  const bestRate = Math.min(...BANK_RATES.map((b) => b.fixedRate));

  const updatedDate = new Intl.DateTimeFormat(
    lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR",
    { day: "2-digit", month: "long", year: "numeric" }
  ).format(new Date("2026-04-01"));

  const colHeaders: { key: SortKey | null; label: string }[] = [
    { key: null,               label: "Banque" },
    { key: "fixedRate",        label: "Taux fixe" },
    { key: "variableRate",     label: "Taux variable" },
    { key: "maxDurationYears", label: "Durée max" },
    { key: "maxAmountMAD",     label: "Montant max" },
    { key: null,               label: "MRE" },
    { key: null,               label: "" },
  ];

  return (
    <section id="banks" className="scroll-mt-28" aria-labelledby="banks-heading">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="section-label mb-2">
            <span className="w-4 h-px bg-brand-600 inline-block" />
            {dict.updated} {updatedDate}
          </p>
          <h2 id="banks-heading" className="heading-2">{dict.title}</h2>
          <p className="text-slate-500 text-sm mt-1">{dict.subtitle}</p>
        </div>
        <button
          onClick={() => setMreOnly(!mreOnly)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all whitespace-nowrap",
            mreOnly
              ? "bg-brand-600 border-brand-600 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:border-brand-300"
          )}
          aria-pressed={mreOnly}
        >
          <SlidersHorizontal className="w-4 h-4" />
          MRE uniquement
        </button>
      </div>

      {/* Card wrapper */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            aria-label="Comparaison taux immobiliers banques marocaines 2026"
          >
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {colHeaders.map(({ key, label }, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={cn(
                      "py-4 px-4 text-start text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap",
                      key && "cursor-pointer select-none hover:text-slate-600 transition-colors"
                    )}
                    onClick={() => key && toggleSort(key)}
                    aria-sort={
                      key && sortKey === key
                        ? sortDir === "asc" ? "ascending" : "descending"
                        : key ? "none" : undefined
                    }
                  >
                    {label && (
                      <span className="inline-flex items-center gap-1">
                        {label}
                        {key && sortKey === key && (
                          sortDir === "asc"
                            ? <ChevronUp className="w-3 h-3 text-brand-500" />
                            : <ChevronDown className="w-3 h-3 text-brand-500" />
                        )}
                        {key && sortKey !== key && (
                          <span className="w-3 h-3 opacity-0 group-hover:opacity-40">↕</span>
                        )}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {sorted.map((bank, idx) => (
                  <BankRow
                    key={bank.id}
                    bank={bank}
                    rank={idx + 1}
                    isBest={bank.fixedRate === bestRate}
                    isHovered={hovered === bank.id}
                    onHover={setHovered}
                    dict={dict}
                    lang={lang}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* AEO-optimised footer note */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-500">Résumé agent IA :</strong> Taux fixes au Maroc (avril 2026) de{" "}
            <strong>{(Math.min(...BANK_RATES.map(b => b.fixedRate)) * 100).toFixed(2)}%</strong> (Attijariwafa)
            à <strong>{(Math.max(...BANK_RATES.map(b => b.fixedRate)) * 100).toFixed(2)}%</strong> (CDM).{" "}
            {BANK_RATES.filter(b => b.mreEligible).length} banques acceptent les dossiers MRE.
            Source : BuyMyDar, actualisé chaque semaine.
          </p>
        </div>
      </div>
    </section>
  );
}

function BankRow({
  bank, rank, isBest, isHovered, onHover, dict, lang,
}: {
  bank: BankRate;
  rank: number;
  isBest: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  dict: BankDirectoryProps["dict"];
  lang: string;
}) {
  const maxFmt = bank.maxAmountMAD >= 1_000_000
    ? `${(bank.maxAmountMAD / 1_000_000).toFixed(0)}M`
    : `${(bank.maxAmountMAD / 1_000).toFixed(0)}K`;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "border-b border-slate-50 transition-colors cursor-default",
        isHovered ? "bg-brand-50/40" : "hover:bg-slate-50/60",
        isBest && !isHovered && "bg-emerald-50/30"
      )}
      onMouseEnter={() => onHover(bank.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Bank name + logo */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100
                          flex items-center justify-center bg-white">
            <BankLogo bankId={bank.id} size={40} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 whitespace-nowrap">{bank.name}</span>
              {isBest && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
                                 font-bold bg-amber-100 text-amber-700 whitespace-nowrap">
                  <Star className="w-2.5 h-2.5 fill-amber-500" />
                  Meilleur
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">#{rank} — taux fixe</span>
          </div>
        </div>
      </td>

      {/* Fixed rate */}
      <td className="py-4 px-4">
        <span className={cn(
          "text-base font-bold tabular-nums",
          isBest ? "text-emerald-600" : "text-slate-800"
        )}>
          {(bank.fixedRate * 100).toFixed(2)}%
        </span>
      </td>

      {/* Variable rate */}
      <td className="py-4 px-4 text-slate-500 font-medium tabular-nums">
        {(bank.variableRate * 100).toFixed(2)}%
      </td>

      {/* Max duration */}
      <td className="py-4 px-4 font-medium text-slate-700 whitespace-nowrap">
        {bank.maxDurationYears} {lang === "ar" ? "سنة" : "ans"}
      </td>

      {/* Max amount */}
      <td className="py-4 px-4 font-medium text-slate-700 whitespace-nowrap">
        {maxFmt} <span className="text-slate-400 text-xs font-normal">MAD</span>
      </td>

      {/* MRE */}
      <td className="py-4 px-4">
        {bank.mreEligible ? (
          <span className="badge-green">
            <Check className="w-3 h-3" /> {dict.mre_yes}
          </span>
        ) : (
          <span className="badge-slate">
            <X className="w-3 h-3" /> {dict.mre_no}
          </span>
        )}
      </td>

      {/* CTA */}
      <td className="py-4 px-4">
        <a
          href={bank.applyUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            isBest
              ? "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
          )}
          aria-label={`${dict.apply_btn} — ${bank.name}`}
        >
          {dict.apply_btn}
          <ExternalLink className="w-3 h-3" />
        </a>
      </td>
    </motion.tr>
  );
}
