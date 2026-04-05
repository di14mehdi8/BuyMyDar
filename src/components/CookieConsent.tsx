"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bmd_consent";

function pushConsent(granted: boolean) {
  const value = granted ? "granted" : "denied";
  // @ts-expect-error dataLayer is injected by GTM
  window.dataLayer = window.dataLayer || [];
  // @ts-expect-error dataLayer is injected by GTM
  window.dataLayer.push({
    event: "consent_update",
    analytics_storage: value,
    ad_storage: "denied", // keep ads denied always for now
  });
  // Also use gtag consent update if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (window as any).gtag === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag("consent", "update", {
      analytics_storage: value,
      ad_storage: "denied",
    });
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    } else {
      pushConsent(stored === "granted");
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "granted");
    pushConsent(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "denied");
    pushConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[9999] px-4 pb-4 sm:pb-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-slate-600 flex-1 leading-relaxed">
          We use cookies to understand how visitors use BuyMyDar and improve the experience.
          No data is shared with advertisers.{" "}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: "#1E3A6E" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
