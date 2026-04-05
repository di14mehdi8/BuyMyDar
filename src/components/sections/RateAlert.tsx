"use client";

import { useState } from "react";
import { Bell, Check, ArrowRight } from "lucide-react";
import { BANK_RATES } from "@/lib/mortgage/calculator";

export function RateAlert() {
  const [email,     setEmail]     = useState("");
  const [threshold, setThreshold] = useState(4.25);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const bestRate = Math.min(...BANK_RATES.map((b) => b.fixedRate)) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "e762052a-f003-4565-9792-e5b8abae9495",
          subject: `🔔 Nouvelle alerte taux — seuil ${threshold.toFixed(2)}%`,
          from_name: "BuyMyDar Rate Alert",
          email,
          message: `Demande d'alerte taux immobilier Maroc\n\nEmail : ${email}\nSeuil cible : ${threshold.toFixed(2)}%\nTaux actuel le plus bas : ${bestRate.toFixed(2)}%`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      aria-label="Alerte taux immobilier Maroc"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#3b82f6 100%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* Copy */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-blue-300" />
              <span className="text-blue-300 text-[10px] font-bold uppercase tracking-widest">
                Alerte taux — gratuit
              </span>
            </div>
            <h2 className="text-white font-bold text-xl md:text-2xl leading-snug mb-2">
              Soyez alerté quand les taux baissent
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
              Taux actuel le plus bas : <strong className="text-white">{bestRate.toFixed(2)}%</strong>.
              Définissez votre seuil cible et recevez un e-mail dès qu'une banque marocaine le franchit.
            </p>
          </div>

          {/* Form */}
          <div className="flex-1 max-w-sm">
            {submitted ? (
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-4">
                <div className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Alerte activée !</p>
                  <p className="text-blue-200 text-xs mt-0.5">
                    Vous serez notifié dès qu'un taux passe sous {threshold.toFixed(2)}%.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Threshold slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-blue-200">M'alerter quand le taux passe sous</span>
                    <span className="text-white font-bold">{threshold.toFixed(2)}%</span>
                  </div>
                  <div className="relative">
                    <div className="absolute top-[8px] left-0 right-0 h-1 rounded-full bg-white/20 pointer-events-none" />
                    <div
                      className="absolute top-[8px] left-0 h-1 rounded-full bg-white/60 pointer-events-none transition-all"
                      style={{ width: `${((threshold - 3.5) / (5.5 - 3.5)) * 100}%` }}
                    />
                    <input
                      type="range" min={3.5} max={5.5} step={0.05} value={threshold}
                      onChange={(e) => setThreshold(+e.target.value)}
                      className="relative w-full"
                      style={{
                        background: "transparent",
                        // override thumb style for dark bg
                      }}
                      aria-label="Seuil de taux"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-blue-300/60">
                    <span>3,50%</span><span>5,50%</span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                               text-white placeholder-blue-300/60 text-sm
                               focus:outline-none focus:border-white/50 transition-colors"
                    required
                  />
                  {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                             bg-white text-blue-800 font-semibold text-sm
                             hover:bg-blue-50 transition-colors shadow-lg shadow-black/20"
                >
                  Activer l'alerte
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-blue-300/60 text-center">
                  Gratuit · Aucun spam · Désabonnement en un clic
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
