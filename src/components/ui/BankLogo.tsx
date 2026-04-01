/**
 * BankLogo — SVG logo representations for Moroccan banks.
 * Uses each bank's official brand color + stylised monogram.
 * No external images required — all inline SVG, zero network calls.
 */

interface BankLogoProps {
  bankId: string;
  size?: number;
  className?: string;
}

const LOGOS: Record<
  string,
  { bg: string; text: string; label: string; shape?: "circle" | "shield" | "hex" }
> = {
  attijariwafa: { bg: "#E31837", text: "#fff", label: "ATW",   shape: "circle"  },
  bcp:          { bg: "#009B3A", text: "#fff", label: "BCP",   shape: "shield"  },
  bmce:         { bg: "#0055A4", text: "#fff", label: "BOA",   shape: "circle"  },
  cih:          { bg: "#00A651", text: "#fff", label: "CIH",   shape: "circle"  },
  bmci:         { bg: "#00965E", text: "#fff", label: "BMCI",  shape: "hex"     },
  saham:        { bg: "#C8102E", text: "#fff", label: "SHM",   shape: "shield"  },
  cdm:          { bg: "#004899", text: "#fff", label: "CDM",   shape: "circle"  },
  cfg:          { bg: "#6B21A8", text: "#fff", label: "CFG",   shape: "hex"     },
};

export function BankLogo({ bankId, size = 40, className = "" }: BankLogoProps) {
  const cfg = LOGOS[bankId] ?? { bg: "#64748b", text: "#fff", label: "??", shape: "circle" };

  const r = size / 2;
  const fontSize = size * 0.28;

  if (cfg.shape === "shield") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={className}
        aria-label={cfg.label}
        role="img"
      >
        <path
          d="M20 2 L36 8 L36 22 Q36 32 20 38 Q4 32 4 22 L4 8 Z"
          fill={cfg.bg}
        />
        <text
          x="20"
          y="22"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={cfg.text}
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-0.5"
        >
          {cfg.label}
        </text>
      </svg>
    );
  }

  if (cfg.shape === "hex") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        className={className}
        aria-label={cfg.label}
        role="img"
      >
        <polygon
          points="20,2 36,11 36,29 20,38 4,29 4,11"
          fill={cfg.bg}
        />
        <text
          x="20"
          y="21"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={cfg.text}
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-0.5"
        >
          {cfg.label}
        </text>
      </svg>
    );
  }

  // Default: circle
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-label={cfg.label}
      role="img"
    >
      <circle cx="20" cy="20" r="18" fill={cfg.bg} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={cfg.text}
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        letterSpacing="-0.5"
      >
        {cfg.label}
      </text>
    </svg>
  );
}
