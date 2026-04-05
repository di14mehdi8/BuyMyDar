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
 * Hidden (renders nothing) until a publisher ID is configured.
 * To activate: replace REPLACE_WITH_YOUR_PUBLISHER_ID and remove the early-return below.
 */
export function AdSlot({
  slotId,
  adClient = "ca-pub-REPLACE_WITH_YOUR_PUBLISHER_ID",
  format = "auto",
  className,
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isConfigured = !adClient.includes("REPLACE_WITH");

  useEffect(() => {
    if (!isConfigured || !ref.current) return;
    try {
      // @ts-ignore — AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, [isConfigured]);

  // Hidden until a real publisher ID is set
  if (!isConfigured) return null;

  return (
    <div
      className={cn("overflow-hidden", className)}
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
