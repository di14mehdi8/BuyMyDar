"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, Check, X, SlidersHorizontal,
  ChevronUp, ChevronDown, Star, Users,
} from "lucide-react";
import { BANK_RATES, type BankRateEntry } from "@/lib/mortgage/calculator";
import { BankLogo } from "@/components/ui/BankLogo";
import { PromoBadge } from "@/components/ui/PromoBadge";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/getDictionary";

interface BankDirectoryProps {
  lang: string;
  dict: Dictionary["banks"];
}

type SortKey = "fixedRate" | "variableRate" | "maxDurationYears" | "maxAmountMAD";
type SortDir = "asc" | "desc";
type Filter = "all" | "mre" | "youth" | "state-aid";

const FILTER_LABELS: Record<Filter, string> = {
  all:        "Toutes les banques",
  mre:        "MRE",
  youth:      "Moins de 35 ans",
  "state-aid": "Daam Sakane",
};

export function BankDirectory({ lang, dict }: BankDirectoryProps) {
  const [filter,  setFilter]  = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("fixedRate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [hovered, setHovered] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...BANK_RATES]
    .filter((b) => {
      if (filter === "mre") return b.mreEligible;
      if (filter === "youth") return b.promotions.some(p => p.tag === "youth");
      if (filter === "state-aid") return b.daamsakan || b.promotions.some(p => p.tag === "state-aid");
      return true;
    })
    .sort((a, b) => {
      const diff = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === "asc" ? diff : -diff;
    });

  const bestRate  = Math.min(...BANK_RATES.map(b => b.fixedRate));
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
    { key: null,               label: "Offres spéciales" },
    { key: null,               label: "" },
  ];

  return (
    <section id="banks" className="scroll-mt-28" aria-labelledby="banks-heading">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="section-label mb-2">
            <span className="w-4 h-px bg-brand-600 inline-block" />
            {dict.updated} {updatedDate} · Source : BAM + sites officiels
          </p>
          <h2 id="banks-heading" className="heading-2">{dict.title}</h2>
          <p className="text-slate-500 text-sm mt-1">{dict.subtitle}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.entries(FILTER_LABELS) as [Filter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all",
              filter === key
                ? "bg-brand-600 border-brand-600 text-white shadow-sm shadow-brand-600/20"
                : "bg-white border-slate-200 text-slate-600 hover:border-brand-300"
            )}
            aria-pressed={filter === key}
          >
            {key === "mre" && <Users className="w-3.5 h-3.5" />}
            {label}
            {key !== "all" && (
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md font-bold ml-0.5",
                filter === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              )}>
                {key === "mre"
                  ? BANK_RATES.filter(b => b.mreEligible).length
                  : key === "youth"
                  ? BANK_RATES.filter(b => b.promotions.some(p => p.tag === "youth")).length
                  : BANK_RATES.filter(b => b.daamsakan || b.promotions.some(p => p.tag === "state-aid")).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
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

        {/* AEO summary footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-500">Résumé (AEO) :</strong> Taux fixes Maroc (avril 2026) de{" "}
            <strong>{(Math.min(...BANK_RATES.map(b => b.fixedRate)) * 100).toFixed(2)}%</strong> (Attijariwafa)
            à <strong>{(Math.max(...BANK_RATES.map(b => b.fixedRate)) * 100).toFixed(2)}%</strong> (CDM). BAM taux directeur : 2.50%.{" "}
            {BANK_RATES.filter(b => b.mreEligible).length} banques MRE.{" "}
            {BANK_RATES.filter(b => b.daamsakan).length} banques Daam Sakane. Source : BuyMyDar + BAM + sites banques.
          </p>
        </div>
      </div>
    </section>
  );
}

function BankRow({
  bank, rank, isBest, isHovered, onHover, dict, lang,
}: {
  bank: BankRateEntry;
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

  // Show the extended MRE duration if it differs from standard
  const durationLabel = bank.maxDurationMREYears && bank.maxDurationMREYears > bank.maxDurationYears
    ? `${bank.maxDurationYears} ans`
    : `${bank.maxDurationYears} ans`;

  const mreExtension = bank.maxDurationMREYears && bank.maxDurationMREYears > bank.maxDurationYears
    ? `${bank.maxDurationMREYears} ans MRE`
    : null;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "border-b border-slate-50 transition-colors",
        isHovered ? "bg-brand-50/40" : "hover:bg-slate-50/60",
        isBest && !isHovered && "bg-emerald-50/30"
      )}
      onMouseEnter={() => onHover(bank.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Bank name + logo */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100 flex items-center justify-center bg-white">
            <BankLogo bankId={bank.id} size={40} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 whitespace-nowrap">{bank.name}</span>
              {isBest && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                  <Star className="w-2.5 h-2.5 fill-amber-500" /> Meilleur taux
                </span>
              )}
              {bank.daamsakan && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                  🏛 Daam Sakane
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">
              #{rank} · taux fixe min {((bank.fixedRateMin ?? bank.fixedRate) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </td>

      {/* Fixed rate */}
      <td className="py-4 px-4">
        <div>
          <span className={cn("text-base font-bold tabular-nums", isBest ? "text-emerald-600" : "text-slate-800")}>
            {(bank.fixedRate * 100).toFixed(2)}%
          </span>
          {bank.fixedRateMin && bank.fixedRateMin < bank.fixedRate && (
            <p className="text-[10px] text-emerald-600 font-medium">
              dès {(bank.fixedRateMin * 100).toFixed(2)}% ✦
            </p>
          )}
        </div>
      </td>

      {/* Variable rate */}
      <td className="py-4 px-4 text-slate-500 font-medium tabular-nums">
        {(bank.variableRate * 100).toFixed(2)}%
      </td>

      {/* Duration */}
      <td className="py-4 px-4">
        <span className="font-medium text-slate-700">{durationLabel}</span>
        {mreExtension && (
          <p className="text-[10px] text-blue-600 font-semibold">{mreExtension} 🌍</p>
        )}
      </td>

      {/* Max amount */}
      <td className="py-4 px-4 font-medium text-slate-700 whitespace-nowrap">
        {maxFmt} <span className="text-slate-400 text-xs font-normal">MAD</span>
        {bank.maxLTVMRE && bank.maxLTVMRE > 1.0 && (
          <p className="text-[10px] text-blue-600 font-semibold">{(bank.maxLTVMRE * 100).toFixed(0)}% LTV MRE</p>
        )}
      </td>

      {/* MRE */}
      <td className="py-4 px-4">
        {bank.mreEligible ? (
          <span className="badge-green">
            <Check className="w-3 h-3" /> Oui
          </span>
        ) : (
          <span className="badge-slate">
            <X className="w-3 h-3" /> Non
          </span>
        )}
      </td>

      {/* Promotions */}
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-1.5">
          {bank.promotions.map((promo, i) => (
            <PromoBadge key={i} promo={promo} size="sm" />
          ))}
          {bank.promotions.length === 0 && (
            <span className="text-xs text-slate-300">—</span>
          )}
        </div>
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
        >
          {dict.apply_btn}
          <ExternalLink className="w-3 h-3" />
        </a>
      </td>
    </motion.tr>
  );
}
