"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  slotId: string;
  adClient?: string;
  format?: "auto" | "rectangle" | "leaderboard" | "banner";
  className?: string;
  label?: string;
}

/**
 * Google AdSense slot component.
 * - Renders a placeholder in development.
 * - In production, swap the placeholder div for the <ins> AdSense tag.
 * - Aria-hidden to prevent screen reader noise.
 */
export function AdSlot({
  slotId,
  adClient = "ca-pub-REPLACE_WITH_YOUR_PUBLISHER_ID",
  format = "auto",
  className,
  label = "Publicité",
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (isDev || !ref.current) return;
    try {
      // @ts-ignore — AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, [isDev]);

  const sizeClasses: Record<string, string> = {
    auto:        "min-h-[100px]",
    rectangle:   "w-[300px] h-[250px]",
    leaderboard: "w-full h-[90px]",
    banner:      "w-full h-[60px]",
  };

  if (isDev) {
    return (
      <div
        className={cn(
          "ad-slot flex flex-col items-center justify-center gap-2",
          sizeClasses[format],
          className
        )}
        aria-hidden="true"
        role="presentation"
      >
        <p className="text-xs text-slate-300 uppercase tracking-widest font-semibold">{label}</p>
        <p className="text-xs text-slate-300 font-mono">{slotId}</p>
        <p className="text-[10px] text-slate-300/60">{format} · AdSense placeholder</p>
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-hidden", sizeClasses[format], className)}
      aria-hidden="true"
      role="presentation"
      ref={ref}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
