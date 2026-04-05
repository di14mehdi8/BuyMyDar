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
          50:  "#EEF3FF",
          100: "#DDE6FF",
          200: "#C2D0FF",
          300: "#8EA9F5",
          400: "#5C7FE8",
          500: "#3358CB",
          600: "#1E3A6E",  /* logo primary navy */
          700: "#162D56",
          800: "#0F2040",
          900: "#09152A",
          950: "#040B17",
        },
        accent: {
          400: "#56B462",
          500: "#3A9648",
          600: "#2D7A3A",  /* logo window-pane green */
          700: "#1F5928",
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
