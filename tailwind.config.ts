import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#1565C0",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#1E3073",
          950: "#0D1B2A",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted:   "#F7F8FA",
          subtle:  "#F1F5F9",
          border:  "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "bento":    "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "bento-lg": "0 4px 24px 0 rgb(0 0 0 / 0.08)",
        "bento-xl": "0 8px 40px 0 rgb(0 0 0 / 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
