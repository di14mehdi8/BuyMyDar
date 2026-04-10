"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function NotFoundRedirect({ href }: { href: string }) {
  const [seconds, setSeconds] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (seconds <= 0) {
      router.replace(href);
      return;
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, href, router]);

  return (
    <p className="text-sm text-slate-400">
      Redirection automatique dans {seconds}s&hellip;
    </p>
  );
}
